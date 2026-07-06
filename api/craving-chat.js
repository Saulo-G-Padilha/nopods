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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Muitas mensagens seguidas. Espera um minuto e tenta de novo.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Assistente não configurado. O administrador precisa adicionar a chave da API.' });
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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        max_tokens: 280,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI error:', response.status, await response.text());
      return res.status(502).json({ error: 'Não consegui responder agora. Tenta de novo em instantes.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({ error: 'Resposta vazia. Tenta de novo.' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('craving-chat error:', err);
    return res.status(500).json({ error: 'Erro interno. Tenta de novo.' });
  }
}
