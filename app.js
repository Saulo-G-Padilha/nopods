(function () {
  'use strict';

  const STORAGE_KEY = 'nopods_data';
  const THEME_KEY = 'nopods_theme';
  const GOAL_HOURS = 2160;
  const RING_CIRC = 327;

  const CRAVING_TIPS = [
    'Sais de nicotina criam dependência rápida — a fissura é química, não fraqueza. Ela vai passar.',
    'Beba um copo de água gelada. A sensação no céu da boca imita o "hit" do pod sem nicotina.',
    'Lave o rosto com água fria ou segure gelo nas mãos. Muda a atenção do cérebro imediatamente.',
    'Respire: 4 segundos inspirando, 7 segurando, 8 expirando. Repita 4 vezes.',
    'Você não precisa de "só mais um puff". O pod inteiro sempre começa com um puff.',
    'Caminhe por 3 minutos. O movimento libera dopamina natural — o que o pod roubava de você.',
    'Lembre: cada pod tem até 50mg de nicotina. Um cigarro tem ~10mg. Você está vencendo algo forte.',
    'Mastigue algo com sabor forte — hortelã, goma, limão. O paladar ajuda a quebrar o reflexo.',
    'A abstinência de sais de nicotina pode durar 2–4 semanas. Cada dia fica mais fácil.',
    'Ligue para alguém ou mande mensagem. Falar sobre a fissura reduz a intensidade pela metade.',
    'Suas mãos estão acostumadas a segurar o pod. Segure um lápis, uma pedra, qualquer coisa.',
    'A nicotina mascarava ansiedade. Agora você sente de verdade — e isso é o caminho para curar.',
    'Pense no dinheiro: cada pod que você não compra é liberdade, não sacrifício.',
    'Leia seu "porquê" em voz alta. A razão emocional é mais forte que a fissura química.',
    'A fissura dura em média 3–5 minutos. Olhe o timer. Você já está vencendo.',
  ];

  const MOOD_MESSAGES = {
    great: 'Bom sinal. Guarda esse humor pra quando apertar de novo.',
    ok: 'Dia normal também conta. Não precisa ser épico todo dia.',
    hard: 'Peso no peito é normal nessa fase. O Soltar tá aqui se precisar.',
    strong: 'Tá segurando bem. Segue no seu ritmo.',
  };

  const MILESTONES = [
    { hours: 0.5, icon: '⚡', title: '30 minutos', desc: 'Frequência cardíaca e pressão começam a normalizar' },
    { hours: 2, icon: '🧠', title: '2 horas', desc: 'Nicotina começa a sair do sangue' },
    { hours: 8, icon: '😴', title: '8 horas', desc: 'Nível de oxigênio no sangue melhora' },
    { hours: 24, icon: '🫁', title: '1 dia', desc: 'Pulmões começam a eliminar resíduos' },
    { hours: 48, icon: '👃', title: '2 dias', desc: 'Paladar e olfato começam a voltar' },
    { hours: 72, icon: '💪', title: '3 dias', desc: 'Pico de abstinência — depois melhora' },
    { hours: 168, icon: '🌟', title: '1 semana', desc: 'Ansiedade e irritação diminuem bastante' },
    { hours: 336, icon: '🎯', title: '2 semanas', desc: 'Circulação melhora, fissuras mais raras' },
    { hours: 720, icon: '🏆', title: '1 mês', desc: 'Receptores de nicotina se reequilibram' },
    { hours: 2160, icon: '👑', title: '3 meses', desc: 'Dependência química praticamente vencida' },
  ];

  const HEALTH_TIMELINE = [
    { hours: 0.33, when: '20 min', title: 'Coração mais calmo', desc: 'Pressão arterial e batimentos começam a baixar.' },
    { hours: 2, when: '2 horas', title: 'Nicotina caindo', desc: 'Metade da nicotina já saiu do seu corpo.' },
    { hours: 8, when: '8 horas', title: 'Oxigênio subindo', desc: 'Sangue carrega mais oxigênio.' },
    { hours: 24, when: '1 dia', title: 'Pulmões trabalhando', desc: 'Cílios pulmonares começam a limpar resíduos.' },
    { hours: 48, when: '2 dias', title: 'Sentidos voltando', desc: 'Paladar e olfato ficam mais aguçados.' },
    { hours: 72, when: '3 dias', title: 'Pico difícil', desc: 'Abstinência mais forte — depois de hoje alivia.' },
    { hours: 168, when: '1 semana', title: 'Respirar melhor', desc: 'Menos falta de ar, mais energia.' },
    { hours: 720, when: '1 mês', title: 'Cérebro se reorganiza', desc: 'Receptores de nicotina voltam ao normal.' },
    { hours: 2160, when: '3 meses', title: 'Vitória real', desc: 'Risco de recaída cai drasticamente.' },
  ];

  const FUTURE_BENEFITS = [
    { icon: '🫁', title: 'Pulmões livres', desc: 'Capacidade respiratória continua melhorando mês a mês.' },
    { icon: '🧠', title: 'Mente clara', desc: 'Sem a névoa da nicotina, foco e memória voltam ao normal.' },
    { icon: '❤️', title: 'Coração saudável', desc: 'Pressão arterial e risco cardiovascular diminuem significativamente.' },
    { icon: '💰', title: 'Bolso cheio', desc: 'O dinheiro dos pods fica com você — para o que realmente importa.' },
    { icon: '😴', title: 'Sono melhor', desc: 'Sem nicotina, o sono fica mais profundo e reparador.' },
    { icon: '🆓', title: 'Liberdade real', desc: 'Não precisar mais carregar pod, carregador e ansiedade de acabar.' },
    { icon: '👅', title: 'Sabores de volta', desc: 'Comida e bebida voltam a ter gosto de verdade.' },
    { icon: '💪', title: 'Autoestima', desc: 'Cada fissura vencida prova que você é mais forte que a dependência.' },
  ];

  const JOURNEY_POINTS = [
    { hours: 0, label: 'Início' },
    { hours: 24, label: '1 dia' },
    { hours: 72, label: '3 dias' },
    { hours: 168, label: '1 sem' },
    { hours: 720, label: '1 mês' },
    { hours: 2160, label: '3 meses' },
  ];

  const PROJECTION_PERIODS = [
    { days: 30, label: '30 dias' },
    { days: 90, label: '3 meses' },
    { days: 365, label: '1 ano' },
  ];

  const DAILY_MESSAGES = [
    'Bom dia! Mais um dia sem pod. Você consegue.',
    'Lembre do seu porquê. Cada hora livre é uma vitória.',
    'Fissuras são temporárias. Sua saúde é permanente.',
    'Você já provou que é capaz. Continue assim.',
    'Respire fundo. Hoje é mais um dia de liberdade.',
  ];

  const BREATH_LABELS = ['Inspire...', 'Segure...', 'Expire...', 'Segure...'];

  const TAB_TITLES = {
    home: 'Painel',
    cravings: 'Fissuras',
    progress: 'Progresso',
    future: 'Futuro',
  };

  const MOTIVATIONAL_MESSAGES = [
    'Os primeiros dias são os piores. Não é impressão sua — é o corpo reclamando.',
    'A cabeça vai inventar mil desculpas pra comprar um pod. A maioria não faz sentido nenhum.',
    'Aquela vontade depois do café? Normal. Em uns minutos passa.',
    'Três dias sem pod é mais do que parece quando você tá no meio disso.',
    'Seu corpo tá se acostumando sem nicotina. Vai ficar estranho um tempo.',
    'Os primeiros dias mentem. Parece que nunca vai melhorar. Melhora.',
    'Esse horário costuma ser difícil pra você. Mãos ocupadas, água por perto.',
    'Se a fissura bater agora, você já conhece o roteiro. Água, respira, espera.',
    'Hora de pico. Nada de novo — só cuidado redobrado nesse momento.',
    'Dia pesado não apaga o que você já fez. Só não compra o pod hoje.',
    'Hoje tá difícil? Ok. Não precisa ser o melhor dia — só não ser o dia que você usou.',
    'Fissura forte não quer dizer que você vai ceder. Quer dizer que o hábito tá perdendo força.',
    'Ninguém vê você resistindo. Mas você tá resistindo. Isso conta.',
    'Recomeçar depois de tropeçar não é volta à estaca zero. Você já sabe o caminho.',
    'Tá indo bem. Não precisa comemorar em voz alta — só segue.',
    'Aproveita esse momento tranquilo. Guarda ele pra quando apertar de novo.',
    'Você já provou que consegue ficar sem. Um tropeço não apaga isso.',
    'Dias bons existem nessa jornada. Esse parece ser um deles.',
    'O pod não resolve nada. Só adia a ansiedade e cobra juros depois.',
    'Você não precisa de "só mais um". Nunca precisou.',
    'Tem gente gastando fortuna nisso sem nem calcular. Você calculou — e parou.',
    'Acordar sem pensar em pod já vale o esforço de ontem.',
    'É estranho não ter o pod no bolso. Isso some com o tempo.',
    'A fissura dura uns minutos. O arrependimento de usar dura mais.',
    'Usar virou automático. Parar também vira — só demora mais.',
    'Café sem pod no começo é esquisito. Mas funciona.',
    'Um dia você vai esquecer de checar quanto tempo faz. Esse dia chega.',
    'Largar pod é chato. Usar e se arrepender depois também é.',
    'Não é falta de força. É química — e química muda com o tempo.',
    'O hit some em segundos. A vontade de outro pod fica.',
    'Você não tá largando prazer. Tá largando uma armadilha que fingia ser alívio.',
    'Mão no bolso procurando o que não tá mais lá? Normal. Isso passa.',
    'O pod prometia relaxar. Na prática só criava mais ansiedade.',
    'Se bater vontade agora, não discute com ela. Espera cinco minutos e vê se ainda quer.',
  ];

  const CRAVING_STEPS = [
    {
      icon: '💧',
      title: 'Hidrate',
      desc: 'Beba um copo de água gelada agora. A sensação no céu da boca ajuda a substituir o impulso do pod.',
      seconds: 60,
      breathe: false,
    },
    {
      icon: '🫁',
      title: 'Respire',
      desc: '4 segundos inspirando, 7 segurando, 8 expirando. Siga o círculo — solte o ar, solte a fissura.',
      seconds: 90,
      breathe: true,
    },
    {
      icon: '🚶',
      title: 'Mova-se',
      desc: 'Caminhe ou estique por 1 minuto. O movimento libera dopamina natural — sem nicotina.',
      seconds: 60,
      breathe: false,
    },
  ];

  const TRIGGERS = [
    { id: 'stress', label: 'Estresse', icon: '😤' },
    { id: 'coffee', label: 'Café', icon: '☕' },
    { id: 'boredom', label: 'Tédio', icon: '😐' },
    { id: 'anxiety', label: 'Ansiedade', icon: '😰' },
    { id: 'meal', label: 'Após comer', icon: '🍽️' },
    { id: 'social', label: 'Social', icon: '👥' },
    { id: 'habit', label: 'Automático', icon: '🔄' },
    { id: 'other', label: 'Outro', icon: '✦' },
  ];

  const SUBSTITUTES = [
    { id: 'water', label: 'Água', icon: '💧' },
    { id: 'breathe', label: 'Respiração', icon: '🫁' },
    { id: 'walk', label: 'Caminhada', icon: '🚶' },
    { id: 'talk', label: 'Conversei', icon: '💬' },
    { id: 'distraction', label: 'Distraí', icon: '🎯' },
    { id: 'other', label: 'Outro', icon: '✦' },
  ];

  const RELAPSE_MESSAGES = [
    'Recaída não é fracasso — é informação. Você aprende e recomeça mais forte.',
    'Um pod não apaga os dias que você ficou livre. Eles continuam contando.',
    'A dependência é forte. Recomeçar com compaixão é um ato de coragem.',
    'Você já provou que consegue ficar sem. Isso não desaparece com um tropeço.',
    'Soltar de novo é possível. Você já sabe o caminho.',
  ];

  const MOOD_ICONS = { great: '😊', ok: '😐', hard: '😔', strong: '💪' };

  const ACHIEVEMENTS = [
    { id: 'first_craving', icon: '🔥', title: 'Primeira soltada', desc: 'Soltou a primeira fissura', test: (d) => d.cravingsResisted >= 1 },
    { id: 'cravings_10', icon: '💨', title: '10 fissuras', desc: 'Soltou 10 fissuras', test: (d) => d.cravingsResisted >= 10 },
    { id: 'cravings_50', icon: '⚡', title: '50 fissuras', desc: 'Soltou 50 fissuras', test: (d) => d.cravingsResisted >= 50 },
    { id: 'day_1', icon: '🌅', title: '1 dia', desc: '24 horas sem pod', test: (_, h) => h >= 24 },
    { id: 'day_3', icon: '🌿', title: '3 dias', desc: '72 horas livre', test: (_, h) => h >= 72 },
    { id: 'week_1', icon: '🌟', title: '1 semana', desc: '7 dias sem pod', test: (_, h) => h >= 168 },
    { id: 'month_1', icon: '🏆', title: '1 mês', desc: '30 dias de jornada', test: (_, h) => h >= 720 },
    { id: 'money_100', icon: '💰', title: 'R$ 100+', desc: 'Economizou cem reais', test: (d, h) => (h / 24 / d.daysPerPod) * d.podCost >= 100 },
    { id: 'money_500', icon: '🏦', title: 'R$ 500+', desc: 'Meio mil reais no bolso', test: (d, h) => (h / 24 / d.daysPerPod) * d.podCost >= 500 },
    { id: 'mood_week', icon: '📊', title: 'Check-in', desc: '7 dias registrando humor', test: (d) => Object.keys(d.moods || {}).length >= 7 },
    { id: 'comeback', icon: '🤍', title: 'Recomeço', desc: 'Voltou com compaixão', test: (d) => (d.lifetime?.relapses || 0) >= 1 },
  ];

  let data = null;
  let timerInterval = null;
  let alertInterval = null;
  let cravingInterval = null;
  let breathInterval = null;
  let currentStep = 0;
  let stepSeconds = 0;
  let stepTotalSeconds = 60;
  let selectedTrigger = null;
  let selectedSubstitute = null;
  let selectedTimelineFilter = 'all';
  let selectedTimelineId = null;
  let motivationText = null;
  let activeTab = 'home';
  let toastTimeout = null;
  let scrollPosition = 0;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const setupScreen = $('#setup');
  const appScreen = $('#app');
  const setupForm = $('#setup-form');
  const settingsForm = $('#settings-form');
  const cravingModal = $('#craving-modal');
  const settingsModal = $('#settings-modal');
  const triggerModal = $('#trigger-modal');
  const relapseModal = $('#relapse-modal');

  // ── Utils ──
  function toDatetimeLocal(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function parseQuitAt(value) {
    if (!value) return new Date();
    if (value.length === 10) return new Date(value + 'T00:00:00');
    return new Date(value);
  }

  function formatQuitAtForInput(value) {
    return toDatetimeLocal(parseQuitAt(value));
  }

  function dateKey(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function defaultAlerts() {
    return {
      enabled: false,
      daily: true,
      time: '09:00',
      milestones: true,
      peakHour: true,
      celebrationSound: true,
      lastDaily: null,
      lastPeakAlert: null,
    };
  }

  function normalizeData(saved) {
    if (saved.quitDate && !saved.quitAt) {
      saved.quitAt = saved.quitDate.includes('T') ? saved.quitDate : saved.quitDate + 'T00:00:00';
      delete saved.quitDate;
    }
    if (saved.podsPerDay && !saved.daysPerPod) {
      saved.daysPerPod = 1 / saved.podsPerDay;
      delete saved.podsPerDay;
    }
    if (!saved.alerts) saved.alerts = defaultAlerts();
    else {
      if (saved.alerts.peakHour === undefined) saved.alerts.peakHour = true;
      if (saved.alerts.celebrationSound === undefined) saved.alerts.celebrationSound = true;
      if (saved.alerts.lastPeakAlert === undefined) saved.alerts.lastPeakAlert = null;
    }
    if (!saved.moods) saved.moods = {};
    if (!saved.notifiedMilestones) saved.notifiedMilestones = [];
    if (!saved.unlockedAchievements) saved.unlockedAchievements = [];
    if (!saved.cravingLog) saved.cravingLog = [];
    if (!saved.goodbyeLetter) saved.goodbyeLetter = '';
    if (!saved.relapses) saved.relapses = [];
    if (!saved.lifetime) saved.lifetime = { totalDaysFree: 0, relapses: 0 };
    return saved;
  }

  function defaultLifetime() {
    return { totalDaysFree: 0, relapses: 0 };
  }

  function getCurrentAttemptDays() {
    return Math.max(0, getElapsed() / (1000 * 60 * 60 * 24));
  }

  function getTotalDaysFree() {
    const current = getCurrentAttemptDays();
    const past = data.lifetime?.totalDaysFree || 0;
    return past + current;
  }

  // ── Storage ──
  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? normalizeData(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getPodsAvoided(elapsedDays) {
    return elapsedDays / data.daysPerPod;
  }

  function getElapsed() {
    return Math.max(0, Date.now() - parseQuitAt(data.quitAt).getTime());
  }

  function getElapsedHours() {
    return getElapsed() / (1000 * 60 * 60);
  }

  function getCravingsOnDate(key) {
    return data.cravingLog.filter((e) => dateKey(new Date(e.time)) === key).length;
  }

  function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      days.push({ key, date: d, count: getCravingsOnDate(key) });
    }
    return days;
  }

  function getProjection(extraDays) {
    const currentDays = getElapsedHours() / 24;
    const totalDays = currentDays + extraDays;
    const pods = getPodsAvoided(totalDays);
    return {
      money: pods * data.podCost,
      pods,
      nicotine: pods * data.nicotineMg,
      extraMoney: getPodsAvoided(extraDays) * data.podCost,
      extraPods: getPodsAvoided(extraDays),
    };
  }

  // ── Theme ──
  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const meta = $('#meta-theme');
    if (meta) meta.content = theme === 'light' ? '#f2f5f0' : '#0f1419';
  }

  function updateLiberationVisual() {
    if (!data) return;
    const liberation = Math.min(1, getElapsedHours() / GOAL_HOURS);
    document.documentElement.style.setProperty('--liberation', liberation.toFixed(3));
  }

  function updateHeader(tab) {
    const subtitle = $('#header-subtitle');
    if (subtitle) {
      subtitle.style.opacity = '0';
      requestAnimationFrame(() => {
        subtitle.textContent = TAB_TITLES[tab] || 'Início';
        subtitle.style.opacity = '1';
      });
    }
    renderHeaderStat();
  }

  function renderHeaderStat() {
    const el = $('#header-stat-value');
    if (!el || !data) return;
    const days = Math.floor(getElapsed() / (1000 * 60 * 60 * 24));
    el.textContent = days;
    const stat = $('#header-stat');
    if (stat) stat.setAttribute('aria-label', `${days} dias livre de pods`);
  }

  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    haptic(10);
  }

  // ── Feedback ──
  function haptic(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function spawnRipple(e, el) {
    if (prefersReducedMotion() || !el) return;
    if (!el.classList.contains('ripple-host')) el.classList.add('ripple-host');
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  function bumpStat(el, text) {
    if (!el) return;
    if (el.textContent !== text) {
      el.textContent = text;
      el.classList.remove('stat-bump');
      void el.offsetWidth;
      el.classList.add('stat-bump');
    }
  }

  const TAB_ORDER = ['home', 'cravings', 'progress', 'future'];

  function updateNavIndicator(tab) {
    const ind = $('#nav-indicator');
    if (!ind) return;
    const idx = Math.max(0, TAB_ORDER.indexOf(tab));
    ind.style.setProperty('--nav-index', idx);
  }

  function updateTimelineFilterTrack() {
    const track = $('#timeline-filter-track');
    const active = $('.timeline-filter.active');
    const container = $('.timeline-filters');
    if (!track || !active || !container) return;
    const cRect = container.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    track.style.width = `${aRect.width}px`;
    track.style.transform = `translateX(${aRect.left - cRect.left}px)`;
  }

  function playTabEnter(panel) {
    if (!panel || prefersReducedMotion()) return;
    panel.classList.add('tab-entering');
    setTimeout(() => panel.classList.remove('tab-entering'), 600);
  }

  function bindRipples() {
    const selector = '.btn, .nav-item, .timeline-filter, .mood-btn, .fab-craving, .btn-motivation, .header-btn, .stat-card-dash, .header-brand';
    document.addEventListener('pointerdown', (e) => {
      const el = e.target.closest(selector);
      if (el) spawnRipple(e, el);
    });
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2800);
  }

  function showBanner(message) {
    const banner = $('#alert-banner');
    $('#alert-banner-text').textContent = message;
    banner.classList.remove('hidden');
  }

  function lockScroll() {
    scrollPosition = window.scrollY;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollPosition}px`;
  }

  function unlockScroll() {
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);
  }

  // ── Notifications ──
  async function requestNotificationPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      return result === 'granted';
    }
    return false;
  }

  function sendNotification(title, body) {
    if (!data?.alerts?.enabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      new Notification(title, { body, tag: 'nopods' });
    } catch { /* silencioso */ }
  }

  function checkMilestoneAlerts() {
    if (!data?.alerts?.milestones) return;
    const hours = getElapsedHours();
    MILESTONES.forEach((m) => {
      if (hours >= m.hours && !data.notifiedMilestones.includes(m.hours)) {
        data.notifiedMilestones.push(m.hours);
        saveData();
        celebrateUnlock({
          icon: m.icon,
          label: 'Marco de saúde',
          title: m.title,
          desc: m.desc,
        });
        sendNotification('NoPods — Marco conquistado!', `${m.icon} ${m.title}: ${m.desc}`);
      }
    });
  }

  function checkPeakHourAlert() {
    if (!data?.alerts?.enabled || data.alerts.peakHour === false) return;
    const peak = getPeakHourInfo();
    if (!peak.hasData) return;
    const now = new Date();
    if (now.getHours() !== peak.peakHour) return;
    const today = dateKey(now);
    if (data.alerts.lastPeakAlert === today) return;
    data.alerts.lastPeakAlert = today;
    saveData();
    const h = String(peak.peakHour).padStart(2, '0');
    const msg = `Costuma ser difícil às ${h}h. Mãos ocupadas, água por perto.`;
    showBanner('⏰ ' + msg);
    sendNotification('NoPods — Horário de pico', msg);
  }

  function checkDailyReminder() {
    if (!data?.alerts?.enabled || !data.alerts.daily) return;
    const now = new Date();
    const today = dateKey(now);
    if (data.alerts.lastDaily === today) return;
    const [h, m] = (data.alerts.time || '09:00').split(':').map(Number);
    if (now.getHours() === h && now.getMinutes() === m) {
      data.alerts.lastDaily = today;
      saveData();
      const msg = DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)];
      showBanner('☀️ ' + msg);
      sendNotification('NoPods — Bom dia!', msg);
    }
  }

  function startAlertChecker() {
    if (alertInterval) clearInterval(alertInterval);
    checkMilestoneAlerts();
    checkDailyReminder();
    checkPeakHourAlert();
    alertInterval = setInterval(() => {
      checkMilestoneAlerts();
      checkDailyReminder();
      checkPeakHourAlert();
      checkAchievements();
    }, 30000);
  }

  // ── Init ──
  function init() {
    applyTheme(getTheme());
    data = loadData();
    if (data) {
      showApp();
    } else {
      showSetup();
    }
    bindEvents();
    bindRipples();
    initHeaderScroll();
    initTriggerChips();
    window.addEventListener('resize', () => {
      updateTimelineFilterTrack();
      updateNavIndicator(activeTab);
    }, { passive: true });
  }

  function showSetup() {
    setupScreen.classList.remove('hidden');
    appScreen.classList.add('hidden');
    const now = new Date();
    const input = $('#quit-datetime');
    input.value = toDatetimeLocal(now);
    input.max = toDatetimeLocal(now);
  }

  function showApp() {
    setupScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    activeTab = 'home';
    $$('.tab-panel').forEach((panel) => {
      const isActive = panel.id === 'tab-home';
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });
    updateNavIndicator('home');
    renderAll();
    playTabEnter($('#tab-home'));
    startTimer();
    startAlertChecker();
  }

  function switchTab(tab) {
    if (tab === activeTab) return;

    const prevTab = activeTab;
    const currentPanel = $(`#tab-${prevTab}`);
    const nextPanel = $(`#tab-${tab}`);

    const applySwitch = () => {
      activeTab = tab;
      $$('.tab-panel').forEach((panel) => {
        const isActive = panel.id === `tab-${tab}`;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
      $$('.nav-item').forEach((btn) => {
        const isActive = btn.dataset.tab === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-current', isActive ? 'page' : null);
      });
      updateNavIndicator(tab);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      updateHeader(tab);
      haptic(8);
      playTabEnter(nextPanel);
      if (tab === 'future') renderFuture();
      if (tab === 'progress') {
        renderLifetime();
        renderAchievements();
      }
      if (tab === 'home') renderDashboard();
      if (tab === 'cravings') {
        renderDailyCravings();
        renderTriggerMap();
      }
    };

    if (!prefersReducedMotion() && currentPanel && nextPanel) {
      currentPanel.classList.add('tab-leaving');
      setTimeout(() => {
        currentPanel.classList.remove('tab-leaving');
        applySwitch();
      }, 200);
    } else {
      applySwitch();
    }
  }

  // ── Events ──
  function bindEvents() {
    $('#btn-theme').addEventListener('click', toggleTheme);
    $('#btn-theme-setup').addEventListener('click', toggleTheme);
    $('#header-brand-btn').addEventListener('click', () => switchTab('home'));
    $('#alert-banner-close').addEventListener('click', () => $('#alert-banner').classList.add('hidden'));

    setupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      data = normalizeData({
        quitAt: $('#quit-datetime').value,
        daysPerPod: parseFloat($('#days-per-pod').value),
        podCost: parseFloat($('#pod-cost').value),
        nicotineMg: parseFloat($('#nicotine-mg').value),
        podMl: parseFloat($('#pod-ml').value),
        reason: $('#reason').value.trim(),
        goodbyeLetter: $('#goodbye-letter').value.trim(),
        cravingsResisted: 0,
        cravingLog: [],
        relapses: [],
        lifetime: defaultLifetime(),
        alerts: defaultAlerts(),
        moods: {},
        notifiedMilestones: [],
        unlockedAchievements: [],
      });
      saveData();
      haptic([20, 50, 20]);
      showApp();
      showToast('Jornada iniciada. Você está soltando o velho hábito 🌿');
    });

    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      data.quitAt = $('#edit-quit-datetime').value;
      data.daysPerPod = parseFloat($('#edit-days-per-pod').value);
      data.podCost = parseFloat($('#edit-pod-cost').value);
      data.nicotineMg = parseFloat($('#edit-nicotine-mg').value);
      data.podMl = parseFloat($('#edit-pod-ml').value);
      data.reason = $('#edit-reason').value.trim();
      data.goodbyeLetter = $('#edit-goodbye-letter').value.trim();
      saveAlertsFromForm();
      saveData();
      closeModal(settingsModal);
      renderAll();
      showToast('Configurações salvas');
    });

    $$('.nav-item').forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

    $$('.mood-btn').forEach((btn) => {
      btn.addEventListener('click', () => setMood(btn.dataset.mood));
    });

    $('#btn-new-motivation')?.addEventListener('click', () => {
      renderMotivation(true);
      haptic(8);
    });

    $$('.timeline-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedTimelineFilter = btn.dataset.filter;
        selectedTimelineId = null;
        $$('.timeline-filter').forEach((b) => {
          const on = b.dataset.filter === selectedTimelineFilter;
          b.classList.toggle('active', on);
          b.setAttribute('aria-selected', on);
        });
        renderInteractiveTimeline();
        updateTimelineFilterTrack();
        haptic(8);
      });
    });

    $('#btn-settings').addEventListener('click', openSettings);
    $('#btn-craving').addEventListener('click', openCravingModal);
    $('#btn-craving-desktop').addEventListener('click', openCravingModal);
    $('#btn-resisted').addEventListener('click', resistCraving);
    $('#btn-step-next').addEventListener('click', advanceCravingStep);
    $('#btn-save-trigger').addEventListener('click', saveTrigger);
    $('#btn-skip-trigger').addEventListener('click', closeTriggerModal);
    $('#btn-reset').addEventListener('click', resetApp);
    $('#btn-relapse').addEventListener('click', openRelapseModal);
    $('#btn-relapse-settings').addEventListener('click', () => { closeModal(settingsModal); openRelapseModal(); });
    $('#btn-relapse-confirm').addEventListener('click', confirmRelapse);
    $('#btn-relapse-cancel').addEventListener('click', closeRelapseModal);
    $('#relapse-close').addEventListener('click', closeRelapseModal);
    $$('[data-close-relapse]').forEach((el) => el.addEventListener('click', closeRelapseModal));
    $('#btn-test-notification').addEventListener('click', testNotification);
    $('#btn-export-data')?.addEventListener('click', exportData);
    $('#btn-import-data')?.addEventListener('click', () => $('#import-file-input')?.click());
    $('#import-file-input')?.addEventListener('change', handleImportFile);
    $('#celebration-close')?.addEventListener('click', closeCelebration);

    $('#alert-enabled').addEventListener('change', async (e) => {
      if (e.target.checked) {
        const ok = await requestNotificationPermission();
        if (!ok) {
          e.target.checked = false;
          showToast('Permissão de notificação negada');
        }
      }
    });

    $('#modal-close').addEventListener('click', () => closeModal(cravingModal));
    $('#settings-close').addEventListener('click', () => closeModal(settingsModal));
    $$('[data-close]').forEach((el) => {
      el.addEventListener('click', () => closeModal(el.closest('.modal')));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!cravingModal.classList.contains('hidden')) closeModal(cravingModal);
        if (!settingsModal.classList.contains('hidden')) closeModal(settingsModal);
        if (!triggerModal.classList.contains('hidden')) closeTriggerModal();
        if (!relapseModal.classList.contains('hidden')) closeRelapseModal();
        if (!$('#celebration-overlay')?.classList.contains('hidden')) closeCelebration();
      }
    });
  }

  function saveAlertsFromForm() {
    data.alerts = {
      enabled: $('#alert-enabled').checked,
      daily: $('#alert-daily').checked,
      time: $('#alert-time').value,
      milestones: $('#alert-milestones').checked,
      peakHour: $('#alert-peak-hour')?.checked ?? true,
      celebrationSound: $('#alert-celebration-sound')?.checked ?? true,
      lastDaily: data.alerts?.lastDaily || null,
      lastPeakAlert: data.alerts?.lastPeakAlert || null,
    };
  }

  async function testNotification() {
    saveAlertsFromForm();
    if (!data.alerts.enabled) {
      showToast('Ative as notificações primeiro');
      return;
    }
    const ok = await requestNotificationPermission();
    if (ok) {
      sendNotification('NoPods 🎉', 'Notificações funcionando! Você vai receber lembretes e marcos.');
      showToast('Notificação enviada!');
    } else {
      showToast('Permissão negada pelo navegador');
    }
  }

  function setMood(mood) {
    data.moods[dateKey(new Date())] = mood;
    saveData();
    $$('.mood-btn').forEach((btn) => btn.classList.toggle('selected', btn.dataset.mood === mood));
    const msgEl = $('#checkin-message');
    if (msgEl && !prefersReducedMotion()) {
      msgEl.classList.add('is-changing');
      setTimeout(() => {
        msgEl.textContent = MOOD_MESSAGES[mood];
        msgEl.classList.remove('is-changing');
      }, 180);
    } else if (msgEl) {
      msgEl.textContent = MOOD_MESSAGES[mood];
    }
    motivationText = null;
    renderMotivation();
    renderDashboardPills();
    renderMoodCravingChart();
    haptic(10);
  }

  function resetApp() {
    if (confirm('Tem certeza? Todos os dados serão apagados.')) {
      localStorage.removeItem(STORAGE_KEY);
      data = null;
      if (timerInterval) clearInterval(timerInterval);
      if (alertInterval) clearInterval(alertInterval);
      showSetup();
    }
  }

  function openSettings() {
    $('#edit-quit-datetime').value = formatQuitAtForInput(data.quitAt);
    $('#edit-quit-datetime').max = toDatetimeLocal(new Date());
    $('#edit-days-per-pod').value = data.daysPerPod;
    $('#edit-pod-cost').value = data.podCost;
    $('#edit-nicotine-mg').value = data.nicotineMg;
    $('#edit-pod-ml').value = data.podMl;
    $('#edit-reason').value = data.reason || '';
    $('#edit-goodbye-letter').value = data.goodbyeLetter || '';
    $('#alert-enabled').checked = data.alerts.enabled;
    $('#alert-daily').checked = data.alerts.daily;
    $('#alert-time').value = data.alerts.time || '09:00';
    $('#alert-milestones').checked = data.alerts.milestones;
    $('#alert-peak-hour').checked = data.alerts.peakHour !== false;
    $('#alert-celebration-sound').checked = data.alerts.celebrationSound !== false;
    openModal(settingsModal);
  }

  function openModal(modal) {
    modal.classList.remove('hidden');
    lockScroll();
  }

  function openCravingModal() {
    haptic(30);
    currentStep = 0;
    selectedTrigger = null;
    selectedSubstitute = null;
    $('#btn-step-next').classList.remove('hidden');
    $('#btn-resisted').classList.add('hidden');
    renderCravingStep();
    openModal(cravingModal);
  }

  function renderCravingStep() {
    const step = CRAVING_STEPS[currentStep];
    stepTotalSeconds = step.seconds;
    stepSeconds = step.seconds;

    $('#step-icon').textContent = step.icon;
    $('#step-title').textContent = step.title;
    $('#step-desc').textContent = step.desc;

    const breatheEl = $('#step-breathe');
    if (step.breathe) {
      breatheEl.classList.remove('hidden');
      startStepBreathing();
    } else {
      breatheEl.classList.add('hidden');
      stopStepBreathing();
    }

    $$('.step-dot').forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < currentStep) dot.classList.add('done');
      if (i === currentStep) dot.classList.add('active');
    });
    $$('.step-line').forEach((line, i) => {
      line.classList.toggle('done', i < currentStep);
    });

    const panel = $('#craving-step-panel');
    panel.style.animation = 'none';
    requestAnimationFrame(() => { panel.style.animation = ''; });

    updateStepTimer();
    if (cravingInterval) clearInterval(cravingInterval);
    cravingInterval = setInterval(() => {
      stepSeconds = Math.max(0, stepSeconds - 1);
      updateStepTimer();
      if (stepSeconds <= 0) clearInterval(cravingInterval);
    }, 1000);

    const isLast = currentStep === CRAVING_STEPS.length - 1;
    $('#btn-step-next').classList.toggle('hidden', isLast);
    $('#btn-resisted').classList.toggle('hidden', !isLast);
  }

  function updateStepTimer() {
    $('#modal-countdown').textContent = stepSeconds;
    $('#timer-progress').style.strokeDashoffset = 283 * (1 - stepSeconds / stepTotalSeconds);
  }

  function startStepBreathing() {
    let step = 0;
    const label = $('#step-breath-label');
    label.textContent = BREATH_LABELS[0];
    if (breathInterval) clearInterval(breathInterval);
    breathInterval = setInterval(() => {
      step = (step + 1) % BREATH_LABELS.length;
      label.textContent = BREATH_LABELS[step];
    }, 2000);
  }

  function stopStepBreathing() {
    if (breathInterval) clearInterval(breathInterval);
  }

  function advanceCravingStep() {
    haptic(10);
    if (currentStep < CRAVING_STEPS.length - 1) {
      currentStep++;
      renderCravingStep();
    }
  }

  function initTriggerChips() {
    $('#trigger-chips').innerHTML = TRIGGERS.map((t) =>
      `<button type="button" class="chip" data-type="trigger" data-id="${t.id}"><span class="chip-icon">${t.icon}</span>${t.label}</button>`
    ).join('');
    $('#substitute-chips').innerHTML = SUBSTITUTES.map((s) =>
      `<button type="button" class="chip" data-type="substitute" data-id="${s.id}"><span class="chip-icon">${s.icon}</span>${s.label}</button>`
    ).join('');

    $$('#trigger-chips .chip, #substitute-chips .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const type = chip.dataset.type;
        const id = chip.dataset.id;
        const container = type === 'trigger' ? '#trigger-chips' : '#substitute-chips';
        $$(`${container} .chip`).forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
        if (type === 'trigger') selectedTrigger = id;
        else selectedSubstitute = id;
        haptic(8);
      });
    });
  }

  function openTriggerModal() {
    selectedTrigger = null;
    selectedSubstitute = null;
    $$('.chip').forEach((c) => c.classList.remove('selected'));
    openModal(triggerModal);
  }

  function saveTrigger() {
    if (data.cravingLog.length > 0) {
      const latest = data.cravingLog[0];
      if (selectedTrigger) latest.trigger = selectedTrigger;
      if (selectedSubstitute) latest.substitute = selectedSubstitute;
      saveData();
    }
    closeTriggerModal();
    renderTriggerMap();
    renderCravingLog();
    renderPeakHours();
    renderInteractiveTimeline();
  }

  function closeTriggerModal() {
    triggerModal.classList.add('hidden');
    unlockScroll();
  }

  function openRelapseModal() {
    const daysThisAttempt = getCurrentAttemptDays();
    const daysRounded = Math.floor(daysThisAttempt);
    const hours = Math.floor(getElapsedHours());

    $('#relapse-message').textContent =
      RELAPSE_MESSAGES[Math.floor(Math.random() * RELAPSE_MESSAGES.length)];

    let statsText;
    if (daysRounded >= 1) {
      statsText = `Nesta tentativa você ficou ${daysRounded} dia${daysRounded > 1 ? 's' : ''} livre. Isso conta.`;
    } else if (hours >= 1) {
      statsText = `Nesta tentativa você ficou ${hours} hora${hours > 1 ? 's' : ''} livre. Isso conta.`;
    } else {
      statsText = 'Cada tentativa ensina algo. Recomeçar é permitido.';
    }
    $('#relapse-stats').textContent = statsText;

    const now = new Date();
    const input = $('#relapse-datetime');
    input.value = toDatetimeLocal(now);
    input.min = formatQuitAtForInput(data.quitAt);
    input.max = toDatetimeLocal(now);
    $('#relapse-note').value = '';
    openModal(relapseModal);
  }

  function closeRelapseModal() {
    relapseModal.classList.add('hidden');
    unlockScroll();
  }

  function confirmRelapse() {
    const when = $('#relapse-datetime').value;
    if (!when) return;

    const relapseAt = parseQuitAt(when);
    const quitAt = parseQuitAt(data.quitAt);

    if (relapseAt < quitAt) {
      showToast('A data deve ser depois de quando você parou');
      return;
    }

    const daysFree = Math.max(0, (relapseAt.getTime() - quitAt.getTime()) / (1000 * 60 * 60 * 24));
    const note = $('#relapse-note').value.trim();

    if (!data.lifetime) data.lifetime = defaultLifetime();
    data.lifetime.totalDaysFree += daysFree;
    data.lifetime.relapses += 1;

    if (!data.relapses) data.relapses = [];
    data.relapses.unshift({
      at: relapseAt.toISOString(),
      note,
      daysFreeBefore: Math.round(daysFree * 10) / 10,
    });
    if (data.relapses.length > 20) data.relapses.pop();

    data.quitAt = when;
    data.notifiedMilestones = [];

    saveData();
    closeRelapseModal();
    renderAll();
    haptic([20, 40, 20]);
    showToast('Você recomeçou com compaixão. Siga em frente 🌿');
    showBanner('🤍 Recomeço registrado. Sua jornada anterior não foi apagada — ela te fortalece.');
  }

  function spawnParticles() {
    const layer = $('#particles');
    if (!layer) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.6;
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'particle' + (i % 3 === 0 ? ' amber' : '');
      p.style.left = (cx + (Math.random() - 0.5) * 120) + 'px';
      p.style.top = cy + 'px';
      p.style.animationDelay = (Math.random() * 0.4) + 's';
      layer.appendChild(p);
      setTimeout(() => p.remove(), 2200);
    }
  }

  function spawnConfetti() {
    if (prefersReducedMotion()) return;
    const layer = $('#particles');
    if (!layer) return;
    const colors = ['#7ec8b8', '#e8b86d', '#b8a0d8', '#e07a6a', '#7ec8a0'];
    for (let i = 0; i < 36; i++) {
      const p = document.createElement('div');
      p.className = 'particle confetti';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = '-12px';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      p.style.animationDuration = (1.8 + Math.random() * 1.2) + 's';
      layer.appendChild(p);
      setTimeout(() => p.remove(), 3200);
    }
  }

  function playCelebrationSound() {
    if (!data?.alerts?.celebrationSound || prefersReducedMotion()) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch { /* silencioso */ }
  }

  function celebrateUnlock({ icon, label, title, desc }) {
    spawnConfetti();
    playCelebrationSound();
    haptic([20, 40, 30]);
    showBanner(`🎉 ${title}`);
    showToast(`${icon} ${title}!`);

    const overlay = $('#celebration-overlay');
    if (!overlay) return;
    $('#celebration-icon').textContent = icon;
    $('#celebration-label').textContent = label;
    $('#celebration-title').textContent = title;
    $('#celebration-desc').textContent = desc;
    overlay.classList.remove('hidden');
    lockScroll();
  }

  function closeCelebration() {
    const overlay = $('#celebration-overlay');
    if (overlay) overlay.classList.add('hidden');
    unlockScroll();
  }

  function exportData() {
    if (!data) return;
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: 'NoPods',
      data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nopods-backup-${dateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado 📁');
    haptic(10);
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const imported = parsed.data || parsed;
        if (!imported.quitAt) throw new Error('invalid');
        if (!confirm('Importar este backup? Seus dados atuais serão substituídos.')) return;
        data = normalizeData(imported);
        saveData();
        renderAll();
        showToast('Backup restaurado com sucesso 🌿');
        haptic([15, 30, 15]);
      } catch {
        showToast('Arquivo inválido. Use um backup do NoPods.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
    unlockScroll();
    if (modal === cravingModal) {
      if (cravingInterval) clearInterval(cravingInterval);
      stopStepBreathing();
    }
    if (modal === settingsModal) saveAlertsFromForm();
  }

  function resistCraving() {
    data.cravingsResisted++;
    data.cravingLog.unshift({ time: new Date().toISOString(), resisted: true });
    if (data.cravingLog.length > 100) data.cravingLog.pop();
    saveData();
    closeModal(cravingModal);
    spawnParticles();
    renderStats();
    renderCravingLog();
    renderDailyCravings();
    renderNextMilestone();
    renderDashboard();
    checkAchievements();
    haptic([30, 50, 30]);
    const today = getCravingsOnDate(dateKey(new Date()));
    showToast(`Você soltou essa fissura! Hoje: ${today} 🌿`);
    setTimeout(() => openTriggerModal(), 400);
  }

  // ── Timer ──
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    const totalSec = Math.floor(getElapsed() / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = String(Math.floor((totalSec % 86400) / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSec % 60).padStart(2, '0');

    const daysEl = $('#days');
    const hoursEl = $('#hours');
    const minutesEl = $('#minutes');
    const secondsEl = $('#seconds');

    if (daysEl && daysEl.textContent !== String(days)) daysEl.textContent = days;
    if (hoursEl && hoursEl.textContent !== hours) hoursEl.textContent = hours;
    if (minutesEl && minutesEl.textContent !== minutes) minutesEl.textContent = minutes;
    if (secondsEl && secondsEl.textContent !== seconds) {
      secondsEl.textContent = seconds;
      if (!prefersReducedMotion()) {
        secondsEl.classList.remove('tick');
        void secondsEl.offsetWidth;
        secondsEl.classList.add('tick');
      }
    }

    renderHeaderStat();

    const pct = Math.min(100, Math.round((getElapsedHours() / GOAL_HOURS) * 100));
    const pctEl = $('#progress-percent');
    if (pctEl) pctEl.textContent = pct + '%';
    const ring = $('#main-progress-ring');
    if (ring) ring.style.strokeDashoffset = RING_CIRC * (1 - pct / 100);
    updateLiberationVisual();
  }

  function renderTriggerMap() {
    const container = $('#trigger-map');
    if (!container || !data) return;

    const counts = {};
    data.cravingLog.forEach((e) => {
      if (e.trigger) counts[e.trigger] = (counts[e.trigger] || 0) + 1;
    });

    const entries = TRIGGERS
      .map((t) => ({ ...t, count: counts[t.id] || 0 }))
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count);

    if (!entries.length) {
      container.innerHTML = '<p class="empty-state">Registre gatilhos após soltar uma fissura para ver seus padrões aqui.</p>';
      return;
    }

    const max = entries[0].count;
    container.innerHTML = entries.map((t) => `
      <div class="trigger-bar-row">
        <span class="trigger-bar-label"><span>${t.icon}</span>${t.label}</span>
        <div class="trigger-bar-track"><div class="trigger-bar-fill" data-w="${(t.count / max) * 100}" style="width:0"></div></div>
        <span class="trigger-bar-count">${t.count}</span>
      </div>
    `).join('');

    if (!prefersReducedMotion()) {
      requestAnimationFrame(() => {
        container.querySelectorAll('.trigger-bar-fill').forEach((fill) => {
          fill.style.width = fill.dataset.w + '%';
        });
      });
    } else {
      container.querySelectorAll('.trigger-bar-fill').forEach((fill) => {
        fill.style.width = fill.dataset.w + '%';
      });
    }
  }

  function getPeakHourInfo() {
    const hours = Array(24).fill(0);
    (data.cravingLog || []).forEach((e) => {
      hours[new Date(e.time).getHours()]++;
    });
    const max = Math.max(...hours, 0);
    if (max === 0) return { hasData: false, peakHour: null, hours, max: 0 };
    const peakHour = hours.indexOf(max);
    return { hasData: true, peakHour, hours, max };
  }

  function truncateText(text, max) {
    if (!text || text.length <= max) return text;
    return text.slice(0, max - 3) + '...';
  }

  function buildPersonalizedMessages() {
    if (!data) return [];
    const msgs = [];
    const days = Math.floor(getCurrentAttemptDays());
    const hours = getElapsedHours();
    const money = getPodsAvoided(hours / 24) * data.podCost;
    const cravings = data.cravingsResisted;
    const peak = getPeakHourInfo();

    if (data.reason) {
      const short = truncateText(data.reason, 90);
      msgs.push(days > 0
        ? `Você parou porque: "${short}" — ${days} dia${days > 1 ? 's' : ''} depois, isso ainda vale.`
        : `Você parou porque: "${short}". Hoje é o primeiro passo.`);
    }

    if (days >= 1) {
      msgs.push(`${days} dia${days > 1 ? 's' : ''} sem pod. ${days < 3 ? 'O pior já tá passando.' : 'Isso é real.'}`);
    }

    if (cravings > 0) {
      msgs.push(`Você já soltou ${cravings} fissura${cravings > 1 ? 's' : ''} — cada uma reforça o novo hábito.`);
    }

    if (money >= data.podCost) {
      msgs.push(`Já são ${formatMoney(money)} que ficaram com você em vez do pod.`);
    }

    if (peak.hasData) {
      const h = String(peak.peakHour).padStart(2, '0');
      if (peak.peakHour === new Date().getHours()) {
        msgs.push(`São ${h}h — seu horário de pico. Água por perto, sem pressa.`);
      } else {
        msgs.push(`Suas fissuras costumam bater perto das ${h}h. Você já sabe quando se preparar.`);
      }
    }

    const todayMood = data.moods[dateKey(new Date())];
    if (todayMood === 'hard') {
      msgs.push('Dia pesado hoje — não precisa ser perfeito, só não comprar o pod.');
    }

    return msgs;
  }

  function getMotivationPool() {
    const personal = buildPersonalizedMessages();
    const indices = getContextualMotivationPool();
    const staticMsgs = indices
      ? indices.map((i) => MOTIVATIONAL_MESSAGES[i])
      : MOTIVATIONAL_MESSAGES;
    return [...personal, ...staticMsgs];
  }

  function getContextualMotivationPool() {
    const today = dateKey(new Date());
    const mood = data.moods[today];
    const days = getCurrentAttemptDays();
    const peak = getPeakHourInfo();

    if (mood === 'hard') return [9, 10, 11, 12, 13];
    if (mood === 'strong' || mood === 'great') return [14, 15, 16, 17, 13];
    if (days < 3) return [0, 1, 2, 3, 4, 5];
    if (peak.hasData && peak.peakHour === new Date().getHours()) return [6, 7, 8, 2, 33];
    return null;
  }

  function renderMotivation(forceNew = false) {
    const el = $('#motivation-text');
    if (!el) return;

    const pool = getMotivationPool();
    if (!pool.length) return;

    if (forceNew) {
      const candidates = pool.filter((t) => t !== motivationText);
      motivationText = candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0];
    } else if (motivationText === null) {
      const personal = buildPersonalizedMessages();
      if (personal.length && new Date().getDate() % 3 !== 0) {
        motivationText = personal[new Date().getDate() % personal.length];
      } else {
        motivationText = pool[new Date().getDate() % pool.length];
      }
    }

    const text = motivationText;

    if (forceNew && !prefersReducedMotion()) {
      el.classList.add('is-exiting');
      setTimeout(() => {
        el.textContent = text;
        el.classList.remove('is-exiting');
        el.classList.add('is-entering');
        setTimeout(() => el.classList.remove('is-entering'), 450);
      }, 200);
    } else {
      el.textContent = text;
    }
  }

  function renderDashboardPills() {
    const container = $('#dashboard-pills');
    if (!container) return;

    const todayCount = getCravingsOnDate(dateKey(new Date()));
    const streak = calcStreak();
    const hours = getElapsedHours();
    const next = MILESTONES.find((m) => hours < m.hours);
    const peak = getPeakHourInfo();
    const nowHour = new Date().getHours();
    const pills = [];

    pills.push(`<span class="dash-pill accent">Hoje: <strong>${todayCount}</strong> fissura${todayCount !== 1 ? 's' : ''}</span>`);

    if (streak > 0) {
      pills.push(`<span class="dash-pill">Sequência: <strong>${streak}</strong> dia${streak > 1 ? 's' : ''}</span>`);
    }

    if (next) {
      pills.push(`<span class="dash-pill">Próximo: <strong>${next.icon} ${next.title}</strong></span>`);
    }

    if (peak.hasData) {
      const isNow = peak.peakHour === nowHour;
      const label = isNow ? 'Horário de pico agora' : `Pico às ${String(peak.peakHour).padStart(2, '0')}h`;
      pills.push(`<span class="dash-pill warn">${label}</span>`);
    }

    const mood = data.moods[dateKey(new Date())];
    if (mood) {
      const moodIcons = { great: '😊', ok: '😐', hard: '😔', strong: '💪' };
      pills.push(`<span class="dash-pill">Humor: <strong>${moodIcons[mood] || '—'}</strong></span>`);
    }

    container.innerHTML = pills.join('');
  }

  function renderPeakHours() {
    const chart = $('#peak-hours-chart');
    const insight = $('#peak-hours-insight');
    const badge = $('#peak-hour-badge');
    if (!chart || !insight) return;

    const { hasData, peakHour, hours, max } = getPeakHourInfo();

    if (!hasData) {
      chart.innerHTML = '';
      insight.textContent = 'Registre fissuras com o botão Soltar para descobrir em quais horários elas costumam bater.';
      insight.classList.remove('is-updating');
      if (badge) badge.classList.add('hidden');
      return;
    }

    const nowHour = new Date().getHours();
    const majorHours = [0, 6, 12, 18];
    const animate = !prefersReducedMotion();

    chart.innerHTML = hours.map((count, h) => {
      const pct = Math.max(8, (count / max) * 100);
      const isPeak = count === max && count > 0;
      const isHigh = count >= max * 0.7 && count > 0;
      let cls = 'peak-hour-bar';
      if (count > 0) cls += ' has-data';
      if (isPeak) cls += ' peak';
      else if (isHigh) cls += ' peak-high';
      if (animate) cls += ' bar-grow';
      const labelCls = majorHours.includes(h) ? 'peak-hour-label major' : 'peak-hour-label';
      const showLabel = majorHours.includes(h) ? String(h) : '';
      const wrapCls = h === nowHour ? 'peak-hour-bar-wrap is-now' : 'peak-hour-bar-wrap';
      const barStyle = animate ? `--h:${pct}%` : `height:${pct}%`;
      return `<div class="${wrapCls}" data-hour="${h}" style="--i:${h}" title="${h}h: ${count} fissura${count !== 1 ? 's' : ''}"><div class="${cls}" style="${barStyle}"></div><span class="${labelCls}">${showLabel}</span></div>`;
    }).join('');

    chart.querySelectorAll('.peak-hour-bar-wrap').forEach((wrap) => {
      wrap.addEventListener('click', () => {
        const h = parseInt(wrap.dataset.hour, 10);
        const count = hours[h];
        chart.querySelectorAll('.peak-hour-bar-wrap').forEach((w) => w.classList.toggle('is-active', w === wrap));
        insight.classList.add('is-updating');
        setTimeout(() => {
          insight.textContent = count > 0
            ? `${String(h).padStart(2, '0')}h — ${count} fissura${count !== 1 ? 's' : ''} registrada${count !== 1 ? 's' : ''} neste horário.`
            : `${String(h).padStart(2, '0')}h — nenhuma fissura registrada ainda. Um bom horário para estar tranquilo.`;
          insight.classList.remove('is-updating');
        }, prefersReducedMotion() ? 0 : 150);
        haptic(6);
      });
    });

    if (badge) {
      badge.classList.remove('hidden');
      badge.textContent = peakHour === nowHour ? 'Pico agora' : `Pico: ${String(peakHour).padStart(2, '0')}h`;
    }

    const peakCount = hours[peakHour];
    const nearby = hours
      .map((c, h) => ({ h, c }))
      .filter(({ c }) => c >= max * 0.6)
      .sort((a, b) => a.h - b.h);

    let rangeText;
    if (nearby.length <= 1) {
      rangeText = `às ${peakHour}h`;
    } else {
      const start = nearby[0].h;
      const end = nearby[nearby.length - 1].h;
      rangeText = start === end ? `às ${start}h` : `entre ${start}h e ${end}h`;
    }

    const prep = peakHour === nowHour
      ? 'Você está no seu horário de pico — respire fundo e use o botão Soltar se precisar.'
      : `Prepare-se ${rangeText}: é quando você mais solta fissuras (${peakCount} no total).`;

    insight.textContent = `Suas fissuras costumam bater ${rangeText}. ${prep}`;
  }

  function buildTimelineEvents() {
    const events = [];
    const quitAt = parseQuitAt(data.quitAt);

    events.push({
      id: 'start-current',
      type: 'start',
      at: quitAt.toISOString(),
      icon: '🌿',
      title: 'Você decidiu parar',
      desc: data.reason || 'Um novo começo — sem pods, com liberdade.',
      meta: `Desde ${quitAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
    });

    const elapsed = getElapsedHours();
    MILESTONES.forEach((m, i) => {
      if (elapsed < m.hours) return;
      const at = new Date(quitAt.getTime() + m.hours * 3600000);
      events.push({
        id: `milestone-${i}`,
        type: 'milestone',
        at: at.toISOString(),
        icon: m.icon,
        title: m.title,
        desc: m.desc,
        meta: 'Marco de recuperação alcançado',
      });
    });

    (data.cravingLog || []).forEach((entry, i) => {
      const trigger = entry.trigger ? TRIGGERS.find((t) => t.id === entry.trigger) : null;
      const substitute = entry.substitute ? SUBSTITUTES.find((s) => s.id === entry.substitute) : null;
      let desc = 'Você soltou essa fissura sem ceder ao pod.';
      if (trigger && substitute) desc = `${trigger.icon} ${trigger.label} → ${substitute.icon} ${substitute.label}`;
      else if (trigger) desc = `Gatilho: ${trigger.icon} ${trigger.label}`;
      events.push({
        id: `craving-${i}-${entry.time}`,
        type: 'craving',
        at: entry.time,
        icon: '🔥',
        title: 'Fissura solta',
        desc,
        meta: entry.resisted ? 'Impulso liberado' : '',
        raw: entry,
      });
    });

    (data.relapses || []).forEach((r, i) => {
      const d = new Date(r.at);
      events.push({
        id: `relapse-${i}-${r.at}`,
        type: 'relapse',
        at: r.at,
        icon: '🤍',
        title: 'Recomeço com compaixão',
        desc: r.note || 'Um tropeço não apaga sua jornada. Você recomeçou.',
        meta: r.daysFreeBefore >= 1 ? `${r.daysFreeBefore} dias livres antes` : 'Novo começo',
        raw: r,
      });
    });

    return events.sort((a, b) => new Date(b.at) - new Date(a.at));
  }

  function formatTimelineWhen(iso) {
    const d = new Date(iso);
    const now = new Date();
    const isToday = dateKey(d) === dateKey(now);
    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `Hoje às ${time}`;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + time;
  }

  function showTimelineDetail(event) {
    const panel = $('#timeline-detail');
    if (!panel || !event) return;
    panel.classList.remove('hidden');
    panel.style.animation = 'none';
    void panel.offsetWidth;
    panel.style.animation = '';
    panel.innerHTML = `
      <div class="timeline-detail-icon">${event.icon}</div>
      <div class="timeline-detail-title">${event.title}</div>
      <div class="timeline-detail-body">${event.desc}</div>
      ${event.meta ? `<div class="timeline-detail-meta">${event.meta}</div>` : ''}
    `;
  }

  function renderInteractiveTimeline() {
    const container = $('#interactive-timeline');
    if (!container) return;

    const events = buildTimelineEvents().filter((e) => {
      if (selectedTimelineFilter === 'all') return true;
      return e.type === selectedTimelineFilter;
    });

    if (!events.length) {
      container.innerHTML = '<p class="empty-state">Nenhum evento neste filtro ainda. Sua jornada está só começando.</p>';
      $('#timeline-detail')?.classList.add('hidden');
      return;
    }

    if (selectedTimelineId && !events.find((e) => e.id === selectedTimelineId)) {
      selectedTimelineId = null;
    }

    container.innerHTML = events.slice(0, 40).map((e, i) => `
      <div class="itl-item type-${e.type}${e.id === selectedTimelineId ? ' selected' : ''}" data-id="${e.id}" style="--i:${i}" role="button" tabindex="0" aria-pressed="${e.id === selectedTimelineId}">
        <div class="itl-dot"></div>
        <div class="itl-when">${formatTimelineWhen(e.at)}</div>
        <div class="itl-title">${e.icon} ${e.title}</div>
        <div class="itl-desc">${e.desc}</div>
      </div>
    `).join('');

    container.querySelectorAll('.itl-item').forEach((item) => {
      const id = item.dataset.id;
      const event = events.find((e) => e.id === id);
      const select = () => {
        selectedTimelineId = id;
        container.querySelectorAll('.itl-item').forEach((el) => {
          const on = el.dataset.id === id;
          el.classList.toggle('selected', on);
          el.setAttribute('aria-pressed', on);
        });
        showTimelineDetail(event);
        haptic(8);
      };
      item.addEventListener('click', select);
      item.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          select();
        }
      });
    });

    if (selectedTimelineId) {
      const selected = events.find((e) => e.id === selectedTimelineId);
      if (selected) showTimelineDetail(selected);
    }
  }

  function checkAchievements() {
    if (!data) return;
    const hours = getElapsedHours();
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach((a) => {
      if (data.unlockedAchievements.includes(a.id)) return;
      if (a.test(data, hours)) {
        data.unlockedAchievements.push(a.id);
        newlyUnlocked.push(a);
      }
    });

    if (newlyUnlocked.length) {
      saveData();
      newlyUnlocked.forEach((a, i) => {
        setTimeout(() => {
          celebrateUnlock({
            icon: a.icon,
            label: 'Conquista desbloqueada',
            title: a.title,
            desc: a.desc,
          });
        }, i * 3200);
      });
      renderAchievements();
    }
  }

  function renderAchievements() {
    const grid = $('#achievements-grid');
    const countEl = $('#achievements-count');
    if (!grid || !data) return;

    const hours = getElapsedHours();
    const unlocked = data.unlockedAchievements || [];
    const unlockedCount = ACHIEVEMENTS.filter((a) => unlocked.includes(a.id)).length;

    if (countEl) countEl.textContent = `${unlockedCount}/${ACHIEVEMENTS.length}`;

    grid.innerHTML = ACHIEVEMENTS.map((a) => {
      const isUnlocked = unlocked.includes(a.id);
      const almost = !isUnlocked && a.test(data, hours);
      return `<div class="achievement-badge${isUnlocked ? ' unlocked' : ''}${almost ? ' almost' : ''}" title="${a.desc}">
        <span class="achievement-icon">${a.icon}</span>
        <span class="achievement-title">${a.title}</span>
        <span class="achievement-desc">${isUnlocked ? 'Desbloqueada' : a.desc}</span>
      </div>`;
    }).join('');
  }

  function renderMoodCravingChart() {
    const chart = $('#mood-craving-chart');
    const insight = $('#mood-craving-insight');
    if (!chart || !insight) return;

    const days = getLast7Days();
    const max = Math.max(...days.map((d) => d.count), 1);
    const todayKey = dateKey(new Date());
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const animate = !prefersReducedMotion();

    const moodCounts = { hard: 0, ok: 0, great: 0, strong: 0 };
    let hardCravings = 0;
    let easyCravings = 0;
    let moodDays = 0;

    chart.innerHTML = days.map((d, i) => {
      const mood = data.moods[d.key];
      const h = Math.max(4, (d.count / max) * 80);
      const isToday = d.key === todayKey;
      const moodIcon = mood ? MOOD_ICONS[mood] : '·';
      const barCls = `mood-craving-bar${isToday ? ' today' : ''}${animate ? ' bar-grow' : ''}`;
      const barStyle = animate ? `--h:${h}px;--i:${i}` : `height:${h}px`;

      if (mood) {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        moodDays++;
        if (mood === 'hard') hardCravings += d.count;
        else easyCravings += d.count;
      }

      return `<div class="mood-craving-col">
        <span class="mood-craving-mood${mood ? ' has-mood' : ''}">${moodIcon}</span>
        <span class="mood-craving-count">${d.count}</span>
        <div class="${barCls}" style="${barStyle}"></div>
        <span class="mood-craving-label">${dayNames[d.date.getDay()]}</span>
      </div>`;
    }).join('');

    if (moodDays < 2) {
      insight.textContent = 'Registre seu humor no check-in diário para ver como ele se relaciona com suas fissuras.';
      return;
    }

    if (hardCravings > easyCravings && hardCravings > 0) {
      insight.textContent = 'Nos dias difíceis você tende a soltar mais fissuras — normal. O check-in ajuda a se preparar.';
    } else if (easyCravings > hardCravings) {
      insight.textContent = 'Mesmo com fissuras, seus dias bons superam os pesados. O padrão tá melhorando.';
    } else {
      insight.textContent = 'Humor e fissuras variam — o importante é continuar registrando para entender seu ritmo.';
    }
  }

  function renderDashboard() {
    renderMotivation();
    renderDashboardPills();
    renderPeakHours();
    renderMoodCravingChart();
    renderInteractiveTimeline();
    updateTimelineFilterTrack();
  }

  function renderAll() {
    renderStats();
    renderQuitSince();
    renderCheckin();
    renderProgressRing();
    renderHeaderStat();
    updateHeader(activeTab);
    renderReason();
    renderGoodbye();
    renderContrast();
    renderNextMilestone();
    renderMilestones();
    renderHealthTimeline();
    renderJourneyTimeline();
    renderCravingLog();
    renderDailyCravings();
    renderFuture();
    renderTriggerMap();
    renderLifetime();
    renderAchievements();
    checkAchievements();
    renderDashboard();
    updateLiberationVisual();
  }

  function renderProgressRing() {
    const pct = Math.min(100, (getElapsedHours() / GOAL_HOURS) * 100);
    const ring = $('#main-progress-ring');
    if (ring) ring.style.strokeDashoffset = RING_CIRC * (1 - pct / 100);
  }

  function renderQuitSince() {
    const quit = parseQuitAt(data.quitAt);
    $('#quit-since').textContent = `Desde ${quit.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} às ${quit.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  function renderCheckin() {
    const today = dateKey(new Date());
    const mood = data.moods[today];
    $$('.mood-btn').forEach((btn) => btn.classList.toggle('selected', btn.dataset.mood === mood));
    $('#checkin-message').textContent = mood ? MOOD_MESSAGES[mood] : '';
  }

  function renderStats() {
    const days = getElapsedHours() / 24;
    const pods = getPodsAvoided(days);
    bumpStat($('#money-saved'), formatMoney(pods * data.podCost));
    bumpStat($('#nicotine-avoided'), formatNicotine(pods * data.nicotineMg));
    bumpStat($('#pods-avoided'), pods >= 10 ? String(Math.round(pods)) : pods.toFixed(1));
    bumpStat($('#cravings-resisted'), String(data.cravingsResisted));
  }

  function formatMoney(val) {
    return 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatNicotine(val) {
    if (val >= 1000) return (val / 1000).toFixed(1) + ' g';
    return Math.round(val) + ' mg';
  }

  function renderReason() {
    const card = $('#reason-card');
    if (data.reason) {
      card.classList.remove('hidden');
      $('#reason-text').textContent = '"' + data.reason + '"';
    } else {
      card.classList.add('hidden');
    }
  }

  function renderGoodbye() {
    const card = $('#goodbye-card');
    if (data.goodbyeLetter) {
      card.classList.remove('hidden');
      $('#goodbye-text').textContent = '"' + data.goodbyeLetter + '"';
    } else {
      card.classList.add('hidden');
    }
  }

  function renderContrast() {
    const card = $('#contrast-card');
    const hasBefore = !!data.goodbyeLetter;
    const hasAfter = !!data.reason;
    if (!hasBefore && !hasAfter) {
      card.classList.add('hidden');
      return;
    }
    card.classList.remove('hidden');
    $('#contrast-before').textContent = hasBefore
      ? data.goodbyeLetter
      : 'O pod controlava momentos do meu dia.';
    const days = Math.floor(getCurrentAttemptDays());
    $('#contrast-after').textContent = hasAfter
      ? data.reason
      : `${days} dia${days !== 1 ? 's' : ''} escolhendo não usar.`;
  }

  function renderLifetime() {
    const card = $('#lifetime-card');
    const relapses = data.lifetime?.relapses || 0;
    if (relapses === 0) {
      card.classList.add('hidden');
      return;
    }
    card.classList.remove('hidden');
    $('#lifetime-days').textContent = Math.floor(getTotalDaysFree());
    $('#lifetime-restarts').textContent = relapses;

    const container = $('#relapse-history');
    if (!data.relapses?.length) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = data.relapses.slice(0, 5).map((r) => {
      const d = new Date(r.at);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      const detail = r.daysFreeBefore >= 1
        ? `${r.daysFreeBefore} dias livres antes${r.note ? ' · ' + r.note : ''}`
        : (r.note || 'Recomeço');
      return `<div class="relapse-entry"><div class="relapse-entry-date">${dateStr}</div><div class="relapse-entry-detail">${detail}</div></div>`;
    }).join('');
  }

  function renderNextMilestone() {
    const hours = getElapsedHours();
    const next = MILESTONES.find((m) => hours < m.hours);
    const card = $('#next-milestone-card');
    if (!next) { card.classList.add('hidden'); return; }
    card.classList.remove('hidden');
    $('#next-milestone-icon').textContent = next.icon;
    $('#next-milestone-title').textContent = next.title;
    $('#next-milestone-remaining').textContent = formatRemaining(next.hours - hours);
  }

  function renderMilestones() {
    const hours = getElapsedHours();
    let foundCurrent = false;
    $('#milestones').innerHTML = MILESTONES.map((m) => {
      const achieved = hours >= m.hours;
      const isCurrent = !achieved && !foundCurrent;
      if (isCurrent) foundCurrent = true;
      let timeLabel = achieved ? '✓ Conquistado' : isCurrent ? formatRemaining(m.hours - hours) : formatMilestoneTime(m.hours);
      const classes = ['milestone'];
      if (achieved) classes.push('achieved');
      if (isCurrent) classes.push('current');
      return `<div class="${classes.join(' ')}"><div class="milestone-icon">${m.icon}</div><div class="milestone-info"><div class="milestone-title">${m.title}</div><div class="milestone-desc">${m.desc}</div></div><span class="milestone-time">${timeLabel}</span></div>`;
    }).join('');
  }

  function formatMilestoneTime(hours) {
    if (hours < 1) return Math.round(hours * 60) + ' min';
    if (hours < 24) return Math.round(hours) + 'h';
    if (hours < 168) return Math.round(hours / 24) + ' dias';
    if (hours < 720) return Math.round(hours / 168) + ' sem';
    return Math.round(hours / 720) + ' mês';
  }

  function formatRemaining(hours) {
    if (hours < 1) return 'Faltam ' + Math.ceil(hours * 60) + ' min';
    if (hours < 24) return 'Faltam ' + Math.ceil(hours) + 'h';
    return 'Faltam ' + Math.ceil(hours / 24) + ' dias';
  }

  function renderHealthTimeline() {
    const hours = getElapsedHours();
    const nextItem = HEALTH_TIMELINE.find((t) => hours < t.hours);
    $('#health-timeline').innerHTML = HEALTH_TIMELINE.map((item) => {
      const done = hours >= item.hours;
      const active = !done && item === nextItem;
      const classes = ['timeline-item'];
      if (done) classes.push('done');
      if (active) classes.push('active');
      return `<div class="${classes.join(' ')}"><div class="timeline-dot"></div><div class="timeline-when">${item.when}</div><div class="timeline-title">${item.title}</div><div class="timeline-desc">${item.desc}</div></div>`;
    }).join('');
  }

  function renderJourneyTimeline() {
    const hours = getElapsedHours();
    const pct = Math.min(100, (hours / GOAL_HOURS) * 100);
    const activeIdx = JOURNEY_POINTS.findIndex((p) => hours < p.hours);
    const currentIdx = activeIdx === -1 ? JOURNEY_POINTS.length - 1 : activeIdx;

    const points = JOURNEY_POINTS.map((p, i) => {
      let state = 'future';
      if (i < currentIdx) state = 'past';
      else if (i === currentIdx) state = 'current';
      return `<div class="journey-point ${state}"><div class="journey-dot"></div><span class="journey-point-label">${p.label}</span></div>`;
    }).join('');

    $('#journey-timeline').innerHTML = `<div class="journey-track"><div class="journey-track-fill" style="width:${pct}%"></div></div><div class="journey-points">${points}</div>`;
  }

  function renderDailyCravings() {
    const today = dateKey(new Date());
    const todayCount = getCravingsOnDate(today);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayCount = getCravingsOnDate(dateKey(yesterday));

    $('#today-cravings').textContent = todayCount;

    const vsEl = $('#today-vs-yesterday');
    if (todayCount > yesterdayCount) {
      vsEl.textContent = `+${todayCount - yesterdayCount} vs ontem`;
      vsEl.style.color = 'var(--warning)';
    } else if (todayCount < yesterdayCount) {
      vsEl.textContent = `${yesterdayCount - todayCount} a menos que ontem ✓`;
      vsEl.style.color = 'var(--success)';
    } else {
      vsEl.textContent = yesterdayCount === 0 && todayCount === 0 ? 'Nenhuma ainda hoje' : 'Igual a ontem';
      vsEl.style.color = 'var(--text-muted)';
    }

    const days = getLast7Days();
    const total = days.reduce((s, d) => s + d.count, 0);
    const avg = (total / 7).toFixed(1);
    $('#daily-average').textContent = `Média: ${avg}/dia`;

    const streak = calcStreak();
    $('#craving-streak').textContent = streak > 0
      ? `${streak} dia${streak > 1 ? 's' : ''} vencendo fissuras`
      : 'Registre fissuras vencidas para ver sua sequência';

    renderWeeklyChart(days);
    renderCravingInsight(todayCount, avg, days);
  }

  function calcStreak() {
    let streak = 0;
    const d = new Date();
    if (getCravingsOnDate(dateKey(d)) === 0) {
      d.setDate(d.getDate() - 1);
    }
    const quitKey = dateKey(parseQuitAt(data.quitAt));
    while (true) {
      const key = dateKey(d);
      if (key < quitKey) break;
      if (getCravingsOnDate(key) > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  function renderWeeklyChart(days) {
    const max = Math.max(...days.map((d) => d.count), 1);
    const todayKey = dateKey(new Date());
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const animate = !prefersReducedMotion();
    $('#weekly-chart').innerHTML = days.map((d, i) => {
      const h = Math.max(8, (d.count / max) * 80);
      const isToday = d.key === todayKey;
      const barCls = `chart-bar${isToday ? ' today' : ''}${animate ? ' bar-grow' : ''}`;
      const barStyle = animate ? `--h:${h}px;--i:${i}` : `height:${h}px`;
      return `<div class="chart-bar-wrap"><span class="chart-value">${d.count}</span><div class="${barCls}" style="${barStyle}"></div><span class="chart-label">${dayNames[d.date.getDay()]}</span></div>`;
    }).join('');
  }

  function renderCravingInsight(todayCount, avg, days) {
    const el = $('#craving-insight');
    if (data.cravingsResisted === 0) {
      el.textContent = 'Quando a fissura bater, toque em Soltar. Cada impulso que você deixa passar fortalece sua liberdade.';
      return;
    }
    const trend = days.slice(-3).reduce((s, d) => s + d.count, 0);
    const prev = days.slice(0, 3).reduce((s, d) => s + d.count, 0);
    if (trend < prev) {
      el.textContent = `Suas fissuras estão diminuindo! Nos últimos 3 dias você venceu menos que no início da semana. O corpo está se adaptando.`;
    } else if (todayCount > parseFloat(avg) * 1.5) {
      el.textContent = `Dia mais intenso que a média — normal nos primeiros dias. Cada uma que você vence é progresso real.`;
    } else {
      el.textContent = `Você já venceu ${data.cravingsResisted} fissura${data.cravingsResisted > 1 ? 's' : ''} no total. Cada uma fortalece novos caminhos no seu cérebro.`;
    }
  }

  function renderCravingLog() {
    const container = $('#craving-log');
    $('#craving-count-badge').textContent = data.cravingsResisted;
    if (!data.cravingLog.length) {
      container.innerHTML = '<p class="empty-state">Nenhuma fissura registrada ainda. Toque em Soltar quando precisar.</p>';
      return;
    }
    container.innerHTML = data.cravingLog.slice(0, 15).map((entry) => {
      const date = new Date(entry.time);
      const label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const trigger = entry.trigger ? TRIGGERS.find((t) => t.id === entry.trigger) : null;
      const sub = trigger ? ` · ${trigger.icon} ${trigger.label}` : '';
      return `<div class="craving-entry"><span>${label}${sub}</span><span class="badge">Solta</span></div>`;
    }).join('');
  }

  function renderFuture() {
    if (!data) return;
    const hours = getElapsedHours();
    const days = hours / 24;

    $('#projections').innerHTML = PROJECTION_PERIODS.map((p) => {
      const proj = getProjection(p.days);
      const remaining = Math.max(0, p.days - days);
      const label = remaining > 0 ? `em ${Math.ceil(remaining)} dias` : 'já alcançado!';
      return `<div class="projection-card glass"><span class="projection-period">${p.label}</span><div class="projection-stats"><div class="projection-main">${formatMoney(proj.money)}</div><div class="projection-detail">${Math.round(proj.pods)} pods · ${formatNicotine(proj.nicotine)} evitados · ${label}</div></div></div>`;
    }).join('');

    const unlocked = Math.floor(hours / 168);
    $('#future-benefits').innerHTML = FUTURE_BENEFITS.map((b, i) => {
      const isUnlocked = i < unlocked || hours >= GOAL_HOURS;
      return `<div class="future-item${isUnlocked ? ' unlocked' : ''}"><span class="future-item-icon">${b.icon}</span><div><div class="future-item-title">${isUnlocked ? '✓ ' : ''}${b.title}</div><div class="future-item-desc">${b.desc}</div></div></div>`;
    }).join('');

    const futureMoney = getProjection(365).money;
    const futurePods = Math.round(getProjection(365).pods);
    const reason = data.reason ? ` Você escolheu parar porque: "${data.reason}".` : '';
    const goodbye = data.goodbyeLetter
      ? ` Você já soltou o que o pod representava — e isso não volta.`
      : '';
    const totalDays = Math.floor(getTotalDaysFree());
    const lifetimeNote = (data.lifetime?.relapses || 0) > 0
      ? ` Mesmo com recomeços, você já acumulou ${totalDays} dias livres.`
      : '';
    $('#future-letter').textContent =
      `Daqui a um ano, olhando para trás, você vai agradecer por cada fissura que soltou. ` +
      `Se continuar, terá economizado cerca de ${formatMoney(futureMoney)} e evitado ${futurePods} pods — ` +
      `e seu corpo estará livre da dependência dos sais de nicotina.${goodbye}${reason}${lifetimeNote} ` +
      `Você merece essa liberdade.`;
  }

  init();
})();
