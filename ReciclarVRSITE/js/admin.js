/**
 * Cooperativa Recicla VR — Painel de Edição Visual Sem Programação (js/admin.js)
 * Construtor de Formulários Dinâmico e Recursivo para Autonomia da Cooperativa e UFF
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'reciclaVR_customContent';
  const AUTH_SESSION_KEY = 'reciclaVR_adminAuth';
  const ACCEPTED_USERS = new Set(['reciclavr.uff', 'admin']);
  const ACCEPTED_PASS = 'ReciclaVR@2026';
  const READONLY_KEYS = new Set(['id', 'icon', 'color', 'colorCode', 'shape', 'type', 'stepNumber', 'moduleNumber', 'number', 'step']);

  const FIELD_LABELS = {
    siteTitle: 'Título da Aba do Navegador (SEO)',
    shortName: 'Nome Curto da Cooperativa',
    officialName: 'Razão Social / Nome Oficial Completo',
    tagline: 'Frase de Impacto / Lema',
    city: 'Cidade',
    state: 'Estado (UF)',
    projectPartner: 'Parceiro Acadêmico / Institucional',
    lastUpdated: 'Ano da Última Atualização',
    navigationLinks: 'Itens do Menu de Navegação',
    editorConfig: 'Configurações Internas do Editor',
    badge: 'Selo / Destaque Superior',
    cooperativeName: 'Nome da Cooperativa em Destaque',
    officialSubtitle: 'Subtítulo Oficial',
    title: 'Título',
    sectionTitle: 'Título Principal da Seção',
    subtitle: 'Subtítulo',
    shortTitle: 'Título Curto (Aba)',
    introduction: 'Texto de Apresentação Inicial',
    intro: 'Texto de Introdução',
    description: 'Descrição / Texto Explicativo',
    summary: 'Resumo',
    paragraphs: 'Parágrafos de Texto',
    mission: 'Nossa Missão',
    vision: 'Nossa Visão de Futuro',
    valuesTitle: 'Título dos Valores',
    values: 'Lista de Valores do Cooperativismo',
    highlights: 'Destaques Principais',
    ctas: 'Botões de Ação (Chamadas)',
    primary: 'Botão Principal',
    secondary: 'Botão Secundário',
    tertiary: 'Terceiro Botão',
    label: 'Texto do Botão / Rótulo',
    href: 'Link de Destino (URL ou #secao)',
    timelineTitle: 'Título da Linha do Tempo',
    timeline: 'Marcos da Linha do Tempo',
    year: 'Ano / Período',
    historicalBlogCallout: 'Destaque do Blog Histórico de 2015',
    buttonLabel: 'Texto do Botão',
    url: 'Endereço do Link (URL)',
    steps: 'Etapas / Passo a Passo',
    details: 'Detalhes da Etapa',
    closingNote: 'Nota de Encerramento',
    theoreticalFoundation: 'Fundamentação de Economia Solidária e Autogestão',
    quote: 'Citação em Destaque',
    authorReference: 'Referência / Fonte da Citação',
    explanation: 'Explicação',
    pillars: 'Pilares da Autogestão',
    assemblyProcess: 'Funcionamento das Assembleias',
    points: 'Pontos Principais',
    header: 'Cabeçalho da Página',
    academicCredit: 'Sobre este Guia Prático',
    audioHelperText: 'Dica de Leitura em Voz Alta',
    modules: 'Módulos do Curso Prático (1 a 4)',
    academicSource: 'Tema do Módulo',
    threeInstruments: 'Os 3 Instrumentos de Conversa e Escuta',
    goldenRulesTitle: 'Título das Regras de Ouro',
    goldenRules: 'Lista de Regras de Ouro',
    interactiveChecklist: 'Checklist Interativo [ X ] do Galpão',
    items: 'Lista de Itens',
    practiceQuiz: 'Desafio Rápido (Pergunta de Fixação)',
    question: 'Pergunta',
    options: 'Opções de Resposta',
    correctIndex: 'Índice da Resposta Correta (0 = 1ª opção, 1 = 2ª opção, 2 = 3ª opção)',
    processConcept: 'Conceito de Processo no Galpão',
    stages: 'Etapas do Processo',
    kitchenMetaphor: 'Preparação e Divisão de Equipes (Brigada)',
    miseEnPlaceTitle: 'Título do 1º Segredo (Preparação)',
    miseEnPlaceDescription: 'Explicação da Preparação',
    teamsTitle: 'Título da Divisão de Equipes',
    teamsDescription: 'Explicação das Equipes',
    teams: 'Equipes de Trabalho do Galpão',
    name: 'Nome',
    role: 'Função / Responsabilidade',
    internalChain: 'Corrente Solidária de Trabalho',
    chainSteps: 'Passos da Corrente de Trabalho',
    whyLayoutMatters: 'Por que o Espaço Físico (Layout) Importa',
    warningSignsTitle: 'Título dos Sinais de Alerta',
    warningSigns: 'Lista de Sinais de Alerta',
    idealFlowSteps: 'Ordem Ideal do Caminho no Galpão',
    flowchartExplanation: 'Explicação do Fluxograma',
    symbols: 'Símbolos Geométricos do Fluxograma',
    rule: 'Regra de Uso',
    visualFlowchartTitle: 'Título do Fluxograma Visual',
    visualFlowchartSubtitle: 'Subtítulo do Fluxograma Visual',
    visualFlowchart: 'Passos do Fluxograma Visual',
    yesBranch: 'Caminho do SIM',
    noBranch: 'Caminho do NÃO',
    formsGuide: 'Guia de Fichas Simples de Controle',
    tips: 'Dicas Práticas',
    dryVsWetComparison: 'Comparativo: Resíduos Secos vs. Úmidos/Rejeitos',
    dryTitle: 'Título dos Recicláveis Secos',
    dryDescription: 'Explicação dos Recicláveis Secos',
    dryExamples: 'Exemplos de Recicláveis Secos (Aceitos)',
    wetTitle: 'Título dos Orgânicos e Rejeitos',
    wetDescription: 'Explicação dos Orgânicos e Rejeitos',
    wetExamples: 'Exemplos que NÃO vão para a Cooperativa',
    categories: 'Categorias de Materiais por Cor',
    colorLabel: 'Cor da Coleta Seletiva',
    canRecycleTitle: 'Título: O que PODE Reciclar',
    canRecycle: 'Lista do que PODE Reciclar',
    cannotRecycleTitle: 'Título: O que NÃO Pode Reciclar',
    cannotRecycle: 'Lista do que NÃO Pode Reciclar',
    preparationTip: 'Dica de Preparação e Limpeza',
    specialSafetyNotice: 'Alerta Especial de Segurança (Vidros e Cortantes)',
    modalities: 'Modalidades de Entrega de Materiais',
    actionLabel: 'Texto de Ação / Orientação',
    checklistTitle: 'Título do Checklist antes de Entregar',
    checklistItems: 'Itens do Checklist',
    metrics: 'Indicadores em Números',
    value: 'Valor / Número em Destaque',
    socialImpacts: 'Impactos Sociais e de Renda',
    environmentalImpacts: 'Impactos Ambientais Positivos',
    partnerTypes: 'Perfis de Parceiros (Moradores, Empresas, Escolas, UFF)',
    audience: 'Público-Alvo',
    benefits: 'Benefícios e Como Participar',
    ctaLabel: 'Texto do Botão de Parceria',
    uffHighlight: 'Destaque Especial da Parceria UFF',
    ctaBox: 'Caixa de Chamada para Contato',
    primaryButtonLabel: 'Texto do Botão Principal',
    secondaryButtonLabel: 'Texto do Botão Secundário',
    answer: 'Resposta',
    category: 'Categoria da Pergunta',
    address: 'Endereço do Galpão',
    street: 'Rua e Número',
    complement: 'Complemento (Galpão)',
    neighborhood: 'Bairro',
    zipCode: 'CEP',
    fullAddress: 'Endereço Completo Exibido no Site',
    reference: 'Ponto de Referência',
    googleMapsUrl: 'Link Direto do Google Maps',
    googleMapsEmbedQuery: 'Busca do Mapa Incorporado',
    openingHours: 'Horários de Funcionamento',
    weekdays: 'Segunda a Sexta-feira',
    saturday: 'Sábados',
    sunday: 'Domingos e Feriados',
    notes: 'Observações de Agendamento',
    contacts: 'Telefones, WhatsApp e E-mail',
    whatsappNumber: 'Número do WhatsApp (somente números com DDI 55 e DDD)',
    whatsappDisplay: 'WhatsApp Exibido na Tela',
    whatsappMessage: 'Mensagem Automática do WhatsApp',
    phoneDisplay: 'Telefone Exibido',
    email: 'E-mail Institucional',
    socialLinks: 'Links das Redes Sociais e Blog',
    instagramUrl: 'Link do Instagram (URL)',
    instagramHandle: 'Arroba do Instagram (@reciclavr)',
    facebookUrl: 'Link do Facebook (URL)',
    facebookName: 'Nome da Página no Facebook',
    blogUrl: 'Link do Blog Histórico de 2015',
    blogLabel: 'Nome Exibido do Blog',
    footer: 'Textos do Rodapé',
    copyright: 'Texto de Direitos Autorais',
    uffCredit: 'Crédito da Parceria com a UFF',
    socialTechNote: 'Nota de Tecnologia Social'
  };

  let currentData = {};
  let activeSectionKey = 'hero';
  let searchFilter = '';

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj || {}));
  }

  function translateKey(key) {
    if (FIELD_LABELS[key]) return FIELD_LABELS[key];
    return String(key)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase());
  }

  function showToast(msg) {
    const toast = document.getElementById('admin-toast');
    const toastMsg = document.getElementById('admin-toast-msg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(window.__adminToastTimer);
    window.__adminToastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }

  function updateStatusBadge(state) {
    const badge = document.getElementById('status-badge');
    if (!badge) return;
    if (state === 'unsaved') {
      badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shrink-0';
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span><span>Alterações não salvas</span>';
    } else if (state === 'preview') {
      badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shrink-0';
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-950"></span><span>Rascunho Salvo no Navegador</span>';
    } else {
      badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-coop-800 text-coop-100 border border-coop-600 shrink-0';
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>Conteúdo Oficial Carregado</span>';
    }
  }

  function getByPath(root, path) {
    return path.reduce((acc, k) => (acc !== undefined && acc !== null ? acc[k] : undefined), root);
  }

  function setByPath(root, path, value) {
    if (!path.length) return;
    const parent = path.slice(0, -1).reduce((acc, k) => acc[k], root);
    parent[path[path.length - 1]] = value;
  }

  function createBlankTemplate(sample) {
    if (typeof sample === 'string') return 'Novo texto...';
    if (typeof sample === 'number') return 0;
    if (Array.isArray(sample)) return sample.length ? [createBlankTemplate(sample[0])] : [];
    if (sample && typeof sample === 'object') {
      const copy = {};
      Object.keys(sample).forEach((k) => {
        if (READONLY_KEYS.has(k)) {
          copy[k] = sample[k];
        } else {
          copy[k] = createBlankTemplate(sample[k]);
        }
      });
      return copy;
    }
    return '';
  }

  function getSectionLabelsMap() {
    const fromMeta =
      currentData &&
      currentData.meta &&
      currentData.meta.editorConfig &&
      currentData.meta.editorConfig.sectionLabels;
    return Object.assign(
      {
        hero: 'Apresentação Principal (Topo)',
        quemSomos: 'Quem Somos, Missão, Visão e Valores',
        historia: 'Nossa História e Linha do Tempo',
        funcionamento: 'Funcionamento da Cooperativa',
        autogestao: 'Autogestão e Economia Solidária',
        cursoAutogestao: 'Curso Prático de Autogestão (UFF)',
        comoReciclar: 'Educação Ambiental: Como Reciclar',
        separacaoResiduos: 'Guia de Separação de Resíduos',
        entregaMateriais: 'Como Entregar Materiais',
        impactoSocialAmbiental: 'Impacto Social e Ambiental',
        parcerias: 'Área de Parcerias',
        faq: 'Perguntas Frequentes (FAQ)',
        contatoLocalizacao: 'Localização, Horários e Contatos',
        meta: 'Identidade e Menu do Site'
      },
      fromMeta || {}
    );
  }

  function renderSidebar() {
    const navList = document.getElementById('section-nav-list');
    if (!navList) return;

    const labelsMap = getSectionLabelsMap();
    const keys = Object.keys(currentData).filter((k) => labelsMap[k] || typeof currentData[k] === 'object');
    const term = searchFilter.trim().toLowerCase();

    navList.innerHTML = '';
    keys.forEach((key) => {
      const label = labelsMap[key] || translateKey(key);
      const sectionJsonStr = JSON.stringify(currentData[key] || '').toLowerCase();
      if (term && !label.toLowerCase().includes(term) && !sectionJsonStr.includes(term)) {
        return;
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      const isActive = key === activeSectionKey;
      btn.className = isActive
        ? 'w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-coop-700 text-white shadow-sm flex items-center justify-between transition'
        : 'w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-coop-50 hover:text-coop-900 flex items-center justify-between transition';
      btn.innerHTML = `<span>${label}</span><span class="text-[11px] opacity-70">➔</span>`;
      btn.addEventListener('click', () => {
        activeSectionKey = key;
        renderSidebar();
        renderActiveSectionForm();
      });
      navList.appendChild(btn);
    });
  }

  function buildFieldNode(value, path, keyName) {
    const labelText = translateKey(keyName);

    // 1. Primitivos (String / Number)
    if (typeof value === 'string' || typeof value === 'number') {
      const wrapper = document.createElement('div');
      wrapper.className = 'space-y-1.5';

      if (READONLY_KEYS.has(keyName)) {
        wrapper.innerHTML = `
          <div class="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-xs text-slate-600">
            <span class="font-bold">${labelText}:</span>
            <code class="font-mono text-slate-800">${String(value)}</code>
            <span class="text-[10px] text-slate-400">(Identificador fixo do sistema)</span>
          </div>
        `;
        return wrapper;
      }

      const labelEl = document.createElement('label');
      labelEl.className = 'block text-xs sm:text-sm font-bold text-slate-800';
      labelEl.textContent = labelText;
      wrapper.appendChild(labelEl);

      const isLongText = typeof value === 'string' && (value.length > 75 || value.includes('\n'));
      const inputEl = document.createElement(isLongText ? 'textarea' : 'input');
      if (!isLongText) {
        inputEl.type = typeof value === 'number' ? 'number' : 'text';
      } else {
        inputEl.rows = Math.min(6, Math.max(2, Math.ceil(value.length / 85)));
      }
      inputEl.value = value;
      inputEl.className =
        'w-full px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-coop-600 transition';

      inputEl.addEventListener('input', () => {
        const nextVal = typeof value === 'number' ? Number(inputEl.value) : inputEl.value;
        setByPath(currentData, path, nextVal);
        updateStatusBadge('unsaved');
      });

      wrapper.appendChild(inputEl);
      return wrapper;
    }

    // 2. Arrays (Listas reordenáveis com Adicionar/Remover)
    if (Array.isArray(value)) {
      const box = document.createElement('div');
      box.className = 'bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4';

      const header = document.createElement('div');
      header.className = 'flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5';
      header.innerHTML = `
        <h4 class="font-display font-extrabold text-sm sm:text-base text-coop-950">${labelText} (${value.length})</h4>
        <span class="text-xs text-slate-500">Você pode alterar, mudar a ordem ou adicionar itens</span>
      `;
      box.appendChild(header);

      const listContainer = document.createElement('div');
      listContainer.className = 'space-y-3';

      value.forEach((item, idx) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3';

        const itemSummary =
          (item && (item.title || item.name || item.question || item.step || item.label || item.year)) ||
          `Item #${idx + 1}`;

        const topBar = document.createElement('div');
        topBar.className = 'flex items-center justify-between gap-2 pb-2 border-b border-slate-100';
        topBar.innerHTML = `<span class="text-xs font-extrabold uppercase tracking-wider text-coop-800">${idx + 1}. ${String(itemSummary).slice(0, 55)}</span>`;

        const btnGroup = document.createElement('div');
        btnGroup.className = 'flex items-center gap-1.5';

        // Subir
        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.textContent = '⬆️ Subir';
        upBtn.disabled = idx === 0;
        upBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700';
        upBtn.addEventListener('click', () => {
          const arr = getByPath(currentData, path);
          const temp = arr[idx - 1];
          arr[idx - 1] = arr[idx];
          arr[idx] = temp;
          updateStatusBadge('unsaved');
          renderActiveSectionForm();
        });

        // Descer
        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.textContent = '⬇️ Descer';
        downBtn.disabled = idx === value.length - 1;
        downBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700';
        downBtn.addEventListener('click', () => {
          const arr = getByPath(currentData, path);
          const temp = arr[idx + 1];
          arr[idx + 1] = arr[idx];
          arr[idx] = temp;
          updateStatusBadge('unsaved');
          renderActiveSectionForm();
        });

        // Remover
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.textContent = '🗑️ Remover';
        delBtn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200';
        delBtn.addEventListener('click', () => {
          const arr = getByPath(currentData, path);
          arr.splice(idx, 1);
          updateStatusBadge('unsaved');
          renderActiveSectionForm();
        });

        btnGroup.appendChild(upBtn);
        btnGroup.appendChild(downBtn);
        btnGroup.appendChild(delBtn);
        topBar.appendChild(btnGroup);
        itemCard.appendChild(topBar);

        if (item && typeof item === 'object' && !Array.isArray(item)) {
          Object.keys(item).forEach((subKey) => {
            if (subKey === 'editorConfig') return;
            itemCard.appendChild(buildFieldNode(item[subKey], path.concat([idx, subKey]), subKey));
          });
        } else {
          itemCard.appendChild(buildFieldNode(item, path.concat([idx]), `Texto ${idx + 1}`));
        }

        listContainer.appendChild(itemCard);
      });

      box.appendChild(listContainer);

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className =
        'w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 text-coop-800 hover:bg-coop-50 font-extrabold text-xs sm:text-sm transition';
      addBtn.textContent = '+ Adicionar Novo Item';
      addBtn.addEventListener('click', () => {
        const arr = getByPath(currentData, path);
        const template = arr.length > 0 ? createBlankTemplate(arr[arr.length - 1]) : 'Novo item';
        arr.push(template);
        updateStatusBadge('unsaved');
        renderActiveSectionForm();
      });
      box.appendChild(addBtn);

      return box;
    }

    // 3. Objetos Aninhados
    if (value && typeof value === 'object') {
      const group = document.createElement('div');
      group.className = 'bg-slate-50/60 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4';

      if (keyName) {
        const groupTitle = document.createElement('h4');
        groupTitle.className = 'font-display font-extrabold text-base text-slate-900 border-b border-slate-200 pb-2';
        groupTitle.textContent = labelText;
        group.appendChild(groupTitle);
      }

      Object.keys(value).forEach((subKey) => {
        if (subKey === 'editorConfig') return;
        group.appendChild(buildFieldNode(value[subKey], path.concat([subKey]), subKey));
      });
      return group;
    }

    return document.createElement('div');
  }

  function renderActiveSectionForm() {
    const container = document.getElementById('editor-form-container');
    const titleEl = document.getElementById('current-section-title');
    const keyEl = document.getElementById('current-section-key');
    if (!container) return;

    const labelsMap = getSectionLabelsMap();
    if (titleEl) titleEl.textContent = labelsMap[activeSectionKey] || translateKey(activeSectionKey);
    if (keyEl) keyEl.textContent = `Seção: ${activeSectionKey}`;

    container.innerHTML = '';
    const sectionObj = currentData[activeSectionKey];
    if (!sectionObj || typeof sectionObj !== 'object') return;

    Object.keys(sectionObj).forEach((k) => {
      if (k === 'editorConfig') return;
      container.appendChild(buildFieldNode(sectionObj[k], [activeSectionKey, k], k));
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function downloadFile(filename, textContent, mimeType) {
    const blob = new Blob([textContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function setupAuthGate() {
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('login-form');
    const userInp = document.getElementById('login-username');
    const passInp = document.getElementById('login-password');
    const errorBox = document.getElementById('login-error');
    const togglePassBtn = document.getElementById('toggle-password-btn');
    const logoutBtn = document.getElementById('btn-logout');

    function syncAuthView() {
      const isAuth = sessionStorage.getItem(AUTH_SESSION_KEY) === 'authenticated';
      if (loginScreen && dashboard) {
        if (isAuth) {
          loginScreen.classList.add('hidden');
          dashboard.classList.remove('hidden');
        } else {
          loginScreen.classList.remove('hidden');
          dashboard.classList.add('hidden');
        }
      }
    }

    syncAuthView();

    if (togglePassBtn && passInp) {
      togglePassBtn.addEventListener('click', () => {
        passInp.type = passInp.type === 'password' ? 'text' : 'password';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = String((userInp && userInp.value) || '').trim().toLowerCase();
        const p = String((passInp && passInp.value) || '');

        if (ACCEPTED_USERS.has(u) && p === ACCEPTED_PASS) {
          sessionStorage.setItem(AUTH_SESSION_KEY, 'authenticated');
          if (errorBox) errorBox.classList.add('hidden');
          if (passInp) passInp.value = '';
          syncAuthView();
          showToast('Acesso autorizado! Bem-vindo(a) ao Painel de Edição Visual.');
        } else if (errorBox) {
          errorBox.classList.remove('hidden');
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(AUTH_SESSION_KEY);
        syncAuthView();
        showToast('Painel bloqueado com segurança.');
      });
    }
  }

  function initAdmin() {
    setupAuthGate();

    let loadedFromPreview = false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.meta && parsed.hero) {
          currentData = parsed;
          loadedFromPreview = true;
        }
      }
    } catch (_e) {
      // Usa padrão
    }

    if (!loadedFromPreview) {
      currentData = deepClone(window.DEFAULT_SITE_CONTENT || {});
    }

    updateStatusBadge(loadedFromPreview ? 'preview' : 'official');
    renderSidebar();
    renderActiveSectionForm();

    // Busca de seção
    const searchInput = document.getElementById('section-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchFilter = searchInput.value || '';
        renderSidebar();
      });
    }

    // 1. Salvar e Testar no Navegador (localStorage)
    const btnSave = document.getElementById('btn-save-preview');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
        updateStatusBadge('preview');
        showToast('Rascunho salvo no navegador! Clique em "Ver Site ao Vivo" para testar.');
      });
    }

    // 2. Baixar Atualização Oficial (siteContent.js + siteContent.json)
    const btnExport = document.getElementById('btn-export-js');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
        const jsonFormatted = JSON.stringify(currentData, null, 2);
        const jsContent =
          '/**\n * Cooperativa Recicla VR — Conteúdo Oficial Atualizado pelo Painel Visual\n */\nwindow.DEFAULT_SITE_CONTENT = ' +
          jsonFormatted +
          ';\n';

        downloadFile('siteContent.js', jsContent, 'application/javascript;charset=utf-8');
        setTimeout(() => {
          downloadFile('siteContent.json', jsonFormatted, 'application/json;charset=utf-8');
        }, 350);

        updateStatusBadge('preview');
        showToast('Arquivos siteContent.js e siteContent.json baixados! Coloque-os na pasta data/ do site.');
      });
    }

    // 3. Importar JSON
    const fileImport = document.getElementById('file-import-json');
    if (fileImport) {
      fileImport.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const parsed = JSON.parse(String(ev.target.result));
            if (parsed && typeof parsed === 'object' && parsed.hero) {
              currentData = parsed;
              localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
              updateStatusBadge('preview');
              renderSidebar();
              renderActiveSectionForm();
              showToast('Arquivo JSON importado e salvo com sucesso!');
            } else {
              alert('O arquivo JSON selecionado não parece ser do site da Cooperativa Recicla VR.');
            }
          } catch (_err) {
            alert('Erro ao ler o arquivo JSON. Verifique se o formato está válido.');
          }
        };
        reader.readAsText(file);
      });
    }

    // 4. Restaurar Original
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (window.confirm('Deseja descartar as edições feitas no navegador e restaurar o conteúdo original de fábrica?')) {
          localStorage.removeItem(STORAGE_KEY);
          currentData = deepClone(window.DEFAULT_SITE_CONTENT || {});
          updateStatusBadge('official');
          renderSidebar();
          renderActiveSectionForm();
          showToast('Conteúdo original restaurado com sucesso!');
        }
      });
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
  } else {
    initAdmin();
  }
})();
