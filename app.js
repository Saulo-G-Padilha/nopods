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
    learn: 'Aprender',
  };

  const MYTHS_TRUTHS = [
    {
      myth: 'Pod de nicotina é "mais seguro" que cigarro, então não vicia de verdade.',
      truth: 'Um pod pode ter até 50mg de nicotina — às vezes mais que um maço inteiro. Os sais de nicotina foram feitos para entrar no sangue ainda mais rápido. A dependência é real, e muita gente subestima.',
    },
    {
      myth: 'Só usar em festa ou no happy hour não conta como dependência.',
      truth: 'Se você sente vontade antes de sair, compra "só por precaução" ou fica inquieto sem pod por perto — isso já é sinal. Não precisa usar todo dia para estar preso.',
    },
    {
      myth: 'Vou conseguir parar quando quiser, porque não é cigarro.',
      truth: 'A nicotina vicia independente do veículo — cigarro, vape ou pod. Muita gente descobre que parar de pod é tão difícil quanto parar de fumar, às vezes mais, porque o pod está sempre na mão.',
    },
    {
      myth: 'Se eu reduzir o mg, paro naturalmente.',
      truth: 'Trocar de 50mg para 35mg ou 20mg pode ajudar como estratégia, mas raramente resolve sozinho. O hábito — mão na boca, pausas, gatilhos — continua. Reduzir sem plano costuma só alongar a dependência.',
    },
    {
      myth: 'Fissura é fraqueza. Quem quer de verdade não sente.',
      truth: 'Fissura é abstinência química, não caráter. O cérebro associou certos momentos com nicotina. Resistir não é "ser forte" — é saber que a onda passa em minutos.',
    },
    {
      myth: 'Um dia usando não faz mal depois de tantos dias parado.',
      truth: 'Um pod hoje reativa circuitos que estavam adormecendo. Não apaga seus dias anteriores, mas aumenta a chance de comprar outro amanhã. Por isso registra e recomeça — não finge que não aconteceu.',
    },
    {
      myth: 'Recaída apaga todo o progresso — voltei à estaca zero.',
      truth: 'Seu corpo não desfez as semanas sem nicotina. Os receptores já se adaptaram parcialmente. Recomeçar costuma ser mais rápido — o que você aprendeu sobre gatilhos e fissuras ainda serve.',
    },
    {
      myth: 'Não preciso de ajuda porque pod não é "coisa séria".',
      truth: 'Dependência de nicotina é diagnóstico médico, inclusive por vape e pod. Grupos de apoio, terapia e substitutos existem e funcionam. Pedir ajuda não é drama — é inteligência.',
    },
    {
      myth: 'O vapor é só água, não faz mal pro pulmão.',
      truth: 'Vape e pod liberam partículas finas, metais e compostos químicos. Não é só vapor de água. Os pulmões já melhoram depois de parar — outro motivo para não voltar "só um pouco".',
    },
    {
      myth: 'Depois que passar a abstinência, nunca mais vou sentir vontade.',
      truth: 'A abstinência física melhora nas primeiras semanas, mas gatilhos emocionais — estresse, tédio, álcool — podem voltar meses depois. Não significa fracasso. O hábito ainda lembra do pod em certas situações.',
    },
  ];

  const RESTART_GUIDE = [
    {
      icon: '🤍',
      title: 'Recaída não é o fim da história',
      body: 'Usar um pod de novo dói — especialmente depois de dias ou semanas limpo. Mas não define quem você é. Muita gente largou de vez depois de várias tentativas.',
    },
    {
      icon: '📊',
      title: 'O que você conquistou não some',
      body: 'Cada dia sem pod, cada fissura resistida e cada real economizado continua na sua história. O NoPods guarda isso em "Sua história completa", na aba Progresso.',
    },
    {
      icon: '🔄',
      title: 'Recomeçar é diferente de começar do zero',
      body: 'Você já conhece seus horários de pico, seus gatilhos e o que ajuda na fissura. Na segunda tentativa, esse mapa é ouro. Use o que aprendeu.',
    },
    {
      icon: '⏱️',
      title: 'As primeiras 72 horas de novo',
      body: 'Se você acabou de recair, os próximos dias podem ser intensos — não porque você falhou, mas porque a nicotina voltou. Água, sono e evitar álcool ajudam.',
    },
    {
      icon: '💬',
      title: 'Conte pra alguém (ou pra você)',
      body: 'Esconder a recaída aumenta a vergonha e a chance de continuar. Escreva na carta do eu do futuro, manda mensagem pra um amigo ou registra aqui. Nomear o que aconteceu tira peso.',
    },
    {
      icon: '🆘',
      title: 'Quando buscar ajuda profissional',
      body: 'Se você já tentou várias vezes, usa pod o dia inteiro ou sente ansiedade forte ao parar — conversar com médico ou psicólogo não é exagero. Existe tratamento para dependência de nicotina.',
    },
  ];

  const EMERGENCY_KIT = [
    { icon: '💧', title: 'Água gelada', desc: 'Um gole grande. Ocupar a boca ajuda a segurar a onda.', action: 'step', step: 0 },
    { icon: '🫁', title: 'Respirar 90s', desc: '4-7-8: inspire, segure, expire. A fissura costuma passar antes.', action: 'step', step: 1 },
    { icon: '🚶', title: 'Mover o corpo', desc: 'Caminhe até a janela ou escada. Dopamina sem nicotina.', action: 'step', step: 2 },
    { icon: '⏱️', title: 'Esperar 5 min', desc: 'Fissura é uma onda — sobe e desce. Só marca o tempo.', action: 'timer', seconds: 300 },
    { icon: '🧊', title: 'Gelo na mão', desc: 'Segure um cubo. A sensação forte desvia o foco por minutos.', action: 'tip' },
    { icon: '🦷', title: 'Escovar os dentes', desc: 'Menta + boca ocupada. Muda o ambiente do impulso.', action: 'tip' },
    { icon: '📱', title: 'Mandar mensagem', desc: '"Tô com fissura" pra alguém de confiança. Não precisa explicar.', action: 'tip' },
    { icon: '✦', title: 'Fluxo Soltar', desc: 'Os 3 passos guiados completos: água, respiração e movimento.', action: 'full' },
    { icon: '💬', title: 'Conversar agora', desc: 'Apoio por IA pra atravessar a fissura — sem julgamento.', action: 'ai' },
  ];

  const AI_QUICK_CHIPS = [
    'A fissura tá muito forte',
    'Não aguento mais',
    'Só quero dar um puff',
    'Me ajuda a esperar 5 min',
  ];

  const WEEK_PROGRAM = [
    {
      day: 1,
      icon: '⚡',
      focus: 'Abstinência física',
      title: 'O corpo percebe',
      preview: 'As primeiras 24h sem nicotina salina. Tudo parece estranho — e é.',
      body: 'Seu corpo passou horas ou anos recebendo nicotina de forma rápida e constante. Hoje ela não veio. A cabeça pode interpretar isso como "preciso de um pod", mas na verdade é abstinência — sinal de que a dependência existia de verdade.',
      tip: 'Beba mais água que o normal hoje. Fissuras vêm em ondas de poucos minutos — não precisa vencer o dia inteiro, só a próxima onda.',
      action: 'soltar',
    },
    {
      day: 2,
      icon: '🧠',
      focus: 'Negociação mental',
      title: 'A cabeça negocia',
      preview: 'O cérebro vai tentar convencer você de que "só um não faz mal".',
      body: 'Hoje a mente costuma ficar mais criativa: "só um puff", "só o de 20mg", "depois do almoço eu paro de novo". Isso não é fraqueza — é o hábito lutando pra sobreviver. Você não precisa ganhar o debate, só não comprar o pod.',
      tip: 'Quando a negociação começar, nomeie em voz alta: "isso é a fissura falando". Parece bobo, mas tira o pensamento do piloto automático.',
      action: null,
    },
    {
      day: 3,
      icon: '🌊',
      focus: 'O pico',
      title: 'O dia mais intenso',
      preview: 'Para muita gente, o terceiro dia é o mais difícil. Você não está sozinho.',
      body: 'A nicotina salina sai do corpo rápido, mas os receptores ainda estão em choque. Irritação, ansiedade, dificuldade de concentrar — tudo isso pode bater forte hoje. Não significa que vai ser assim para sempre. Significa que você tá no meio da tempestade.',
      tip: 'Evite álcool e café em excesso hoje, se puder. Use o kit de emergência na aba Fissuras — cada ferramenta existe pra esse momento.',
      action: 'kit',
    },
    {
      day: 4,
      icon: '🌤️',
      focus: 'Depois do pico',
      title: 'A tempestade passa',
      preview: 'Se você chegou até aqui, o pior da abstinência física provavelmente já ficou pra trás.',
      body: 'Muita gente nota uma leveza a partir do quarto dia — não é linear, mas a tendência melhora. A fissura ainda vem, mas costuma ser mais curta e menos física. O desafio agora é mais mental: o hábito de puxar o pod em certos momentos.',
      tip: 'Observe seus gatilhos hoje sem julgamento. Café? Tédio? Depois de comer? Anotar mentalmente já ajuda a se preparar amanhã.',
      action: null,
    },
    {
      day: 5,
      icon: '🎯',
      focus: 'Gatilhos',
      title: 'Os gatilhos aparecem',
      preview: 'A nicotina saiu, mas os hábitos ficaram. Eles ativam em momentos específicos.',
      body: 'Hoje você pode perceber com mais clareza *quando* a vontade bate: no trânsito, no intervalo do trabalho, na festa, depois da refeição. O pod virou parte da rotina — e rotina demora mais pra mudar que a química.',
      tip: 'Depois de cada fissura que soltar, registre o gatilho no app. Em uma semana você terá um mapa pessoal do que evitar ou se preparar.',
      action: 'soltar',
    },
    {
      day: 6,
      icon: '🔓',
      focus: 'Automático enfraquecendo',
      title: 'A mão para de ir sozinha',
      preview: 'O gesto de buscar o pod no bolso começa a parecer estranho.',
      body: 'Seis dias sem nicotina e o circuito automático já enfraqueceu. Você ainda pode sentir vontade — mas ela não controla mais o dia inteiro. Cada vez que você não cede, o caminho neural do hábito perde força.',
      tip: 'Releia seu "porquê" nas configurações ou na carta do eu do futuro. No dia difícil, o motivo pessoal pesa mais que qualquer frase genérica.',
      action: null,
    },
    {
      day: 7,
      icon: '🌟',
      focus: 'Marco real',
      title: 'Uma semana. De verdade.',
      preview: 'Sete dias sem pod não é sorte — é trabalho que ninguém viu você fazendo.',
      body: 'Uma semana livre de nicotina salina é um marco concreto. Seu corpo já se adaptou significativamente. A jornada não acaba aqui — gatilhos vão voltar em semanas ou meses — mas você provou que consegue. Isso não tem preço.',
      tip: 'Celebre de um jeito que não envolva nicotina: um lanche que você gosta, um passeio, contar pra alguém. Reconhecer a vitória ajuda a fortalecer o hábito novo.',
      action: null,
    },
  ];

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
    { id: 'program_reader', icon: '📚', title: 'Guia completo', desc: 'Leu os 7 dias do programa', test: (d) => (d.weekProgramRead || []).length >= 7 },
  ];

  let data = null;
  let timerInterval = null;
  let alertInterval = null;
  let cravingInterval = null;
  let breathInterval = null;
  let emergencyTimerInterval = null;
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
  let aiChatHistory = [];
  let aiChatLoading = false;

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
  const shareModal = $('#share-modal');
  const aiChatModal = $('#ai-chat-modal');

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

  function defaultAiSettings() {
    return { shareReason: true, shareMood: true };
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
    if (!saved.weekProgramRead) saved.weekProgramRead = [];
    if (!saved.aiSettings) saved.aiSettings = defaultAiSettings();
    else {
      if (saved.aiSettings.shareReason === undefined) saved.aiSettings.shareReason = true;
      if (saved.aiSettings.shareMood === undefined) saved.aiSettings.shareMood = true;
    }
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

  const TAB_ORDER = ['home', 'cravings', 'progress', 'future', 'learn'];

  function updateNavIndicator(tab) {
    const ind = $('#nav-indicator');
    if (!ind) return;
    const idx = Math.max(0, TAB_ORDER.indexOf(tab));
    ind.style.setProperty('--nav-count', TAB_ORDER.length);
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
    const selector = '.btn, .nav-item, .timeline-filter, .mood-btn, .btn-motivation, .header-btn, .stat-card-dash, .header-brand';
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
      const programDay = getWeekProgramDay();
      const programMsg = programDay <= 7 ? WEEK_PROGRAM[programDay - 1] : null;
      const body = programMsg
        ? `Dia ${programDay}: ${programMsg.title}. ${programMsg.tip}`
        : msg;
      showBanner('☀️ ' + body);
      sendNotification('NoPods — Bom dia!', body);
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
    $('#btn-craving')?.classList.add('hidden');
    const now = new Date();
    const input = $('#quit-datetime');
    input.value = toDatetimeLocal(now);
    input.max = toDatetimeLocal(now);
  }

  function showApp() {
    setupScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    $('#btn-craving')?.classList.remove('hidden');
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
      $$('.nav-item, .desktop-tab').forEach((btn) => {
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
      if (tab === 'learn') {
        renderLearn();
        renderWeekProgram();
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
        weekProgramRead: [],
        aiSettings: defaultAiSettings(),
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
      saveAiSettingsFromForm();
      saveData();
      closeModal(settingsModal);
      renderAll();
      showToast('Configurações salvas');
    });

    $$('.nav-item, .desktop-tab').forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

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
    $('#btn-week-program-go')?.addEventListener('click', () => {
      switchTab('learn');
      setTimeout(() => expandWeekDay(getWeekProgramDay()), 350);
    });
    $('#btn-learn-relapse')?.addEventListener('click', openRelapseModal);
    $('#btn-share')?.addEventListener('click', openShareModal);
    $('#share-close')?.addEventListener('click', closeShareModal);
    $$('[data-close-share]').forEach((el) => el.addEventListener('click', closeShareModal));
    $('#btn-share-download')?.addEventListener('click', downloadShareImage);
    $('#btn-share-copy')?.addEventListener('click', copyShareText);
    $('#btn-share-native')?.addEventListener('click', nativeShare);
    $('#emergency-timer-cancel')?.addEventListener('click', cancelEmergencyTimer);
    $('#btn-ai-support')?.addEventListener('click', () => {
      closeModal(cravingModal);
      setTimeout(openAiChatModal, 220);
    });
    $('#ai-chat-close')?.addEventListener('click', closeAiChatModal);
    $$('[data-close-ai-chat]').forEach((el) => el.addEventListener('click', closeAiChatModal));
    $('#ai-chat-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#ai-chat-input');
      if (input?.value.trim()) {
        sendAiMessage(input.value);
        input.value = '';
      }
    });
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
        if (!shareModal?.classList.contains('hidden')) closeShareModal();
        if (!aiChatModal?.classList.contains('hidden')) closeAiChatModal();
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

  function saveAiSettingsFromForm() {
    data.aiSettings = {
      shareReason: $('#ai-share-reason')?.checked !== false,
      shareMood: $('#ai-share-mood')?.checked !== false,
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
      $('#btn-craving')?.classList.add('hidden');
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
    const ai = data.aiSettings || defaultAiSettings();
    $('#ai-share-reason').checked = ai.shareReason !== false;
    $('#ai-share-mood').checked = ai.shareMood !== false;
    openModal(settingsModal);
  }

  function openModal(modal) {
    modal.classList.remove('hidden');
    lockScroll();
  }

  function openCravingModal() {
    openCravingModalAt(0);
  }

  function openCravingModalAt(step = 0) {
    haptic(30);
    currentStep = step;
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
    data.weekProgramRead = [];

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
    document.body.classList.add('celebrating');
    lockScroll();
  }

  function closeCelebration() {
    const overlay = $('#celebration-overlay');
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('celebrating');
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
    if (modal === settingsModal) {
      saveAlertsFromForm();
      saveAiSettingsFromForm();
    }
    if (modal === aiChatModal) {
      aiChatHistory = [];
      removeAiTyping();
    }
  }

  function buildAiContext() {
    const ai = data.aiSettings || defaultAiSettings();
    const hours = getElapsedHours();
    const days = Math.floor(hours / 24);
    const peak = getPeakHourInfo();
    const moodKey = data.moods[dateKey(new Date())];
    const moodLabels = { great: 'bem', ok: 'ok', hard: 'difícil', strong: 'forte' };
    const ctx = {
      daysFree: days,
      hoursFree: Math.floor(hours % 24),
      todayCravings: getCravingsOnDate(dateKey(new Date())),
      totalCravingsResisted: data.cravingsResisted,
      restarts: data.lifetime?.relapses || 0,
    };
    if (ai.shareMood && moodKey) ctx.mood = moodLabels[moodKey] || moodKey;
    if (ai.shareReason && data.reason) ctx.reason = truncateText(data.reason, 120);
    if (isInFirstWeek()) ctx.programDay = getWeekProgramDay();
    if (peak.hasData) ctx.peakHour = peak.peakHour;
    return ctx;
  }

  function appendAiMessage(role, content) {
    const container = $('#ai-chat-messages');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `ai-msg ai-msg-${role}`;
    el.textContent = content;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function showAiTyping() {
    const container = $('#ai-chat-messages');
    if (!container || $('#ai-typing-indicator')) return;
    const el = document.createElement('div');
    el.id = 'ai-typing-indicator';
    el.className = 'ai-msg-typing';
    el.setAttribute('aria-label', 'Digitando');
    el.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function removeAiTyping() {
    $('#ai-typing-indicator')?.remove();
  }

  function updateAiSendButton() {
    const btn = $('#ai-chat-send');
    const input = $('#ai-chat-input');
    if (btn) btn.disabled = aiChatLoading;
    if (input) input.disabled = aiChatLoading;
  }

  function renderAiChips() {
    const chips = $('#ai-chat-chips');
    if (!chips) return;
    const show = aiChatHistory.length <= 1;
    chips.classList.toggle('hidden', !show);
    if (!chips.dataset.rendered) {
      chips.innerHTML = AI_QUICK_CHIPS.map((text) =>
        `<button type="button" class="ai-chip">${text}</button>`
      ).join('');
      chips.dataset.rendered = '1';
      chips.addEventListener('click', (e) => {
        const chip = e.target.closest('.ai-chip');
        if (chip) sendAiMessage(chip.textContent);
      });
    }
  }

  function renderAiWelcome() {
    const hours = getElapsedHours();
    const days = Math.floor(hours / 24);
    let welcome = 'Oi. Tô aqui com você. A fissura é passageira — me conta o que tá acontecendo agora.';
    if (days === 0 && hours < 6) {
      welcome = 'Primeiras horas são intensas. Respira comigo — o que você tá sentindo agora?';
    } else if (days < 3) {
      welcome = `Dia ${days + 1} sem pod. O corpo ainda tá se adaptando. Me fala como tá.`;
    }
    appendAiMessage('assistant', welcome);
    aiChatHistory.push({ role: 'assistant', content: welcome });
  }

  function openAiChatModal() {
    haptic(20);
    const container = $('#ai-chat-messages');
    if (container) container.innerHTML = '';
    aiChatHistory = [];
    aiChatLoading = false;
    updateAiSendButton();
    renderAiWelcome();
    renderAiChips();
    openModal(aiChatModal);
    setTimeout(() => $('#ai-chat-input')?.focus(), 320);
  }

  function closeAiChatModal() {
    if (aiChatModal) closeModal(aiChatModal);
  }

  async function sendAiMessage(text) {
    const msg = text?.trim();
    if (!msg || aiChatLoading) return;

    removeAiTyping();
    appendAiMessage('user', msg);
    aiChatHistory.push({ role: 'user', content: msg });
    $('#ai-chat-chips')?.classList.add('hidden');

    aiChatLoading = true;
    updateAiSendButton();
    showAiTyping();
    haptic(8);

    try {
      const res = await fetch('/api/craving-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: aiChatHistory.slice(0, -1),
          context: buildAiContext(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      removeAiTyping();
      if (!res.ok) throw new Error(json.error || 'Não consegui responder agora.');
      appendAiMessage('assistant', json.reply);
      aiChatHistory.push({ role: 'assistant', content: json.reply });
      haptic(6);
    } catch (err) {
      removeAiTyping();
      const fallback = err.message || 'Sem conexão. Usa o fluxo Soltar ou o kit de emergência.';
      appendAiMessage('system', fallback);
    } finally {
      aiChatLoading = false;
      updateAiSendButton();
    }
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

    if (isInFirstWeek()) {
      const pd = WEEK_PROGRAM[getWeekProgramDay() - 1];
      if (pd) msgs.push(`Programa — dia ${pd.day}: ${pd.tip}`);
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
    renderWeekProgramCard();
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
    renderLearn();
    renderWeekProgram();
    renderEmergencyKit();
    updateLiberationVisual();
  }

  function getShareData() {
    const totalHours = getElapsedHours();
    const days = Math.floor(totalHours / 24);
    const hours = Math.floor(totalHours % 24);
    const elapsedDays = totalHours / 24;
    const pods = getPodsAvoided(elapsedDays);
    const nicotineMg = pods * data.nicotineMg;
    let timeLabel;
    if (days > 0) timeLabel = `${days} dia${days !== 1 ? 's' : ''} sem pod`;
    else if (hours > 0) timeLabel = `${hours} hora${hours !== 1 ? 's' : ''} sem pod`;
    else timeLabel = 'Começando agora';

    return {
      days,
      hours,
      timeLabel,
      money: formatMoney(pods * data.podCost),
      nicotine: formatNicotine(nicotineMg),
      pods: pods >= 10 ? String(Math.round(pods)) : pods.toFixed(1),
      cravings: data.cravingsResisted,
      nicotineMg,
    };
  }

  function buildShareCardHTML(d) {
    return `<div class="share-card-visual">
      <div class="share-card-brand">◈ NoPods</div>
      <div class="share-card-hero">
        <div class="share-card-days">${d.timeLabel}</div>
        <div class="share-card-sub">Livre de nicotina salina</div>
      </div>
      <div class="share-card-stats">
        <div class="share-card-stat"><span class="share-card-stat-value">${d.money}</span><span class="share-card-stat-label">economizados</span></div>
        <div class="share-card-stat"><span class="share-card-stat-value">${d.nicotine}</span><span class="share-card-stat-label">nicotina evitada</span></div>
        <div class="share-card-stat"><span class="share-card-stat-value">${d.pods}</span><span class="share-card-stat-label">pods evitados</span></div>
        <div class="share-card-stat"><span class="share-card-stat-value">${d.cravings}</span><span class="share-card-stat-label">fissuras soltas</span></div>
      </div>
      <div class="share-card-footer">nopods.vercel.app</div>
    </div>`;
  }

  function getShareText() {
    const d = getShareData();
    return `${d.timeLabel} 🫁\n💰 ${d.money} economizados\n🧪 ${d.nicotine} de nicotina evitada\n🔥 ${d.cravings} fissuras soltas\n\nnopods.vercel.app`;
  }

  function drawShareCanvas() {
    const canvas = $('#share-canvas');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const d = getShareData();
    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f1419');
    grad.addColorStop(0.5, '#1a2332');
    grad.addColorStop(1, '#0d1f1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#5eead4';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('◈ NOPODS', 80, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 72px Georgia, serif';
    ctx.textAlign = 'center';
    const lines = d.timeLabel.split(' ');
    let y = 420;
    if (d.timeLabel.length > 18) {
      ctx.font = '500 56px Georgia, serif';
      y = 400;
    }
    ctx.fillText(d.timeLabel, w / 2, y);

    ctx.fillStyle = 'rgba(232, 240, 236, 0.65)';
    ctx.font = '32px system-ui, sans-serif';
    ctx.fillText('Livre de nicotina salina', w / 2, y + 56);

    const stats = [
      [d.money, 'economizados'],
      [d.nicotine, 'nicotina evitada'],
      [d.pods, 'pods evitados'],
      [`${d.cravings}`, 'fissuras soltas'],
    ];
    const boxW = 420;
    const boxH = 120;
    const gap = 24;
    const gridX = (w - boxW * 2 - gap) / 2;
    const gridY = 560;

    stats.forEach(([val, label], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = gridX + col * (boxW + gap);
      const yPos = gridY + row * (boxH + gap);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      roundRect(ctx, x, yPos, boxW, boxH, 20);
      ctx.fill();
      ctx.fillStyle = '#5eead4';
      ctx.font = 'bold 40px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val, x + boxW / 2, yPos + 52);
      ctx.fillStyle = 'rgba(232, 240, 236, 0.5)';
      ctx.font = '22px system-ui, sans-serif';
      ctx.fillText(label.toUpperCase(), x + boxW / 2, yPos + 88);
    });

    ctx.fillStyle = 'rgba(232, 240, 236, 0.35)';
    ctx.font = '26px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('nopods.vercel.app', w / 2, h - 80);

    return canvas;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function updateSharePreview() {
    const preview = $('#share-preview');
    if (!preview) return;
    preview.innerHTML = buildShareCardHTML(getShareData());
    drawShareCanvas();
  }

  function openShareModal() {
    updateSharePreview();
    openModal(shareModal);
    haptic(8);
  }

  function closeShareModal() {
    if (shareModal) closeModal(shareModal);
  }

  async function downloadShareImage() {
    const canvas = drawShareCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `nopods-${Math.floor(getElapsedHours() / 24)}dias.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Imagem salva');
    haptic(12);
  }

  async function copyShareText() {
    try {
      await navigator.clipboard.writeText(getShareText());
      showToast('Texto copiado');
      haptic(8);
    } catch {
      showToast('Não foi possível copiar');
    }
  }

  async function nativeShare() {
    const text = getShareText();
    const canvas = drawShareCanvas();
    if (navigator.share && canvas) {
      try {
        const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
        const file = new File([blob], 'nopods.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: 'NoPods', text, files: [file] });
          return;
        }
        await navigator.share({ title: 'NoPods', text });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }
    await copyShareText();
  }

  function formatTimerDisplay(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function cancelEmergencyTimer() {
    if (emergencyTimerInterval) clearInterval(emergencyTimerInterval);
    emergencyTimerInterval = null;
    $('#emergency-timer')?.classList.add('hidden');
  }

  function startEmergencyTimer(seconds) {
    cancelEmergencyTimer();
    const wrap = $('#emergency-timer');
    const display = $('#emergency-timer-value');
    if (!wrap || !display) return;
    let remaining = seconds;
    display.textContent = formatTimerDisplay(remaining);
    wrap.classList.remove('hidden');
    haptic(12);
    emergencyTimerInterval = setInterval(() => {
      remaining -= 1;
      display.textContent = formatTimerDisplay(remaining);
      if (remaining <= 0) {
        cancelEmergencyTimer();
        showToast('Passou! A fissura costuma aliviar agora.');
        haptic(20);
      }
    }, 1000);
  }

  function handleEmergencyAction(item) {
    haptic(10);
    if (item.action === 'step') {
      openCravingModalAt(item.step);
    } else if (item.action === 'full') {
      openCravingModalAt(0);
    } else if (item.action === 'timer') {
      startEmergencyTimer(item.seconds);
    } else if (item.action === 'ai') {
      openAiChatModal();
    } else if (item.action === 'tip') {
      showToast(item.desc);
    }
  }

  function renderEmergencyKit() {
    const container = $('#emergency-kit');
    if (!container) return;

    if (!container.dataset.rendered) {
      container.innerHTML = EMERGENCY_KIT.map((item, i) => `
        <button type="button" class="emergency-item" data-kit-idx="${i}">
          <span class="emergency-item-icon" aria-hidden="true">${item.icon}</span>
          <span class="emergency-item-title">${item.title}</span>
          <span class="emergency-item-desc">${item.desc}</span>
        </button>
      `).join('');
      container.dataset.rendered = '1';
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.emergency-item');
        if (!btn) return;
        const idx = parseInt(btn.dataset.kitIdx, 10);
        if (!Number.isNaN(idx) && EMERGENCY_KIT[idx]) handleEmergencyAction(EMERGENCY_KIT[idx]);
      });
    }
  }

  function renderStatsInsight() {
    const el = $('#stats-insight');
    if (!el || !data) return;
    const elapsedDays = getElapsedHours() / 24;
    const pods = getPodsAvoided(elapsedDays);
    const nicotineMg = pods * data.nicotineMg;
    if (nicotineMg < 1) {
      el.textContent = '';
      return;
    }
    const nic = formatNicotine(nicotineMg);
    const podLabel = pods >= 1 ? ` — equivalente a ${pods >= 10 ? Math.round(pods) : pods.toFixed(1)} pods` : '';
    el.textContent = `Seu corpo não recebeu ${nic} de nicotina salina desde que parou${podLabel}.`;
  }

  function getWeekProgramDay() {
    return Math.min(7, Math.floor(getElapsedHours() / 24) + 1);
  }

  function isInFirstWeek() {
    return getElapsedHours() < 168;
  }

  function isProgramDayRead(day) {
    return (data.weekProgramRead || []).includes(day);
  }

  function markProgramDayRead(day) {
    if (!data.weekProgramRead) data.weekProgramRead = [];
    if (!data.weekProgramRead.includes(day)) {
      data.weekProgramRead.push(day);
      saveData();
      checkAchievements();
      haptic(12);
      showToast(`Dia ${day} marcado como lido`);
    }
  }

  function renderWeekProgramProgress(el, currentDay) {
    if (!el) return;
    const day = Math.min(7, currentDay);
    el.innerHTML = WEEK_PROGRAM.map((d) => {
      let cls = 'week-program-progress-seg';
      if (d.day < day) cls += ' done';
      else if (d.day === day) cls += ' current';
      return `<div class="${cls}"></div>`;
    }).join('');
    el.setAttribute('aria-valuenow', day);
    el.setAttribute('aria-valuetext', `Dia ${day} de 7`);
  }

  function buildWeekDayActions(item) {
    let html = '<div class="week-day-actions">';
    if (item.action === 'soltar') {
      html += '<button type="button" class="btn btn-ghost week-day-action" data-action="soltar">Abrir Soltar</button>';
    } else if (item.action === 'kit') {
      html += '<button type="button" class="btn btn-ghost week-day-action" data-action="kit">Ver kit de emergência</button>';
    }
    if (isProgramDayRead(item.day)) {
      html += '<span class="week-day-mark">✓ Dia lido</span>';
    } else {
      html += `<button type="button" class="btn btn-primary week-day-action" data-action="read" data-day="${item.day}">Marcar como lido</button>`;
    }
    html += '</div>';
    return html;
  }

  function expandWeekDay(day) {
    const card = $(`.week-day-card[data-day="${day}"]`);
    if (!card) return;
    $$('.week-day-card').forEach((c) => {
      c.classList.remove('expanded');
      c.setAttribute('aria-expanded', 'false');
      const body = c.querySelector('.week-day-body');
      if (body) body.hidden = true;
    });
    card.classList.add('expanded');
    card.setAttribute('aria-expanded', 'true');
    const body = card.querySelector('.week-day-body');
    if (body) body.hidden = false;
    card.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  }

  function toggleWeekDay(card) {
    const expanded = card.getAttribute('aria-expanded') === 'true';
    const body = card.querySelector('.week-day-body');
    if (expanded) {
      card.classList.remove('expanded');
      card.setAttribute('aria-expanded', 'false');
      if (body) body.hidden = true;
    } else {
      expandWeekDay(parseInt(card.dataset.day, 10));
    }
    haptic(6);
  }

  function renderWeekProgram() {
    const container = $('#week-program-days');
    const badge = $('#week-program-badge');
    const progress = $('#week-program-progress');
    if (!container) return;

    const currentDay = getWeekProgramDay();
    if (badge) badge.textContent = isInFirstWeek() ? `Dia ${currentDay}/7` : 'Concluído';
    renderWeekProgramProgress(progress, isInFirstWeek() ? currentDay : 8);

    container.innerHTML = WEEK_PROGRAM.map((item) => {
      const read = isProgramDayRead(item.day);
      let cls = 'week-day-card';
      if (item.day === currentDay && isInFirstWeek()) cls += ' current';
      else if (item.day > currentDay && isInFirstWeek()) cls += ' upcoming';
      if (read) cls += ' read';
      const expanded = item.day === currentDay && isInFirstWeek();
      return `
        <button type="button" class="${cls}${expanded ? ' expanded' : ''}" role="listitem" data-day="${item.day}" aria-expanded="${expanded}">
          <div class="week-day-header">
            <span class="week-day-num">${item.day}</span>
            <div class="week-day-meta">
              <span class="week-day-focus">${item.focus}</span>
              <p class="week-day-title">${item.icon} ${item.title}</p>
              <p class="week-day-preview">${item.preview}</p>
            </div>
          </div>
          <div class="week-day-body" ${expanded ? '' : 'hidden'}>
            <p class="week-day-text">${item.body}</p>
            <div class="week-day-tip"><strong>Dica de hoje:</strong> ${item.tip}</div>
            ${buildWeekDayActions(item)}
          </div>
          <span class="week-day-chevron" aria-hidden="true">▼</span>
        </button>
      `;
    }).join('');

    if (!container.dataset.bound) {
      container.dataset.bound = '1';
      container.addEventListener('click', (e) => {
        const readBtn = e.target.closest('[data-action="read"]');
        if (readBtn) {
          e.stopPropagation();
          markProgramDayRead(parseInt(readBtn.dataset.day, 10));
          renderWeekProgram();
          renderWeekProgramCard();
          return;
        }
        const actionBtn = e.target.closest('.week-day-action');
        if (actionBtn) {
          e.stopPropagation();
          if (actionBtn.dataset.action === 'soltar') openCravingModal();
          if (actionBtn.dataset.action === 'kit') switchTab('cravings');
          if (actionBtn.dataset.action === 'ai') openAiChatModal();
          return;
        }
        const card = e.target.closest('.week-day-card');
        if (card) toggleWeekDay(card);
      });
    }
  }

  function renderWeekProgramCard() {
    const card = $('#week-program-card');
    if (!card) return;

    if (!isInFirstWeek()) {
      card.classList.add('hidden');
      return;
    }

    const day = getWeekProgramDay();
    const item = WEEK_PROGRAM[day - 1];
    if (!item) {
      card.classList.add('hidden');
      return;
    }

    card.classList.remove('hidden');
    $('#week-program-card-icon').textContent = item.icon;
    $('#week-program-card-title').textContent = `Dia ${day}: ${item.title}`;
    $('#week-program-card-desc').textContent = item.preview;
    renderWeekProgramProgress($('#week-program-card-progress'), day);
  }

  function renderLearn() {
    renderWeekProgram();
    const mythsList = $('#myths-list');
    const restartGuide = $('#restart-guide');
    if (!mythsList || !restartGuide) return;

    if (!mythsList.dataset.rendered) {
      mythsList.innerHTML = MYTHS_TRUTHS.map((item, i) => `
        <button type="button" class="myth-card" role="listitem" data-myth-idx="${i}" aria-expanded="false">
          <span class="myth-badge">Mito</span>
          <p class="myth-text">${item.myth}</p>
          <div class="myth-truth" hidden>
            <span class="truth-badge">Verdade</span>
            <p class="truth-text">${item.truth}</p>
          </div>
          <span class="myth-chevron" aria-hidden="true">▼</span>
        </button>
      `).join('');
      mythsList.dataset.rendered = '1';

      mythsList.addEventListener('click', (e) => {
        const card = e.target.closest('.myth-card');
        if (!card) return;
        const expanded = card.getAttribute('aria-expanded') === 'true';
        const truth = card.querySelector('.myth-truth');
        card.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        card.classList.toggle('expanded', !expanded);
        if (truth) truth.hidden = expanded;
        haptic(6);
      });
    }

    if (!restartGuide.dataset.rendered) {
      restartGuide.innerHTML = RESTART_GUIDE.map((item) => `
        <div class="restart-card glass">
          <span class="restart-icon" aria-hidden="true">${item.icon}</span>
          <div class="restart-body">
            <h3 class="restart-title">${item.title}</h3>
            <p class="restart-text">${item.body}</p>
          </div>
        </div>
      `).join('');
      restartGuide.dataset.rendered = '1';
    }
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
    renderStatsInsight();
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
