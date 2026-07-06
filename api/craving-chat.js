const SYSTEM_PROMPT = `Você conversa no NoPods com alguém que quer largar pods (nicotina salina). Você não é terapeuta nem médico — é presença humana, como um amigo que já passou por fissura e sabe como dói.

COMO SER HUMANO:
- Fale em português brasileiro natural. Pode usar "tá", "né", "olha", "cara" com moderação.
- Primeiro acolha o que a pessoa disse. Depois, se couber, uma orientação pequena.
- Soe como mensagem de WhatsApp de alguém que se importa — não como artigo, coach ou robô.
- Varie as respostas. Não repita as mesmas frases.
- No máximo UMA pergunta gentil por resposta, só se ajudar a pessoa a pensar ("o que tá pegando mais agora?", "foi depois de alguma coisa?").

AUTOAJUDA (use uma técnica por vez, sem listar):
- Respiração: 4 segundos entrando, 7 segurando, 8 saindo.
- Ancoragem: "só os próximos 5 minutos", "não precisa decidir o resto do dia".
- Nomear: "isso é fissura, não é você precisando de pod pra viver".
- Ação mínima: água, levantar, gelo na mão, mandar mensagem pra alguém, mudar de cômodo.
- Separar vontade de ação: sentir vontade é permitido; comprar o pod é uma escolha que pode esperar.

O QUE EVITAR:
- Clichês motivacionais ("você é forte", "foco na meta", "acredite em você").
- Listas numeradas, bullets, tom professoral.
- Textões. A pessoa está em crise e lê no celular.
- Julgar, culpar, dramatizar recaída.
- Dizer que é IA, bot ou assistente.
- Prescrever medicamentos ou substitutos.

SE CRISE GRAVE (pensar em se machucar): com calma, sugira CVV 188 (24h).

TAMANHO: 2 a 5 frases curtas. Espelhe o tamanho da mensagem da pessoa.`;

const rateLimitMap = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 12;

function checkRateLimit(ip) {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    entry = { start: now, count: 0 };
    rateLimitMap.set(ip, entry);
  }
  entry.count += 1;
  if (rateLimitMap.size > 5000) {
    const cutoff = now - RATE_WINDOW_MS;
    for (const [key, val] of rateLimitMap) {
      if (val.start < cutoff) rateLimitMap.delete(key);
    }
  }
  return entry.count <= RATE_MAX;
}

function buildContextBlock(ctx) {
  if (!ctx || typeof ctx !== 'object') return '';
  const parts = [];
  if (ctx.daysFree != null && ctx.daysFree > 0) {
    parts.push(`Está há ${ctx.daysFree} dia(s) sem pod nesta tentativa.`);
  } else if (ctx.hoursFree != null) {
    parts.push(`Está há ${ctx.hoursFree} hora(s) sem pod — começo da jornada.`);
  }
  if (ctx.todayCravings != null && ctx.todayCravings > 0) {
    parts.push(`Já soltou ${ctx.todayCravings} fissura(s) hoje — está lutando ativamente.`);
  }
  if (ctx.totalCravingsResisted != null && ctx.totalCravingsResisted > 0) {
    parts.push(`No total já soltou ${ctx.totalCravingsResisted} fissuras.`);
  }
  if (ctx.mood) parts.push(`Humor de hoje: ${ctx.mood}.`);
  if (ctx.programDay) parts.push(`Está no dia ${ctx.programDay} do programa da primeira semana.`);
  if (ctx.peakHour != null) parts.push(`Costuma ter pico de fissura por volta das ${ctx.peakHour}h.`);
  if (ctx.reason) parts.push(`Motivo pessoal para parar: "${ctx.reason}". Use com delicadeza, não repita literalmente toda hora.`);
  if (ctx.restarts != null && ctx.restarts > 0) {
    parts.push(`Já recomeçou ${ctx.restarts} vez(es) — trate com compaixão, não como fracasso.`);
  }
  if (!parts.length) return '';
  return `\n\nO que você sabe sobre essa pessoa (integre com naturalidade, não recite como ficha):\n${parts.join(' ')}`;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-6)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 800) }));
}

function mapProviderError(status, payload) {
  const code = payload?.error?.code || payload?.error?.type || '';
  const msg = payload?.error?.message || '';

  if (status === 401 || code === 'invalid_api_key') {
    return { error: 'Chave de API inválida na Vercel.', code: code || 'invalid_api_key' };
  }
  if (status === 429 || code === 'insufficient_quota' || code === 'billing_hard_limit_reached') {
    return { error: 'Sem créditos no provedor de IA. Verifique billing ou use GROQ_API_KEY (grátis).', code: code || 'insufficient_quota' };
  }
  if (status === 404 || code === 'model_not_found') {
    return { error: 'Modelo não disponível. Ajuste GROQ_MODEL ou OPENAI_MODEL na Vercel.', code: code || 'model_not_found' };
  }
  if (code === 'rate_limit_exceeded') {
    return { error: 'Limite de requisições. Espera um minuto.', code };
  }
  return {
    error: msg && msg.length < 160 ? msg : 'Provedor de IA indisponível.',
    code: code || `http_${status}`,
  };
}

async function callChatAPI(baseUrl, apiKey, messages, model, maxTokens = 320) {
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.88,
      presence_penalty: 0.3,
      frequency_penalty: 0.2,
    }),
  });

  const raw = await response.text();
  let payload = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    payload = null;
  }

  return { ok: response.ok, status: response.status, payload };
}

function getGroqKey() {
  return (process.env.GROQ_API_KEY || process.env.GROQ_KEY || '').trim();
}

function getOpenAIKey() {
  return (process.env.OPENAI_API_KEY || '').trim();
}

async function tryProviders(messages) {
  const attempts = [];
  const openaiKey = getOpenAIKey();
  const groqKey = getGroqKey();

  // Groq primeiro — gratuito e é o que a maioria configura
  if (groqKey) {
    const groqModels = [
      (process.env.GROQ_MODEL || '').trim(),
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
    ].filter(Boolean);
    const uniqueGroqModels = [...new Set(groqModels)];
    for (const m of uniqueGroqModels) {
      attempts.push({
        provider: 'groq',
        model: m,
        result: await callChatAPI('https://api.groq.com/openai', groqKey, messages, m),
      });
    }
  }

  if (openaiKey) {
    const model = (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
    const models = model === 'gpt-3.5-turbo' ? [model] : [model, 'gpt-3.5-turbo'];
    for (const m of models) {
      attempts.push({
        provider: 'openai',
        model: m,
        result: await callChatAPI('https://api.openai.com', openaiKey, messages, m),
      });
    }
  }

  const failures = [];

  for (const attempt of attempts) {
    const { ok, status, payload } = attempt.result;
    if (ok) {
      const reply = payload?.choices?.[0]?.message?.content?.trim();
      if (reply) return { reply, provider: attempt.provider };
    }
    console.error(`${attempt.provider} error:`, attempt.model, status, JSON.stringify(payload));
    failures.push(mapProviderError(status, payload));
    // Continua tentando outros modelos/provedores
  }

  if (failures.length) {
    const groqFail = failures.find((f) => f.code === 'invalid_api_key');
    if (groqFail && groqKey) {
      return { fail: { error: 'GROQ_API_KEY inválida. Gere uma nova em console.groq.com e redeploy na Vercel.', code: 'invalid_api_key' } };
    }
    return { fail: failures[failures.length - 1] };
  }

  return { fail: { error: 'IA não configurada. Adicione GROQ_API_KEY (grátis) nas Environment Variables da Vercel e faça Redeploy.', code: 'no_keys' } };
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const groqKey = getGroqKey();
    const openaiKey = getOpenAIKey();
    return res.status(200).json({
      ok: true,
      version: 4,
      openai: Boolean(openaiKey),
      groq: Boolean(groqKey),
      configured: Boolean(groqKey || openaiKey),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Muitas mensagens seguidas. Espera um minuto e tenta de novo.' });
  }

  const { message, history = [], context = {} } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Mensagem vazia.' });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: 'Mensagem muito longa (máx. 500 caracteres).' });
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + buildContextBlock(context) },
    ...sanitizeHistory(history),
    { role: 'user', content: message.trim() },
  ];

  try {
    const outcome = await tryProviders(messages);
    if (outcome.reply) {
      return res.status(200).json({ reply: outcome.reply });
    }
    return res.status(502).json(outcome.fail);
  } catch (err) {
    console.error('craving-chat error:', err);
    return res.status(500).json({ error: 'Erro interno. Tenta de novo.', code: 'server_error' });
  }
};
