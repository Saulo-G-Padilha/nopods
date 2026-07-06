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
    great: 'Que bom! Aproveite esse momento de força. 🌿',
    ok: 'Dias normais também contam. Você está indo bem.',
    hard: 'Dias difíceis passam. Use o botão de fissura se precisar.',
    strong: 'Sua determinação é inspiradora. Continue! 💪',
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
    home: 'Início',
    cravings: 'Fissuras',
    progress: 'Progresso',
    future: 'Futuro',
  };

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
    return { enabled: false, daily: true, time: '09:00', milestones: true, lastDaily: null };
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
    if (!saved.moods) saved.moods = {};
    if (!saved.notifiedMilestones) saved.notifiedMilestones = [];
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
        const msg = `Marco conquistado: ${m.title}! ${m.desc}`;
        showBanner('🎉 ' + msg);
        sendNotification('NoPods — Marco conquistado!', `${m.icon} ${m.title}: ${m.desc}`);
        showToast(`Marco: ${m.title}! 🎉`);
      }
    });
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
    alertInterval = setInterval(() => {
      checkMilestoneAlerts();
      checkDailyReminder();
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
    initHeaderScroll();
    initTriggerChips();
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
    switchTab('home');
    renderAll();
    startTimer();
    startAlertChecker();
  }

  function switchTab(tab) {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateHeader(tab);
    haptic(8);
    if (tab === 'future') renderFuture();
    if (tab === 'progress') renderLifetime();
    if (tab === 'cravings') {
      renderDailyCravings();
      renderTriggerMap();
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
      }
    });
  }

  function saveAlertsFromForm() {
    data.alerts = {
      enabled: $('#alert-enabled').checked,
      daily: $('#alert-daily').checked,
      time: $('#alert-time').value,
      milestones: $('#alert-milestones').checked,
      lastDaily: data.alerts?.lastDaily || null,
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
    $('#checkin-message').textContent = MOOD_MESSAGES[mood];
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
    $('#days').textContent = Math.floor(totalSec / 86400);
    $('#hours').textContent = String(Math.floor((totalSec % 86400) / 3600)).padStart(2, '0');
    $('#minutes').textContent = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    $('#seconds').textContent = String(totalSec % 60).padStart(2, '0');
    renderHeaderStat();

    const pct = Math.min(100, Math.round((getElapsedHours() / GOAL_HOURS) * 100));
    $('#progress-percent').textContent = pct + '%';
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
        <div class="trigger-bar-track"><div class="trigger-bar-fill" style="width:${(t.count / max) * 100}%"></div></div>
        <span class="trigger-bar-count">${t.count}</span>
      </div>
    `).join('');
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
    $('#money-saved').textContent = formatMoney(pods * data.podCost);
    $('#nicotine-avoided').textContent = formatNicotine(pods * data.nicotineMg);
    $('#pods-avoided').textContent = pods >= 10 ? Math.round(pods) : pods.toFixed(1);
    $('#cravings-resisted').textContent = data.cravingsResisted;
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
    $('#weekly-chart').innerHTML = days.map((d) => {
      const h = Math.max(8, (d.count / max) * 80);
      const isToday = d.key === todayKey;
      return `<div class="chart-bar-wrap"><span class="chart-value">${d.count}</span><div class="chart-bar${isToday ? ' today' : ''}" style="height:${h}px"></div><span class="chart-label">${dayNames[d.date.getDay()]}</span></div>`;
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
