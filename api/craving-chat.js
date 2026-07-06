const SYSTEM_PROMPT = `Você é o assistente de apoio do NoPods — app para largar pods com nicotina salina.

Regras:
- Tom: direto, compassivo, brasileiro, humano. Sem clichês de coach ou frases de cartaz motivacional.
- Respostas CURTAS: 2 a 4 frases. A pessoa está em fissura e não vai ler textão.
- Foco: ajudar a atravessar os próximos minutos, não resolver a vida.
- Nunca julgue, nunca use culpa. Recaída não é tema para bronca.
- Não prescreva medicamentos nem substitutos específicos.
- Se mencionar crise emocional grave ou pensamentos de se machucar: oriente CVV 188 (24h) com gentileza.
- Não diga que é IA a menos que perguntem.
- Específico para pods/vape com nicotina salina — não assuma que é cigarro, mas a dependência de nicotina é a mesma.`;

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
  if (ctx.daysFree != null) parts.push(`Dias sem pod nesta tentativa: ${ctx.daysFree}`);
  if (ctx.hoursFree != null && ctx.daysFree < 1) parts.push(`Horas sem pod: ${ctx.hoursFree}`);
  if (ctx.todayCravings != null) parts.push(`Fissuras soltas hoje: ${ctx.todayCravings}`);
  if (ctx.totalCravingsResisted != null) parts.push(`Total de fissuras soltas: ${ctx.totalCravingsResisted}`);
  if (ctx.mood) parts.push(`Humor de hoje: ${ctx.mood}`);
  if (ctx.programDay) parts.push(`Dia ${ctx.programDay} do programa da primeira semana`);
  if (ctx.peakHour != null) parts.push(`Horário de pico de fissuras: ${ctx.peakHour}h`);
  if (ctx.reason) parts.push(`Motivo pessoal para parar: "${ctx.reason}"`);
  if (ctx.restarts != null && ctx.restarts > 0) parts.push(`Recomeços anteriores: ${ctx.restarts}`);
  if (!parts.length) return '';
  return `\n\nContexto da jornada (use com naturalidade, não cite como lista):\n${parts.join('\n')}`;
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
    return { error: 'Modelo não disponível. Ajuste OPENAI_MODEL na Vercel.', code: code || 'model_not_found' };
  }
  if (code === 'rate_limit_exceeded') {
    return { error: 'Limite de requisições. Espera um minuto.', code };
  }
  return {
    error: msg && msg.length < 160 ? msg : 'Provedor de IA indisponível.',
    code: code || `http_${status}`,
  };
}

async function callChatAPI(baseUrl, apiKey, messages, model, maxTokens = 280) {
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
      temperature: 0.75,
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

async function tryProviders(messages) {
  const attempts = [];
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const groqKey = process.env.GROQ_API_KEY?.trim();

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

  if (groqKey) {
    const groqModel = (process.env.GROQ_MODEL || 'llama-3.1-8b-instant').trim();
    attempts.push({
      provider: 'groq',
      model: groqModel,
      result: await callChatAPI('https://api.groq.com/openai', groqKey, messages, groqModel),
    });
  }

  for (const attempt of attempts) {
    const { ok, status, payload } = attempt.result;
    if (ok) {
      const reply = payload?.choices?.[0]?.message?.content?.trim();
      if (reply) return { reply, provider: attempt.provider };
    }
    console.error(`${attempt.provider} error:`, attempt.model, status, JSON.stringify(payload));
    const mapped = mapProviderError(status, payload);
    if (status === 401 || mapped.code === 'insufficient_quota') {
      return { fail: mapped };
    }
  }

  const last = attempts[attempts.length - 1];
  if (last) {
    return { fail: mapProviderError(last.result.status, last.result.payload) };
  }

  return { fail: { error: 'Nenhuma chave de IA configurada. Adicione OPENAI_API_KEY ou GROQ_API_KEY na Vercel.', code: 'no_keys' } };
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      openai: Boolean(process.env.OPENAI_API_KEY?.trim()),
      groq: Boolean(process.env.GROQ_API_KEY?.trim()),
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
