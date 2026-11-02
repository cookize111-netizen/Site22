/**
 * Cooperativa Recicla VR — Escola de Autogestão (js/course.js)
 * Módulo independente para renderização interativa de content.cursoAutogestao
 * Projeto de Tecnologia Social e Economia Solidária — Cooperativa Recicla VR & UFF
 */
(function () {
  'use strict';

  window.currentUtterance = null;
  const CHECKLIST_STORAGE_KEY = 'reciclaVR_courseChecklists_v1';

  function safeHtml(val, fallback = '') {
    if (val === null || val === undefined) return fallback;
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toLucideName(name, fallback = 'check-circle-2') {
    if (!name || typeof name !== 'string') return fallback;
    return name
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
      .toLowerCase();
  }

  function loadChecklistState() {
    try {
      const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_e) {
      return {};
    }
  }

  function saveChecklistState(state) {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state));
    } catch (_e) {
      // Ignora erro de quota
    }
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    document.querySelectorAll('.btn-curso-audio').forEach((btn) => {
      btn.dataset.playing = 'false';
      btn.innerHTML = '🔊 Ouvir esta Aula em Voz Alta';
    });
    window.currentUtterance = null;
  }

  function buildModuleSpeechText(mod) {
    const parts = [];
    parts.push(`Módulo ${mod.moduleNumber}: ${mod.title}.`);
    if (mod.summary) parts.push(mod.summary);

    if (mod.threeInstruments) {
      parts.push(mod.threeInstruments.title);
      if (mod.threeInstruments.intro) parts.push(mod.threeInstruments.intro);
      (mod.threeInstruments.items || []).forEach((it) => {
        parts.push(`${it.name}. ${it.description}`);
      });
    }

    if (mod.processConcept) {
      parts.push(mod.processConcept.title);
      if (mod.processConcept.intro) parts.push(mod.processConcept.intro);
      (mod.processConcept.stages || []).forEach((st) => {
        parts.push(`${st.step}: ${st.description}`);
      });
    }

    if (mod.kitchenMetaphor) {
      parts.push(mod.kitchenMetaphor.title);
      parts.push(mod.kitchenMetaphor.miseEnPlaceTitle + '. ' + mod.kitchenMetaphor.miseEnPlaceDescription);
      parts.push(mod.kitchenMetaphor.teamsTitle + '. ' + mod.kitchenMetaphor.teamsDescription);
      (mod.kitchenMetaphor.teams || []).forEach((t) => {
        parts.push(`${t.name}: ${t.role}`);
      });
    }

    if (mod.whyLayoutMatters) {
      parts.push(mod.whyLayoutMatters.title);
      parts.push(mod.whyLayoutMatters.description);
      (mod.whyLayoutMatters.warningSigns || []).forEach((w) => parts.push(w));
    }

    if (mod.goldenRules && mod.goldenRules.length) {
      if (mod.goldenRulesTitle) parts.push(mod.goldenRulesTitle);
      mod.goldenRules.forEach((r) => {
        parts.push(`Regra ${r.number}: ${r.title}. ${r.description}`);
      });
    }

    if (mod.flowchartExplanation) {
      parts.push(mod.flowchartExplanation.title);
      parts.push(mod.flowchartExplanation.intro);
      (mod.flowchartExplanation.symbols || []).forEach((s) => {
        parts.push(`${s.name}: ${s.rule}`);
      });
    }

    if (mod.formsGuide) {
      parts.push(mod.formsGuide.title);
      parts.push(mod.formsGuide.intro);
      (mod.formsGuide.tips || []).forEach((t) => {
        parts.push(`${t.title}: ${t.description}`);
      });
    }

    if (mod.interactiveChecklist && mod.interactiveChecklist.items) {
      parts.push(mod.interactiveChecklist.title);
      mod.interactiveChecklist.items.forEach((item) => parts.push(item));
    }

    return parts.join(' ');
  }

  function renderVisualFlowchart(steps, title, subtitle) {
    if (!Array.isArray(steps) || !steps.length) return '';

    const nodesHtml = steps
      .map((step, index) => {
        const isLast = index === steps.length - 1;
        const arrowDown = !isLast
          ? `<div class="flex flex-col items-center my-2" aria-hidden="true">
               <div class="w-1 h-6 bg-purple-400"></div>
               <div class="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-purple-600"></div>
             </div>`
          : '';

        if (step.type === 'terminal') {
          return `
            <div class="flex flex-col items-center w-full">
              <div class="px-10 py-3.5 rounded-full bg-coop-900 text-white font-display font-extrabold text-base sm:text-lg tracking-wider shadow-sm text-center">
                ${safeHtml(step.label)}
              </div>
              ${step.description ? `<span class="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 text-center">${safeHtml(step.description)}</span>` : ''}
              ${arrowDown}
            </div>
          `;
        }

        if (step.type === 'decision') {
          return `
            <div class="flex flex-col items-center w-full my-1">
              <div class="relative flex flex-col items-center justify-center p-4">
                <div class="w-40 h-40 sm:w-44 sm:h-44 bg-amber-50 border border-slate-200 rotate-45 rounded-2xl shadow-sm flex items-center justify-center">
                  <div class="-rotate-45 text-center px-3">
                    <span class="block text-[11px] font-extrabold uppercase tracking-wider text-coop-800 mb-1">Decisão (?)</span>
                    <p class="font-display font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      ${safeHtml(step.label)}
                    </p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-2">
                <div class="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-sm">
                  <span class="px-2.5 py-1 rounded-lg bg-coop-700 text-white font-extrabold text-xs shrink-0">SIM</span>
                  <p class="text-xs sm:text-sm font-bold text-slate-800">${safeHtml(step.yesBranch)}</p>
                </div>
                <div class="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-sm">
                  <span class="px-2.5 py-1 rounded-lg bg-slate-700 text-white font-extrabold text-xs shrink-0">NÃO</span>
                  <p class="text-xs sm:text-sm font-bold text-slate-800">${safeHtml(step.noBranch)}</p>
                </div>
              </div>
              ${arrowDown}
            </div>
          `;
        }

        // Default: 'action' rectangle
        return `
          <div class="flex flex-col items-center w-full">
            <div class="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm text-center">
              <span class="inline-block text-[11px] font-extrabold uppercase tracking-wider text-coop-700 bg-coop-50 px-2.5 py-0.5 rounded-md mb-1">
                Etapa ${safeHtml(step.step)} • Ação (Retângulo)
              </span>
              <h5 class="font-display font-bold text-base sm:text-lg text-slate-900">
                ${safeHtml(step.label)}
              </h5>
              ${step.description ? `<p class="text-xs sm:text-sm text-slate-600 mt-1">${safeHtml(step.description)}</p>` : ''}
            </div>
            ${arrowDown}
          </div>
        `;
      })
      .join('');

    return `
      <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div class="text-center max-w-2xl mx-auto space-y-1.5">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-coop-50 text-coop-800">
            <i data-lucide="git-branch" class="w-3.5 h-3.5"></i>
            Desenho Geométrico Passo a Passo
          </span>
          <h4 class="font-display font-extrabold text-xl sm:text-2xl text-slate-900">${safeHtml(title)}</h4>
          <p class="text-sm text-slate-600">${safeHtml(subtitle)}</p>
        </div>
        <div class="flex flex-col items-center">
          ${nodesHtml}
        </div>
      </div>
    `;
  }

  function renderModuleBody(mod, checklistState) {
    const sections = [];

    // Módulo 1: 3 Instrumentos
    if (mod.threeInstruments) {
      const ti = mod.threeInstruments;
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div class="max-w-3xl">
            <h4 class="text-xl sm:text-2xl font-bold text-slate-900">${safeHtml(ti.title)}</h4>
            <p class="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">${safeHtml(ti.intro)}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${(ti.items || [])
              .map(
                (item) => `
              <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center">
                    <i data-lucide="${toLucideName(item.icon, 'message-circle')}" class="w-5 h-5"></i>
                  </div>
                  <h5 class="text-lg font-bold text-slate-900 mt-4 mb-2">${safeHtml(item.name)}</h5>
                  <p class="text-sm text-slate-600 leading-relaxed mb-4">${safeHtml(item.description)}</p>
                </div>
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-coop-700 bg-coop-50 px-3 py-1 rounded-full w-fit">
                  ${safeHtml(item.badge)}
                </span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `);
    }

    // Módulo 5: Onde a Prefeitura de Volta Redonda Divulga os Editais (whereToFind)
    if (mod.whereToFind) {
      const wf = mod.whereToFind;
      sections.push(`
        <div class="space-y-6">
          <div class="max-w-3xl">
            <h4 class="text-xl sm:text-2xl font-bold text-slate-900">${safeHtml(wf.title)}</h4>
            <p class="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">${safeHtml(wf.intro)}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${(wf.channels || [])
              .map(
                (ch) => `
              <div class="bg-white rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-5">
                <div class="space-y-3">
                  <span class="inline-flex items-center gap-1.5 text-xs font-bold text-coop-700 bg-coop-50 px-3 py-1 rounded-full w-fit">
                    ${safeHtml(ch.badge)}
                  </span>
                  <h5 class="text-lg font-bold text-slate-900 leading-snug">${safeHtml(ch.name)}</h5>
                  <p class="text-sm text-slate-600 leading-relaxed">${safeHtml(ch.description)}</p>
                </div>
                ${
                  ch.url && ch.buttonLabel
                    ? `
                  <a
                    href="${safeHtml(ch.url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 hover:bg-amber-300 text-coop-950 font-bold text-xs sm:text-sm px-5 py-3 shadow-sm transition w-full sm:w-fit"
                  >
                    <span>${safeHtml(ch.buttonLabel)}</span>
                    <i data-lucide="external-link" class="w-4 h-4"></i>
                  </a>
                `
                    : ''
                }
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `);
    }

    // Módulo 2: Conceito de Processo (Entrada -> Transformação -> Saída)
    if (mod.processConcept) {
      const pc = mod.processConcept;
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div class="max-w-3xl">
            <h4 class="text-xl sm:text-2xl font-bold text-slate-900">${safeHtml(pc.title)}</h4>
            <p class="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">${safeHtml(pc.intro)}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${(pc.stages || [])
              .map(
                (st) => `
              <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center">
                  <i data-lucide="${toLucideName(st.icon, 'layers')}" class="w-5 h-5"></i>
                </div>
                <h5 class="text-lg font-bold text-slate-900 mt-4 mb-2">${safeHtml(st.step)}</h5>
                <p class="text-sm text-slate-600 leading-relaxed">${safeHtml(st.description)}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `);
    }

    // Módulo 2: Metáfora da Cozinha (Mise en Place e Brigada) + Corrente Interna
    if (mod.kitchenMetaphor) {
      const km = mod.kitchenMetaphor;
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div class="max-w-3xl">
            <h4 class="text-xl sm:text-2xl font-bold text-slate-900">${safeHtml(km.title)}</h4>
            <p class="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">${safeHtml(km.intro)}</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-1.5">
            <h5 class="font-bold text-lg text-slate-900">${safeHtml(km.miseEnPlaceTitle)}</h5>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">${safeHtml(km.miseEnPlaceDescription)}</p>
          </div>
          <div class="space-y-3">
            <h5 class="font-bold text-lg text-slate-900">${safeHtml(km.teamsTitle)}</h5>
            <p class="text-sm text-slate-600">${safeHtml(km.teamsDescription)}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${(km.teams || [])
                .map(
                  (team) => `
                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h6 class="font-bold text-base text-coop-800 mb-1">${safeHtml(team.name)}</h6>
                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${safeHtml(team.role)}</p>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>
      `);
    }

    if (mod.internalChain) {
      const ic = mod.internalChain;
      sections.push(`
        <div class="bg-coop-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <h4 class="font-display font-extrabold text-xl">${safeHtml(ic.title)}</h4>
          <p class="text-coop-100 text-sm sm:text-base">${safeHtml(ic.description)}</p>
          <ul class="space-y-2.5">
            ${(ic.chainSteps || [])
              .map(
                (step) => `
              <li class="flex items-start gap-3 bg-white/10 rounded-xl p-3.5 text-sm sm:text-base font-medium">
                <span class="text-amber-300 font-extrabold">➔</span>
                <span>${safeHtml(step)}</span>
              </li>
            `
              )
              .join('')}
          </ul>
        </div>
      `);
    }

    // Módulo 3: Por que o Layout importa + Sinais de Alerta + Fluxo Ideal
    if (mod.whyLayoutMatters) {
      const wl = mod.whyLayoutMatters;
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h4 class="font-display font-extrabold text-xl sm:text-2xl text-slate-900">${safeHtml(wl.title)}</h4>
          <p class="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">${safeHtml(wl.description)}</p>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h5 class="font-display font-bold text-base text-slate-900">${safeHtml(wl.warningSignsTitle)}</h5>
            <ul class="space-y-2">
              ${(wl.warningSigns || [])
                .map(
                  (sign) => `
                <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <span class="text-amber-500 font-bold">⚠️</span>
                  <span>${safeHtml(sign)}</span>
                </li>
              `
                )
                .join('')}
            </ul>
          </div>
        </div>
      `);
    }

    // Regras de Ouro (Módulos 1 e 3)
    if (Array.isArray(mod.goldenRules) && mod.goldenRules.length) {
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h4 class="text-xl sm:text-2xl font-bold text-slate-900">${safeHtml(mod.goldenRulesTitle || 'Regras de Ouro')}</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            ${mod.goldenRules
              .map(
                (rule) => `
              <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-coop-50 text-coop-700 font-bold text-sm">0${safeHtml(rule.number)}</span>
                  <h5 class="text-lg font-bold text-slate-900 mt-3 mb-2">${safeHtml(rule.title)}</h5>
                  <p class="text-sm text-slate-600 leading-relaxed">${safeHtml(rule.description)}</p>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `);
    }

    if (Array.isArray(mod.idealFlowSteps) && mod.idealFlowSteps.length) {
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h4 class="font-display font-extrabold text-lg sm:text-xl text-slate-900">Caminho Ideal do Material no Galpão (Sem Cruzamentos):</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${mod.idealFlowSteps
              .map(
                (st) => `
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-display font-bold text-xs sm:text-sm text-slate-900">
                ${safeHtml(st)}
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `);
    }

    // Módulo 4: Explicação dos Símbolos + Fluxograma Geométrico + Guia de Fichas Coloridas [ X ]
    if (mod.flowchartExplanation) {
      const fe = mod.flowchartExplanation;
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div class="max-w-3xl">
            <h4 class="font-display font-extrabold text-xl sm:text-2xl text-slate-900">${safeHtml(fe.title)}</h4>
            <p class="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">${safeHtml(fe.intro)}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${(fe.symbols || [])
              .map(
                (sym) => `
              <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
                <h5 class="font-display font-bold text-base text-coop-900">${safeHtml(sym.name)}</h5>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${safeHtml(sym.rule)}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `);
    }

    if (mod.visualFlowchart) {
      sections.push(
        renderVisualFlowchart(
          mod.visualFlowchart,
          mod.visualFlowchartTitle || 'Fluxograma Visual',
          mod.visualFlowchartSubtitle || ''
        )
      );
    }

    if (mod.formsGuide) {
      const fg = mod.formsGuide;
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div class="max-w-3xl">
            <h4 class="font-display font-extrabold text-xl sm:text-2xl text-slate-900">${safeHtml(fg.title)}</h4>
            <p class="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">${safeHtml(fg.intro)}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${(fg.tips || [])
              .map(
                (tip) => `
              <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-1.5">
                <h5 class="font-display font-bold text-base text-slate-900">${safeHtml(tip.title)}</h5>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${safeHtml(tip.description)}</p>
              </div>
            `
              )
              .join('')}
          </div>
          <!-- Exemplo Visual das Fichas com [ X ] -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span class="inline-block text-xs font-extrabold uppercase text-coop-700 bg-coop-50 px-2.5 py-1 rounded-md">Ficha 01 • Recebimento</span>
              <p class="font-display font-bold text-sm text-slate-900 mt-2">Entrega de Moradores e Parceiros</p>
              <p class="text-xs mt-2 font-mono bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700">[ X ] Papelão &nbsp; [ &nbsp; ] PET</p>
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span class="inline-block text-xs font-extrabold uppercase text-coop-700 bg-coop-50 px-2.5 py-1 rounded-md">Ficha 02 • Produção</span>
              <p class="font-display font-bold text-sm text-slate-900 mt-2">Pesagem de Fardos Prontos (kg)</p>
              <p class="text-xs mt-2 font-mono bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700">[ X ] Prensado &nbsp; Peso: ___ kg</p>
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span class="inline-block text-xs font-extrabold uppercase text-coop-700 bg-coop-50 px-2.5 py-1 rounded-md">Ficha 03 • Assembleia</span>
              <p class="font-display font-bold text-sm text-slate-900 mt-2">Presença e Acordos Coletivos</p>
              <p class="text-xs mt-2 font-mono bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700">[ X ] Presente &nbsp; [ X ] Aprovado</p>
            </div>
          </div>
        </div>
      `);
    }

    // Checklist Interativo com [ X ] salvo no localStorage
    if (mod.interactiveChecklist && Array.isArray(mod.interactiveChecklist.items)) {
      const cl = mod.interactiveChecklist;
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div class="space-y-1">
            <span class="inline-block text-xs font-extrabold uppercase tracking-wider text-coop-700 bg-coop-50 px-3 py-1 rounded-full">
              Prática no Galpão • Marque com [ X ]
            </span>
            <h4 class="font-display font-extrabold text-xl sm:text-2xl text-slate-900 pt-1">${safeHtml(cl.title)}</h4>
            <p class="text-xs sm:text-sm text-slate-600">${safeHtml(cl.subtitle)}</p>
          </div>
          <div class="space-y-2.5">
            ${cl.items
              .map((itemText, idx) => {
                const key = `${mod.id}__item_${idx}`;
                const isChecked = Boolean(checklistState[key]);
                return `
                  <button
                    type="button"
                    data-course-check="${safeHtml(key)}"
                    aria-pressed="${isChecked ? 'true' : 'false'}"
                    class="w-full text-left flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 transition ${
                      isChecked
                        ? 'bg-coop-50 text-coop-950'
                        : 'bg-white hover:bg-slate-50 text-slate-700'
                    }"
                  >
                    <span
                      data-check-box
                      class="font-mono font-extrabold text-sm sm:text-base px-2.5 py-1 rounded-lg shrink-0 ${
                        isChecked ? 'bg-amber-400 text-coop-950' : 'bg-slate-100 text-slate-600'
                      }"
                    >
                      ${isChecked ? '[ X ]' : '[ &nbsp; ]'}
                    </span>
                    <span class="text-sm sm:text-base font-medium leading-snug pt-0.5">${safeHtml(itemText)}</span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>
      `);
    }

    // Quiz Interativo de Prática
    if (mod.practiceQuiz && Array.isArray(mod.practiceQuiz.options)) {
      const pz = mod.practiceQuiz;
      sections.push(`
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5" data-quiz-box="${safeHtml(mod.id)}">
          <div class="space-y-1">
            <p class="text-xs font-bold uppercase tracking-wider text-coop-700">
              Desafio Rápido da Aula ${safeHtml(mod.moduleNumber)}
            </p>
            <h4 class="text-xl sm:text-2xl font-bold text-slate-900">
              ${safeHtml(pz.question)}
            </h4>
          </div>
          <div class="space-y-2.5">
            ${pz.options
              .map(
                (opt, optIdx) => `
              <button
                type="button"
                data-quiz-option="${optIdx}"
                data-quiz-correct="${Number(pz.correctIndex)}"
                class="w-full text-left p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-coop-50 transition flex items-start gap-3 text-sm sm:text-base font-medium text-slate-800"
              >
                <span class="font-mono font-bold text-coop-700 shrink-0">(${String.fromCharCode(65 + optIdx)})</span>
                <span>${safeHtml(opt)}</span>
              </button>
            `
              )
              .join('')}
          </div>
          <div data-quiz-feedback class="hidden rounded-xl p-4 text-sm sm:text-base font-bold"></div>
          <input type="hidden" data-quiz-explanation value="${safeHtml(pz.explanation)}" />
        </div>
      `);
    }

    return sections.join('');
  }

  window.initCursoAutogestao = function (content) {
    const container = document.getElementById('curso-autogestao-container');
    if (!container) return;

    const curso = (content && content.cursoAutogestao) || {};
    const header = curso.header || {};
    const modules = Array.isArray(curso.modules) ? curso.modules : [];
    if (!modules.length) return;

    const checklistState = loadChecklistState();

    container.innerHTML = `
      <div class="space-y-8">
        <!-- 5 Abas Interativas dos Módulos (Barra de Abas Limpa) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" role="tablist" aria-label="Módulos do Curso de Autogestão">
          ${modules
            .map(
              (mod, idx) => `
            <button
              type="button"
              role="tab"
              aria-selected="${idx === 0 ? 'true' : 'false'}"
              data-course-tab="${safeHtml(mod.id)}"
              class="course-tab-btn text-left p-5 rounded-2xl border border-slate-200 transition flex flex-col justify-between gap-2 ${
                idx === 0
                  ? 'bg-coop-900 text-white shadow-sm font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm font-semibold'
              }"
            >
              <span class="text-xs uppercase tracking-wider ${idx === 0 ? 'text-amber-300' : 'text-coop-600'}">
                Aula 0${safeHtml(mod.moduleNumber)}
              </span>
              <span class="text-sm sm:text-base leading-snug">${safeHtml(mod.shortTitle || mod.title)}</span>
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Painéis dos 4 Módulos -->
        ${modules
          .map(
            (mod, idx) => `
          <div
            ${idx === 0 ? 'id="curso-module-content"' : ''}
            data-course-panel="${safeHtml(mod.id)}"
            class="${idx === 0 ? 'block' : 'hidden'} space-y-6"
          >
            <!-- Barra de Título do Módulo + Botão Ouvir em Voz Alta -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div class="space-y-1.5 max-w-3xl">
                <p class="text-xs font-bold uppercase tracking-wider text-coop-700">
                  Módulo ${safeHtml(mod.moduleNumber)} • ${safeHtml(mod.academicSource)}
                </p>
                <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 break-words">
                  ${safeHtml(mod.title)}
                </h3>
                <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
                  ${safeHtml(mod.summary)}
                </p>
              </div>
              <div class="shrink-0">
                <button
                  type="button"
                  data-speech-btn="${safeHtml(mod.id)}"
                  data-playing="false"
                  class="btn-curso-audio inline-flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-coop-950 font-bold text-sm sm:text-base px-6 py-3.5 rounded-full shadow-sm transition"
                >
                  🔊 Ouvir esta Aula em Voz Alta
                </button>
              </div>
            </div>

            ${renderModuleBody(mod, checklistState)}
          </div>
        `
          )
          .join('')}
      </div>
    `;

    // Eventos das Abas de Módulo
    const tabBtns = container.querySelectorAll('[data-course-tab]');
    const panels = container.querySelectorAll('[data-course-panel]');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        window.speechSynthesis.cancel();
        stopSpeech();
        const targetId = btn.getAttribute('data-course-tab');

        tabBtns.forEach((b) => {
          const active = b === btn;
          b.setAttribute('aria-selected', active ? 'true' : 'false');
          b.className = active
            ? 'course-tab-btn text-left p-5 rounded-2xl border border-slate-200 transition flex flex-col justify-between gap-2 bg-coop-900 text-white shadow-sm font-bold'
            : 'course-tab-btn text-left p-5 rounded-2xl border border-slate-200 transition flex flex-col justify-between gap-2 bg-white hover:bg-slate-50 text-slate-600 shadow-sm font-semibold';
        });

        panels.forEach((panel) => {
          if (panel.getAttribute('data-course-panel') === targetId) {
            panel.classList.remove('hidden');
            panel.classList.add('block');
            panel.id = 'curso-module-content';
          } else {
            panel.classList.remove('block');
            panel.classList.add('hidden');
            if (panel.id === 'curso-module-content') {
              panel.removeAttribute('id');
            }
          }
        });
      });
    });

    // Garante parada de áudio ao navegar para outra página
    window.addEventListener('hashchange', function () {
      window.speechSynthesis.cancel();
      stopSpeech();
    });

    // Eventos de Leitura em Voz Alta (Web Speech API pt-BR)
    const speechBtns = container.querySelectorAll('.btn-curso-audio');
    speechBtns.forEach((button) => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const isPlaying = this.dataset.playing === 'true';

        // 1. Always cancel any ongoing audio first
        window.speechSynthesis.cancel();

        // 2. Reset all audio buttons on the screen
        document.querySelectorAll('.btn-curso-audio').forEach((btn) => {
          btn.dataset.playing = 'false';
          btn.innerHTML = '🔊 Ouvir esta Aula em Voz Alta';
        });

        // 3. If it was playing, we just stopped it. Exit.
        if (isPlaying) return;

        // 4. Start new audio
        this.dataset.playing = 'true';
        this.innerHTML = '⏹️ Parar Áudio';

        // Grab the text content of the current module securely
        const moduleEl = document.querySelector('#curso-module-content') || this.closest('[data-course-panel]');
        const moduleText = moduleEl ? moduleEl.innerText : '';

        // Create utterance and store in GLOBAL variable to prevent Chrome GC bug
        window.currentUtterance = new SpeechSynthesisUtterance(moduleText);
        window.currentUtterance.lang = 'pt-BR';
        window.currentUtterance.rate = 1.0;

        window.currentUtterance.onend = () => {
          this.dataset.playing = 'false';
          this.innerHTML = '🔊 Ouvir esta Aula em Voz Alta';
        };

        window.currentUtterance.onerror = (err) => {
          console.error('Audio playback error:', err);
          this.dataset.playing = 'false';
          this.innerHTML = '🔊 Ouvir esta Aula em Voz Alta';
        };

        window.speechSynthesis.speak(window.currentUtterance);
      });
    });

    // Eventos dos Checklists [ X ] salvos no localStorage
    const checkBtns = container.querySelectorAll('[data-course-check]');
    checkBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const key = btn.getAttribute('data-course-check');
        const current = loadChecklistState();
        const nextVal = !current[key];
        current[key] = nextVal;
        saveChecklistState(current);

        btn.setAttribute('aria-pressed', nextVal ? 'true' : 'false');
        btn.className = `w-full text-left flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 transition ${
          nextVal
            ? 'bg-coop-50 text-coop-950'
            : 'bg-white hover:bg-slate-50 text-slate-700'
        }`;
        const box = btn.querySelector('[data-check-box]');
        if (box) {
          box.className = `font-mono font-extrabold text-sm sm:text-base px-2.5 py-1 rounded-lg shrink-0 ${
            nextVal ? 'bg-amber-400 text-coop-950' : 'bg-slate-100 text-slate-600'
          }`;
          box.innerHTML = nextVal ? '[ X ]' : '[ &nbsp; ]';
        }
      });
    });

    // Eventos do Quiz Interativo ao final de cada módulo
    const quizBoxes = container.querySelectorAll('[data-quiz-box]');
    quizBoxes.forEach((box) => {
      const optionBtns = box.querySelectorAll('[data-quiz-option]');
      const feedbackEl = box.querySelector('[data-quiz-feedback]');
      const explanationInput = box.querySelector('[data-quiz-explanation]');
      const explanation = explanationInput ? explanationInput.value : '';

      optionBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
          const chosen = Number(btn.getAttribute('data-quiz-option'));
          const correct = Number(btn.getAttribute('data-quiz-correct'));
          const isRight = chosen === correct;

          optionBtns.forEach((b) => {
            b.classList.remove(
              'bg-emerald-50',
              'bg-rose-50'
            );
          });

          if (isRight) {
            btn.classList.add('bg-emerald-50');
            if (feedbackEl) {
              feedbackEl.className =
                'rounded-xl p-4 text-sm sm:text-base font-bold bg-emerald-50 text-emerald-950 border border-slate-200 block';
              feedbackEl.textContent = '✅ ' + explanation;
            }
          } else {
            btn.classList.add('bg-rose-50');
            if (feedbackEl) {
              feedbackEl.className =
                'rounded-xl p-4 text-sm sm:text-base font-bold bg-amber-50 text-amber-950 border border-slate-200 block';
              feedbackEl.textContent =
                '💡 Quase lá! Tente outra opção que valorize o respeito, a segurança e a autogestão coletiva.';
            }
          }
        });
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };
})();
