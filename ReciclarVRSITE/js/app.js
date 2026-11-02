/**
 * Cooperativa Recicla VR — Arquitetura Multi-Page View & Renderização Dinâmica (js/app.js)
 * Projeto de Tecnologia Social em parceria com a UFF (Universidade Federal Fluminense)
 *
 * Estrutura em 6 Páginas de Categoria Fáceis de Navegar:
 * 1. `inicio`        -> Capa (Hero) + "O que você procura hoje?" + Indicadores Rápidos + Chamada Galpão
 * 2. `quem-somos`    -> Quem Somos (Missão, Visão, Valores) + Nossa História (Linha do Tempo 2002 + Blog 2015)
 * 3. `autogestao`    -> Como Funciona o Galpão (4 Etapas) + Autogestão e Economia Solidária + Impacto Socioambiental
 * 4. `como-reciclar` -> Regras de Ouro + Comparativo Seco/Úmido + Guia Interativo com Abas por Material + Segurança
 * 5. `parcerias`     -> Como Entregar Materiais + 4 Perfis de Parcerias + Destaque UFF Tecnologia Social
 * 6. `contato`       -> Perguntas Frequentes (FAQ com Filtros) + Endereço, Horários, Mapa e Redes Sociais
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'reciclaVR_customContent';

  /**
   * Definição das 6 Páginas Principais da Arquitetura Multi-Page View
   */
  const PAGES = [
    {
      id: 'inicio',
      label: 'Início',
      shortLabel: 'Início',
      icon: 'home',
      badge: 'Página Inicial',
      title: 'Cooperativa Recicla VR',
      subtitle: 'Escolha um tema abaixo para conhecer nosso trabalho, aprender a separar resíduos ou entregar materiais.'
    },
    {
      id: 'quem-somos',
      label: 'Quem Somos e História',
      shortLabel: 'Quem Somos',
      icon: 'users',
      badge: 'Identidade e Memória desde 2002',
      title: 'Quem Somos e Nossa História',
      subtitle: 'Conheça os Agentes do Meio Ambiente de Volta Redonda, nossos valores cooperativistas e mais de 20 anos de caminhada.'
    },
    {
      id: 'autogestao',
      label: 'Autogestão e Funcionamento',
      shortLabel: 'O Movimento',
      icon: 'vote',
      badge: 'Economia Solidária na Prática',
      title: 'Funcionamento, Autogestão e Impacto',
      subtitle: 'Descubra como nosso galpão opera diariamente, como tomamos decisões coletivas sem patrão e o impacto gerado na cidade.'
    },
    {
      id: 'curso-autogestao',
      label: 'Curso de Autogestão',
      shortLabel: 'Curso Prático',
      icon: 'graduation-cap',
      badge: 'Escola de Autogestão • Recicla VR & UFF',
      title: 'Curso Prático: Como Organizar Nossa Cooperativa',
      subtitle: 'Aprenda de jeito simples como fazer entrevistas, dividir equipes, arrumar o galpão e desenhar processos com apoio da UFF.'
    },
    {
      id: 'como-reciclar',
      label: 'Como Reciclar',
      shortLabel: 'Como Reciclar',
      icon: 'recycle',
      badge: 'Guia de Educação Ambiental',
      title: 'Como Reciclar e Separar Seus Resíduos',
      subtitle: 'Navegue pelas abas de materiais para saber o que pode e o que não pode reciclar e como proteger as mãos dos catadores.'
    },
    {
      id: 'parcerias',
      label: 'Entrega e Parcerias',
      shortLabel: 'Parcerias',
      icon: 'heart-handshake',
      badge: 'Ação Coletiva em Volta Redonda',
      title: 'Entrega de Materiais e Parcerias',
      subtitle: 'Veja como entregar seus recicláveis no Bairro Sessenta ou cadastrar seu condomínio, escola, empresa ou projeto universitário.'
    },
    {
      id: 'contato',
      label: 'Dúvidas e Contato',
      shortLabel: 'Contato',
      icon: 'map-pin',
      badge: 'Atendimento e Localização',
      title: 'Perguntas Frequentes e Localização',
      subtitle: 'Tire suas dúvidas sobre a reciclagem e confira o endereço do nosso galpão, horários, WhatsApp, mapa e redes sociais.'
    }
  ];

  /**
   * Mapa de roteamento inteligente: converte tanto IDs das 6 páginas quanto âncoras
   * legadas de seções (`#historia`, `#entrega-materiais`, `#funcionamento`, `#faq`, etc.)
   */
  const ROUTE_MAP = {
    'inicio': { pageId: 'inicio', scrollToId: null },
    'quem-somos': { pageId: 'quem-somos', scrollToId: null },
    'historia': { pageId: 'quem-somos', scrollToId: 'sub-historia' },
    'autogestao': { pageId: 'autogestao', scrollToId: null },
    'curso-autogestao': { pageId: 'curso-autogestao', scrollToId: null },
    'escola-autogestao': { pageId: 'curso-autogestao', scrollToId: null },
    'funcionamento': { pageId: 'autogestao', scrollToId: 'sub-funcionamento' },
    'impacto': { pageId: 'autogestao', scrollToId: 'sub-impacto' },
    'impacto-social-ambiental': { pageId: 'autogestao', scrollToId: 'sub-impacto' },
    'como-reciclar': { pageId: 'como-reciclar', scrollToId: null },
    'separacao-residuos': { pageId: 'como-reciclar', scrollToId: 'sub-separacao-residuos' },
    'parcerias': { pageId: 'parcerias', scrollToId: null },
    'entrega': { pageId: 'parcerias', scrollToId: 'sub-entrega-materiais' },
    'entrega-materiais': { pageId: 'parcerias', scrollToId: 'sub-entrega-materiais' },
    'contato': { pageId: 'contato', scrollToId: null },
    'contato-localizacao': { pageId: 'contato', scrollToId: 'sub-contato' },
    'faq': { pageId: 'contato', scrollToId: 'sub-faq' }
  };

  let currentPageId = 'inicio';

  /**
   * Garante que nenhum valor nulo/indefinido seja exibido como "undefined" na tela
   */
  function safeText(value, fallback = '') {
    if (value === null || value === undefined) return fallback;
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Converte nomes de ícones em PascalCase para kebab-case esperado pelo Lucide CDN
   */
  function toLucideIcon(iconName, fallback = 'check-circle-2') {
    if (!iconName || typeof iconName !== 'string') return fallback;
    return iconName
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
      .toLowerCase();
  }

  /**
   * Constrói link de WhatsApp dinâmico a partir dos dados de contato
   */
  function buildWhatsAppUrl(contacts, customMessage) {
    const rawNumber = (contacts && contacts.whatsappNumber) ? String(contacts.whatsappNumber).replace(/\D/g, '') : '5524999999999';
    const message = customMessage || (contacts && contacts.whatsappMessage) || 'Olá! Vim pelo site da Cooperativa Recicla VR.';
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Carrega os dados do site respeitando a hierarquia:
   * localStorage -> fetch('./data/siteContent.json') -> window.DEFAULT_SITE_CONTENT
   */
  async function loadSiteContent() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.meta && parsed.hero) {
          return { content: parsed, isCustomPreview: true };
        }
      }
    } catch (err) {
      console.warn('Aviso ao ler localStorage:', err);
    }

    try {
      const response = await fetch('./data/siteContent.json', { cache: 'no-store' });
      if (response.ok) {
        const jsonData = await response.json();
        return { content: jsonData, isCustomPreview: false };
      }
    } catch (_fetchErr) {
      // Esperado quando aberto diretamente via file:// no Windows Explorer
    }

    return {
      content: window.DEFAULT_SITE_CONTENT || {},
      isCustomPreview: false
    };
  }

  /**
   * Roteador Principal: Alterna entre as 6 páginas de categoria e rola suavemente
   */
  function navigateToPage(rawTarget, options = {}) {
    const cleanTarget = String(rawTarget || 'inicio').replace(/^#/, '').trim() || 'inicio';
    const route = ROUTE_MAP[cleanTarget] || { pageId: 'inicio', scrollToId: null };
    const targetPageId = route.pageId;
    const subScrollId = options.forceTop ? null : route.scrollToId;

    currentPageId = targetPageId;

    // 1. Mostra apenas a página ativa e oculta as outras 5
    const allViews = document.querySelectorAll('.page-view[data-page]');
    allViews.forEach((view) => {
      if (view.getAttribute('data-page') === targetPageId) {
        view.classList.remove('hidden');
        view.classList.add('block');
      } else {
        view.classList.remove('block');
        view.classList.add('hidden');
      }
    });

    // 2. Atualiza estado visual ativo nos menus Desktop e Mobile
    const navButtons = document.querySelectorAll('[data-page-tab]');
    navButtons.forEach((btn) => {
      const tabId = btn.getAttribute('data-page-tab');
      const isDesktop = btn.getAttribute('data-nav-variant') === 'desktop';
      const isActive = tabId === targetPageId;

      if (isDesktop) {
        if (isActive) {
          btn.className =
            'text-coop-700 font-bold bg-coop-50 rounded-lg px-3 py-2 text-sm transition whitespace-nowrap';
        } else {
          btn.className =
            'text-slate-600 hover:text-coop-700 hover:bg-slate-50 font-medium rounded-lg px-3 py-2 text-sm transition whitespace-nowrap';
        }
      } else {
        if (isActive) {
          btn.className =
            'mobile-nav-item flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-coop-700 text-white shadow-sm transition';
        } else {
          btn.className =
            'mobile-nav-item flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-coop-800 hover:bg-coop-50 border border-slate-200 transition';
        }
      }
    });

    // 3. Fecha o menu mobile se estiver aberto
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const iconOpen = document.getElementById('mobile-menu-icon-open');
    const iconClose = document.getElementById('mobile-menu-icon-close');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      if (iconOpen) iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    }

    // 4. Atualiza hash da URL sem recarregar
    if (!options.skipHashUpdate) {
      const hashToSet = `#${cleanTarget}`;
      if (window.location.hash !== hashToSet) {
        try {
          window.history.pushState(null, '', hashToSet);
        } catch (_e) {
          window.location.hash = hashToSet;
        }
      }
    }

    // 5. Rola para o topo da página ou para a subseção específica (ex: #historia ou #faq)
    if (subScrollId) {
      const subEl = document.getElementById(subScrollId);
      if (subEl) {
        setTimeout(() => {
          subEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 40);
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Expõe globalmente para uso direto se necessário
  window.navigateToPage = navigateToPage;

  /**
   * Renderiza cabeçalho institucional e as Abas de Categoria (Desktop e Mobile)
   */
  function renderNavigation(meta, contatoLocalizacao) {
    if (meta && meta.siteTitle) {
      document.title = meta.siteTitle;
    }

    const topbarOfficial = document.getElementById('topbar-official-name');
    if (topbarOfficial && meta && meta.officialName) {
      topbarOfficial.textContent = meta.officialName;
    }

    const topbarAddress = document.getElementById('topbar-address');
    if (topbarAddress && contatoLocalizacao && contatoLocalizacao.address) {
      topbarAddress.innerHTML = `
        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-300"></i>
        <span>${safeText(contatoLocalizacao.address.fullAddress)}</span>
      `;
    }

    const desktopNav = document.getElementById('desktop-nav-links');
    const mobileNav = document.getElementById('mobile-nav-links');

    if (desktopNav) {
      desktopNav.innerHTML = PAGES.map(
        (p) => `
          <a
            href="#${p.id}"
            data-nav-target="${p.id}"
            data-page-tab="${p.id}"
            data-nav-variant="desktop"
            title="${safeText(p.label)}"
            class="text-slate-600 hover:text-coop-700 hover:bg-slate-50 font-medium rounded-lg px-3 py-2 text-sm transition whitespace-nowrap"
          >
            ${safeText(p.shortLabel || p.label)}
          </a>
        `
      ).join('');
    }

    if (mobileNav) {
      mobileNav.innerHTML = PAGES.map(
        (p) => `
          <a
            href="#${p.id}"
            data-nav-target="${p.id}"
            data-page-tab="${p.id}"
            data-nav-variant="mobile"
            class="mobile-nav-item flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-coop-800 hover:bg-coop-50 border border-slate-200 transition"
          >
            <span class="inline-flex items-center gap-2.5">
              <i data-lucide="${p.icon}" class="w-4 h-4 text-coop-600"></i>
              <span>${safeText(p.label)}</span>
            </span>
            <i data-lucide="chevron-right" class="w-4 h-4 opacity-60"></i>
          </a>
        `
      ).join('');
    }
  }

  /**
   * Renderiza os Cabeçalhos Dedicados das Páginas Internas e as Barras "Próxima Página / Continue Navegando"
   */
  function renderPageHeadersAndFooters() {
    PAGES.forEach((page, idx) => {
      // Cabeçalho de página unificado em Azul Real Oficial (todas as páginas internas)
      if (page.id !== 'inicio') {
        const headerEl = document.getElementById(`header-${page.id}`);
        if (headerEl) {
          headerEl.innerHTML = `
            <div class="bg-[#2b3582] text-white py-12 sm:py-16 border-b border-white/10">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-wrap items-end justify-between gap-6">
                  <div class="max-w-3xl">
                    <p class="text-[#f8d96b] text-xs font-bold uppercase tracking-wider mb-2">
                      ${safeText(page.badge)}
                    </p>
                    <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2.5 break-words">
                      ${safeText(page.title)}
                    </h1>
                    <p class="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                      ${safeText(page.subtitle)}
                    </p>
                  </div>
                  <a
                    href="#inicio"
                    data-nav-target="inicio"
                    class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition shrink-0"
                  >
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    <span>Voltar ao Início</span>
                  </a>
                </div>
              </div>
            </div>
          `;
        }
      }

      // Barra de navegação inferior ("Continue Navegando / Próxima Página") padronizada
      const footerNavEl = document.querySelector(`[data-page-footer-nav="${page.id}"]`);
      if (footerNavEl) {
        const prevPage = idx > 0 ? PAGES[idx - 1] : null;
        const nextPage = idx < PAGES.length - 1 ? PAGES[idx + 1] : PAGES[0];

        footerNavEl.innerHTML = `
          <div class="bg-white border border-slate-200 hover:border-coop-300 rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div class="space-y-1 text-center sm:text-left">
              <p class="text-xs font-bold uppercase tracking-wider text-coop-700">Continue navegando pelo site</p>
              <h3 class="font-display font-bold text-lg sm:text-xl text-slate-900">
                Próxima página: ${safeText(nextPage.label)}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 max-w-xl">
                ${safeText(nextPage.subtitle)}
              </p>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-3 shrink-0">
              ${
                prevPage
                  ? `
                <a
                  href="#${prevPage.id}"
                  data-nav-target="${prevPage.id}"
                  class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-3 rounded-full transition"
                >
                  <i data-lucide="arrow-left" class="w-4 h-4"></i>
                  <span>${safeText(prevPage.shortLabel)}</span>
                </a>
              `
                  : ''
              }
              <a
                href="#${nextPage.id}"
                data-nav-target="${nextPage.id}"
                class="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-coop-950 font-bold text-sm px-6 py-3 rounded-full shadow-sm transition"
              >
                <span>Ir para ${safeText(nextPage.shortLabel || nextPage.label)}</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </a>
            </div>
          </div>
        `;
      }
    });
  }

  /**
   * PÁGINA 1 (INÍCIO): Hero + Grade "O que você procura hoje?" + Resumo de Impacto e Localização
   */
  function renderHomePage(content) {
    const hero = content.hero || {};
    const impacto = content.impactoSocialAmbiental || {};
    const contatoLocalizacao = content.contatoLocalizacao || {};

    // 1A. Hero
    const heroContainer = document.getElementById('hero-container');
    if (heroContainer) {
      const ctas = hero.ctas || {};
      const primaryCta = ctas.primary || { label: 'Como Entregar Materiais', href: '#entrega-materiais' };
      const secondaryCta = ctas.secondary || { label: 'Seja Parceiro', href: '#parcerias' };
      const highlights = Array.isArray(hero.highlights) ? hero.highlights : [];

      const ricoCards = highlights.slice(0, 3);

      heroContainer.innerHTML = `
        <div class="space-y-12">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <!-- Coluna Principal Editorial -->
            <div class="lg:col-span-7 space-y-6">
              <p class="text-amber-300 font-bold text-xs sm:text-sm uppercase tracking-wider">
                ${safeText(hero.cooperativeName)} • Volta Redonda - RJ
              </p>

              <h1 class="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.08] tracking-tight break-words">
                Cooperar ou descartar?
              </h1>

              <p class="text-white/95 font-light text-lg sm:text-2xl leading-snug max-w-2xl">
                ${safeText(hero.title)}
              </p>

              <div class="pt-3 flex flex-wrap items-center gap-4">
                <a
                  href="${safeText(primaryCta.href)}"
                  class="inline-flex items-center justify-center rounded-full bg-amber-400 hover:bg-amber-300 text-coop-950 font-bold text-sm sm:text-base px-7 py-3.5 shadow-sm transition"
                >
                  <span>${safeText(primaryCta.label)}</span>
                </a>

                <a
                  href="${safeText(secondaryCta.href)}"
                  class="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base px-7 py-3.5 transition"
                >
                  <span>${safeText(secondaryCta.label)}</span>
                </a>
              </div>
            </div>

            <!-- Coluna Direita: Manifesto Editorial -->
            <div class="lg:col-span-5 space-y-5 text-white">
              <div class="space-y-4 border-b border-white/25 pb-6">
                <p class="text-base sm:text-lg leading-relaxed text-white/95">
                  Vivemos em um mundo onde o descarte rápido parece o único caminho. Mas na <strong>Cooperativa Recicla VR</strong>, escolhemos cooperar.
                </p>
                <p class="text-sm sm:text-base leading-relaxed text-white/90">
                  ${safeText(hero.introduction)}
                </p>
                <p class="font-bold text-base sm:text-lg text-amber-300">
                  Cooperar é transformar resíduos em trabalho digno, autogestão e futuro para Volta Redonda.
                </p>
              </div>
              <div>
                <a
                  href="#historia"
                  data-nav-target="historia"
                  class="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 font-semibold text-base tracking-wide transition"
                >
                  <span>Conheça nossa história &gt;&gt;</span>
                </a>
              </div>
            </div>
          </div>

          <!-- 3 Cartões Horizontais na Base do Hero -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            ${ricoCards
              .map(
                (item) => `
                  <div class="rounded-2xl bg-[#2b3582]/85 backdrop-blur-sm p-6 text-white border border-white/10 flex flex-col justify-between space-y-4">
                    <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#f8d96b]">
                      <i data-lucide="${toLucideIcon(item.icon)}" class="w-5 h-5"></i>
                    </div>
                    <div class="space-y-1.5">
                      <h3 class="font-display font-bold text-lg text-white leading-snug">${safeText(item.title)}</h3>
                      <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">${safeText(item.description)}</p>
                    </div>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      `;
    }

    // 1B. Grade "O que você procura hoje?" (Cartões Padronizados de Navegação)
    const quickNavContainer = document.getElementById('home-quick-nav-container');
    if (quickNavContainer) {
      const quickCards = [
        {
          target: 'quem-somos',
          title: 'Conheça a Cooperativa',
          description: 'Quem somos, nossa Missão, Visão, Valores, trajetória desde 2002 em Volta Redonda e o acervo do Blog de 2015.',
          icon: 'users'
        },
        {
          target: 'autogestao',
          title: 'Autogestão e Funcionamento',
          description: 'As 4 etapas do nosso galpão (Recebimento, Triagem, Prensagem e Venda), Economia Solidária e Impacto Social.',
          icon: 'vote'
        },
        {
          target: 'curso-autogestao',
          title: 'Curso Prático de Autogestão',
          description: 'Módulos interativos com áudio em voz alta, entrevista de acolhimento, fluxograma do galpão e checklists.',
          icon: 'graduation-cap'
        },
        {
          target: 'como-reciclar',
          title: 'Guia Como Reciclar',
          description: 'Regras práticas e abas interativas por material (Papel, Plástico, Metal, Vidro e Itens Especiais) + cuidados com vidro quebrado.',
          icon: 'recycle'
        },
        {
          target: 'parcerias',
          title: 'Entregar Materiais e Parcerias',
          description: 'Como levar materiais ao galpão no Bairro Sessenta ou firmar parcerias com condomínios, empresas, escolas e UFF.',
          icon: 'heart-handshake'
        },
        {
          target: 'contato',
          title: 'Dúvidas (FAQ) e Localização',
          description: 'Respostas para as dúvidas mais comuns da comunidade, endereço na Rua 35 nº 650, mapa, horários e redes sociais.',
          icon: 'map-pin'
        }
      ];

      quickNavContainer.innerHTML = `
        <div class="mb-10">
          <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
            Navegação por objetivo
          </p>
          <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            O que você procura hoje?
          </h2>
          <p class="text-sm sm:text-base text-slate-600 max-w-2xl">
            Acesse rapidamente nossas áreas de educação ambiental, autogestão, entrega de materiais e parcerias.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${quickCards
            .map(
              (card) => `
                <a
                  href="#${card.target}"
                  data-nav-target="${card.target}"
                  class="group bg-white border border-slate-200 hover:border-coop-300 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center">
                      <i data-lucide="${card.icon}" class="w-5 h-5"></i>
                    </div>
                    <h3 class="font-display text-lg font-bold text-slate-900 mt-5 mb-2">
                      ${safeText(card.title)}
                    </h3>
                    <p class="text-sm text-slate-600 leading-relaxed mb-6">
                      ${safeText(card.description)}
                    </p>
                  </div>
                  <span class="inline-flex items-center gap-1.5 text-sm font-bold text-coop-700">
                    Acessar página
                    <i data-lucide="arrow-right" class="w-4 h-4 text-coop-600 transform group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </a>
              `
            )
            .join('')}
        </div>
      `;
    }

    // 1C. Seção Editorial "Conheça a diferença: Empresa vs. Cooperativa" + Indicadores
    const summaryContainer = document.getElementById('home-summary-container');
    if (summaryContainer) {
      const metrics = Array.isArray(impacto.metrics) ? impacto.metrics : [];
      const address = contatoLocalizacao.address || {};
      const hours = contatoLocalizacao.openingHours || {};
      const whatsappUrl = buildWhatsAppUrl(contatoLocalizacao.contacts);

      summaryContainer.innerHTML = `
        <div class="space-y-14">
          <!-- Conheça a diferença (Empresa vs. Cooperativa) -->
          <div>
            <div class="text-center max-w-2xl mx-auto mb-10">
              <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
                Trabalho Associado e Economia Solidária
              </p>
              <h2 class="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Conheça a diferença
              </h2>
            </div>
            <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Card 1: Empresa -->
              <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-5">
                  <i data-lucide="building-2" class="w-6 h-6"></i>
                </div>
                <h3 class="font-display text-xl font-bold text-slate-900 mb-4">Empresa Tradicional</h3>
                <ul class="space-y-2.5 text-sm sm:text-base text-slate-600">
                  <li class="flex items-start gap-2.5">
                    <span class="text-slate-400 font-bold">•</span>
                    <span>Gestão centralizada no patrão</span>
                  </li>
                  <li class="flex items-start gap-2.5">
                    <span class="text-slate-400 font-bold">•</span>
                    <span>Lucros concentrados</span>
                  </li>
                  <li class="flex items-start gap-2.5">
                    <span class="text-slate-400 font-bold">•</span>
                    <span>Trabalhador sem voz nas decisões</span>
                  </li>
                  <li class="flex items-start gap-2.5">
                    <span class="text-slate-400 font-bold">•</span>
                    <span>Foco apenas no lucro individual</span>
                  </li>
                </ul>
              </div>

              <!-- Card 2: Cooperativa -->
              <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div class="w-12 h-12 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center mb-5">
                  <i data-lucide="heart-handshake" class="w-6 h-6"></i>
                </div>
                <h3 class="font-display text-xl font-bold text-coop-900 mb-4">Cooperativa Recicla VR</h3>
                <ul class="space-y-2.5 text-sm sm:text-base text-slate-700">
                  <li class="flex items-start gap-2.5">
                    <i data-lucide="check-circle-2" class="w-5 h-5 text-coop-600 shrink-0 mt-0.5"></i>
                    <span>Autogestão: decisões em assembleia</span>
                  </li>
                  <li class="flex items-start gap-2.5">
                    <i data-lucide="check-circle-2" class="w-5 h-5 text-coop-600 shrink-0 mt-0.5"></i>
                    <span>Renda dividida entre quem trabalha</span>
                  </li>
                  <li class="flex items-start gap-2.5">
                    <i data-lucide="check-circle-2" class="w-5 h-5 text-coop-600 shrink-0 mt-0.5"></i>
                    <span>Alto impacto social e ambiental em Volta Redonda</span>
                  </li>
                  <li class="flex items-start gap-2.5">
                    <i data-lucide="check-circle-2" class="w-5 h-5 text-coop-600 shrink-0 mt-0.5"></i>
                    <span>Catadores envolvidos em todas as decisões</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Indicadores Rápidos -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            ${metrics
              .map(
                (metric) => `
                  <div class="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                    <div class="font-display font-extrabold text-3xl text-coop-800">
                      ${safeText(metric.value)}
                    </div>
                    <div class="font-display font-bold text-sm text-slate-900 mt-1.5 mb-1">
                      ${safeText(metric.label)}
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed">
                      ${safeText(metric.description)}
                    </p>
                  </div>
                `
              )
              .join('')}
          </div>

          <div class="bg-[#2b3582] text-white rounded-2xl p-7 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
            <div class="space-y-2 max-w-2xl text-center lg:text-left">
              <span class="text-xs font-bold uppercase tracking-wider text-[#f8d96b]">Galpão da Cooperativa Recicla VR</span>
              <h3 class="font-display font-bold text-2xl sm:text-3xl text-white">
                ${safeText(address.fullAddress)}
              </h3>
              <p class="text-slate-200 text-sm">
                ${safeText(hours.weekdays)} • ${safeText(address.complement)}
              </p>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="#contato"
                data-nav-target="contato"
                class="rounded-full bg-white text-[#1e265c] hover:bg-slate-100 font-bold text-sm px-6 py-3 transition"
              >
                Ver mapa e horários
              </a>
              <a
                href="${safeText(whatsappUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-full bg-[#f8d96b] hover:bg-[#f2ce4e] text-[#1e265c] font-bold text-sm px-6 py-3 transition shadow-sm"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * PÁGINA 2: Renderiza Quem Somos + Nossa História
   */
  function renderQuemSomos(quemSomos) {
    const container = document.getElementById('quem-somos-container');
    if (!container || !quemSomos) return;

    const introParagraphs = Array.isArray(quemSomos.introParagraphs) ? quemSomos.introParagraphs : [];
    const mission = quemSomos.mission || {};
    const vision = quemSomos.vision || {};
    const values = Array.isArray(quemSomos.values) ? quemSomos.values : [];

    container.innerHTML = `
      <div class="max-w-4xl mx-auto mb-12">
        <div class="mb-8">
          <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
            Agentes do Meio Ambiente
          </p>
          <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            ${safeText(quemSomos.sectionTitle)}
          </h2>
          <p class="mt-2 text-base sm:text-lg text-slate-600">
            ${safeText(quemSomos.subtitle)}
          </p>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 class="font-display font-bold text-lg sm:text-xl text-coop-900 flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center shrink-0">
              <i data-lucide="sprout" class="w-5 h-5"></i>
            </div>
            <span>Trabalho Coletivo pela Sustentabilidade de Volta Redonda</span>
          </h3>
          <div class="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            ${introParagraphs.map((p) => `<p>${safeText(p)}</p>`).join('')}
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-coop-50 flex items-center justify-center text-coop-700 shrink-0">
              <i data-lucide="target" class="w-5 h-5"></i>
            </div>
            <h3 class="font-display font-bold text-lg sm:text-xl text-slate-900">${safeText(mission.title)}</h3>
          </div>
          <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
            ${safeText(mission.description)}
          </p>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <i data-lucide="eye" class="w-5 h-5"></i>
            </div>
            <h3 class="font-display font-bold text-lg sm:text-xl text-slate-900">${safeText(vision.title)}</h3>
          </div>
          <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
            ${safeText(vision.description)}
          </p>
        </div>
      </div>

      <div>
        <div class="mb-8 text-center max-w-2xl mx-auto">
          <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
            Diretrizes do Nosso Galpão
          </p>
          <h3 class="font-display font-bold text-2xl sm:text-3xl text-slate-900">
            Nossos Valores e Princípios
          </h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${values
            .map(
              (val) => `
                <div class="bg-white border border-slate-200 hover:border-coop-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
                  <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center mb-4">
                    <i data-lucide="${toLucideIcon(val.icon)}" class="w-5 h-5"></i>
                  </div>
                  <h4 class="font-display font-bold text-lg text-slate-900 mb-2">${safeText(val.title)}</h4>
                  <p class="text-sm text-slate-600 leading-relaxed flex-1">${safeText(val.description)}</p>
                </div>
              `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  function renderHistoria(historia) {
    const container = document.getElementById('historia-container');
    if (!container || !historia) return;

    const narrativeParagraphs = Array.isArray(historia.narrativeParagraphs) ? historia.narrativeParagraphs : [];
    const timeline = Array.isArray(historia.timeline) ? historia.timeline : [];
    const blog = historia.blogArchiveCallout || {};

    container.innerHTML = `
      <div class="max-w-4xl mx-auto mb-12">
        <div class="mb-8">
          <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
            Trajetória desde 2002
          </p>
          <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            ${safeText(historia.sectionTitle)}
          </h2>
          <p class="mt-2 text-base sm:text-lg text-slate-600">
            ${safeText(historia.subtitle)}
          </p>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          ${narrativeParagraphs
            .map(
              (paragraph) => `
                <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
                  ${safeText(paragraph)}
                </p>
              `
            )
            .join('')}
        </div>
      </div>

      <div class="max-w-4xl mx-auto mb-12">
        <h3 class="font-display font-bold text-2xl text-slate-900 mb-4">
          Linha do Tempo da Cooperativa Recicla VR
        </h3>
        <div class="space-y-12 mt-12">
          ${timeline
            .map(
              (event) => `
                <div class="flex flex-col md:flex-row gap-4 md:gap-12 items-baseline">
                  <h4 class="text-3xl sm:text-4xl font-light text-[#f26522] md:w-1/4 shrink-0">${safeText(event.year)}</h4>
                  <div>
                    <h5 class="text-xl font-bold text-[#0b1536] mb-2">${safeText(event.title)}</h5>
                    <p class="text-slate-600 leading-relaxed text-lg">${safeText(event.description)}</p>
                  </div>
                </div>
              `
            )
            .join('')}
        </div>
      </div>

      ${
        blog.title
          ? `
        <div class="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-1.5 text-coop-700 font-bold text-xs uppercase tracking-wider">
              <i data-lucide="archive" class="w-4 h-4"></i>
              <span>Acervo Documental dos Catadores</span>
            </div>
            <h3 class="font-display font-bold text-xl sm:text-2xl text-slate-900">
              ${safeText(blog.title)}
            </h3>
            <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
              ${safeText(blog.description)}
            </p>
          </div>
          <a
            href="${safeText(blog.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-coop-950 font-bold px-6 py-3.5 rounded-full shadow-sm transition"
          >
            <i data-lucide="external-link" class="w-4 h-4"></i>
            <span>${safeText(blog.buttonLabel)}</span>
          </a>
        </div>
      `
          : ''
      }
    `;
  }

  /**
   * PÁGINA 3: Renderiza Funcionamento + Autogestão + Impacto Social e Ambiental
   */
  function renderFuncionamento(funcionamento) {
    const container = document.getElementById('funcionamento-container');
    if (!container || !funcionamento) return;

    const steps = Array.isArray(funcionamento.steps) ? funcionamento.steps : [];

    container.innerHTML = `
      <div class="max-w-3xl mb-10">
        <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
          Cadeia Produtiva da Reciclagem
        </p>
        <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          ${safeText(funcionamento.sectionTitle)}
        </h2>
        <p class="mt-2 text-base sm:text-lg text-slate-600">
          ${safeText(funcionamento.subtitle)}
        </p>
        <p class="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          ${safeText(funcionamento.intro)}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        ${steps
          .map((step) => {
            const details = Array.isArray(step.details) ? step.details : [];
            return `
              <div class="bg-white border border-slate-200 hover:border-coop-300 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md">
                <div>
                  <div class="flex items-center justify-between mb-5">
                    <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center">
                      <i data-lucide="${toLucideIcon(step.icon)}" class="w-5 h-5"></i>
                    </div>
                    <span class="font-display font-extrabold text-xl text-coop-600">
                      0${safeText(step.stepNumber)}
                    </span>
                  </div>
                  <h3 class="font-display font-bold text-lg text-slate-900 mb-2">
                    ${safeText(step.title)}
                  </h3>
                  <p class="text-sm text-slate-600 leading-relaxed mb-4">
                    ${safeText(step.description)}
                  </p>
                </div>

                <ul class="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  ${details
                    .map(
                      (detail) => `
                        <li class="flex items-start gap-2">
                          <i data-lucide="check" class="w-4 h-4 text-coop-600 shrink-0 mt-0.5"></i>
                          <span>${safeText(detail)}</span>
                        </li>
                      `
                    )
                    .join('')}
                </ul>
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
        <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center shrink-0">
          <i data-lucide="heart-handshake" class="w-5 h-5"></i>
        </div>
        <p class="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
          ${safeText(funcionamento.closingNote)}
        </p>
      </div>
    `;
  }

  function renderAutogestao(autogestao) {
    const container = document.getElementById('autogestao-container');
    if (!container || !autogestao) return;

    const theory = autogestao.theoreticalFoundation || {};
    const pillars = Array.isArray(autogestao.pillars) ? autogestao.pillars : [];
    const assembly = autogestao.assemblyProcess || {};
    const assemblyPoints = Array.isArray(assembly.points) ? assembly.points : [];

    container.innerHTML = `
      <div class="max-w-3xl mb-12">
        <p class="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
          Trabalho Associado e Democrático
        </p>
        <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-white">
          ${safeText(autogestao.sectionTitle)}
        </h2>
        <p class="mt-2 text-base sm:text-lg text-coop-100">
          ${safeText(autogestao.subtitle)}
        </p>
        <p class="mt-3 text-sm sm:text-base text-coop-200 leading-relaxed">
          ${safeText(autogestao.intro)}
        </p>
      </div>

      <div class="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 sm:p-8 mb-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-5 bg-white/10 border-l-4 border-amber-400 p-6 rounded-r-2xl space-y-3">
            <div class="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <i data-lucide="quote" class="w-4 h-4"></i>
              <span>Referência Teórica e Social</span>
            </div>
            <blockquote class="font-display font-semibold text-lg text-white italic leading-relaxed">
              "${safeText(theory.quote)}"
            </blockquote>
            <p class="text-xs text-coop-200 font-medium">
              — ${safeText(theory.authorReference)}
            </p>
          </div>

          <div class="lg:col-span-7 space-y-3">
            <h3 class="font-display font-bold text-xl sm:text-2xl text-white">
              ${safeText(theory.title)}
            </h3>
            <p class="text-coop-100 text-sm sm:text-base leading-relaxed">
              ${safeText(theory.explanation)}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        ${pillars
          .map(
            (pillar) => `
              <div class="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-6 transition">
                <div class="w-10 h-10 rounded-xl bg-amber-400 text-coop-950 flex items-center justify-center mb-4 shadow-sm">
                  <i data-lucide="${toLucideIcon(pillar.icon)}" class="w-5 h-5"></i>
                </div>
                <h4 class="font-display font-bold text-lg text-white mb-2">
                  ${safeText(pillar.title)}
                </h4>
                <p class="text-sm text-coop-100 leading-relaxed">
                  ${safeText(pillar.description)}
                </p>
              </div>
            `
          )
          .join('')}
      </div>

      <div class="bg-[#1e265c]/60 border border-white/15 rounded-2xl p-6 sm:p-8">
        <h3 class="font-display font-bold text-xl sm:text-2xl text-white mb-2 flex items-center gap-2.5">
          <i data-lucide="users" class="w-6 h-6 text-[#f8d96b]"></i>
          <span>${safeText(assembly.title)}</span>
        </h3>
        <p class="text-coop-200 text-sm sm:text-base mb-5">
          ${safeText(assembly.description)}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          ${assemblyPoints
            .map(
              (pt) => `
                <div class="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                  <i data-lucide="check-circle-2" class="w-5 h-5 text-amber-300 shrink-0 mt-0.5"></i>
                  <span class="text-sm text-white leading-relaxed">${safeText(pt)}</span>
                </div>
              `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  function renderImpacto(impacto) {
    const container = document.getElementById('impacto-container');
    if (!container || !impacto) return;

    const metrics = Array.isArray(impacto.metrics) ? impacto.metrics : [];
    const socialImpacts = Array.isArray(impacto.socialImpacts) ? impacto.socialImpacts : [];
    const environmentalImpacts = Array.isArray(impacto.environmentalImpacts) ? impacto.environmentalImpacts : [];

    container.innerHTML = `
      <div class="max-w-3xl mb-10">
        <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
          Transformação Socioambiental
        </p>
        <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          ${safeText(impacto.sectionTitle)}
        </h2>
        <p class="mt-2 text-base sm:text-lg text-slate-600">
          ${safeText(impacto.subtitle)}
        </p>
        <p class="mt-2 text-sm sm:text-base text-slate-600">
          ${safeText(impacto.intro)}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        ${metrics
          .map(
            (metric) => `
              <div class="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center mx-auto mb-3">
                  <i data-lucide="${toLucideIcon(metric.icon)}" class="w-5 h-5"></i>
                </div>
                <div class="font-display font-extrabold text-3xl text-coop-800">
                  ${safeText(metric.value)}
                </div>
                <div class="font-display font-bold text-sm text-slate-900 mt-1 mb-2">
                  ${safeText(metric.label)}
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">
                  ${safeText(metric.description)}
                </p>
              </div>
            `
          )
          .join('')}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <i data-lucide="users" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-display font-bold text-xl text-slate-900">Impacto Social e Renda Digna</h3>
              <p class="text-xs text-slate-500">Inclusão produtiva e cidadania para catadores e catadoras</p>
            </div>
          </div>
          <div class="space-y-3.5">
            ${socialImpacts
              .map(
                (item) => `
                  <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 class="font-display font-bold text-base text-slate-900 mb-1">
                      ${safeText(item.title)}
                    </h4>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      ${safeText(item.description)}
                    </p>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center">
              <i data-lucide="leaf" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-display font-bold text-xl text-slate-900">Impacto Ambiental Positivo</h3>
              <p class="text-xs text-slate-500">Preservação do Rio Paraíba do Sul e redução de aterros</p>
            </div>
          </div>
          <div class="space-y-3.5">
            ${environmentalImpacts
              .map(
                (item) => `
                  <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 class="font-display font-bold text-base text-slate-900 mb-1">
                      ${safeText(item.title)}
                    </h4>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      ${safeText(item.description)}
                    </p>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * PÁGINA 4: Renderiza Como Reciclar + Separação de Resíduos COM ABAS DE FILTRO INTERATIVAS
   */
  function renderComoReciclarESeparacao(comoReciclar, separacaoResiduos) {
    const container = document.getElementById('como-reciclar-container');
    if (!container) return;

    const cr = comoReciclar || {};
    const sr = separacaoResiduos || {};
    const goldenRules = Array.isArray(cr.goldenRules) ? cr.goldenRules : [];
    const comparison = cr.dryVsWetComparison || {};
    const dryExamples = Array.isArray(comparison.dryExamples) ? comparison.dryExamples : [];
    const wetExamples = Array.isArray(comparison.wetExamples) ? comparison.wetExamples : [];
    const categories = Array.isArray(sr.categories) ? sr.categories : [];
    const safety = sr.specialSafetyNotice || {};
    const safetyTips = Array.isArray(safety.tips) ? safety.tips : [];

    const categoryColorThemes = {
      blue: {
        badgeBg: 'bg-sky-50 text-sky-700',
        pillBg: 'bg-sky-100 text-sky-800',
        label: 'Coleta Seletiva • Azul'
      },
      red: {
        badgeBg: 'bg-rose-50 text-rose-700',
        pillBg: 'bg-rose-100 text-rose-800',
        label: 'Coleta Seletiva • Vermelho'
      },
      yellow: {
        badgeBg: 'bg-amber-50 text-amber-700',
        pillBg: 'bg-amber-100 text-amber-900',
        label: 'Coleta Seletiva • Amarelo'
      },
      green: {
        badgeBg: 'bg-emerald-50 text-emerald-700',
        pillBg: 'bg-emerald-100 text-emerald-800',
        label: 'Coleta Seletiva • Verde'
      },
      amber: {
        badgeBg: 'bg-orange-50 text-orange-700',
        pillBg: 'bg-orange-100 text-orange-800',
        label: 'Coleta Especial • Itens Especiais'
      }
    };

    container.innerHTML = `
      <!-- 4 Regras de Ouro -->
      <div class="mb-12">
        <div class="max-w-3xl mb-8">
          <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
            Passo a Passo Simples
          </p>
          <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            ${safeText(cr.sectionTitle)}
          </h2>
          <p class="mt-2 text-sm sm:text-base text-slate-600">
            ${safeText(cr.intro)}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${goldenRules
            .map(
              (rule) => `
                <div class="bg-white border border-slate-200 hover:border-coop-300 rounded-2xl p-6 shadow-sm transition-all duration-200">
                  <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center mb-4">
                    <i data-lucide="${toLucideIcon(rule.icon)}" class="w-5 h-5"></i>
                  </div>
                  <h3 class="font-display font-bold text-lg text-slate-900 mb-2">
                    ${safeText(rule.title)}
                  </h3>
                  <p class="text-sm text-slate-600 leading-relaxed">
                    ${safeText(rule.description)}
                  </p>
                </div>
              `
            )
            .join('')}
        </div>
      </div>

      <!-- Comparativo Resíduos Secos vs Orgânicos e Rejeitos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div class="bg-white rounded-3xl p-8 shadow-sm">
          <h3 class="font-display font-bold text-xl text-slate-900 mb-2">
            ${safeText(comparison.dryTitle)}
          </h3>
          <p class="text-sm text-slate-600 mb-5">${safeText(comparison.dryDescription)}</p>
          <ul>
            ${dryExamples
              .map(
                (item) => `
                  <li class="flex items-start gap-3 text-slate-600 mb-3">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#f26522] mt-2 shrink-0"></span>
                    <span>${safeText(item)}</span>
                  </li>
                `
              )
              .join('')}
          </ul>
        </div>

        <div class="bg-white rounded-3xl p-8 shadow-sm">
          <h3 class="font-display font-bold text-xl text-slate-900 mb-2">
            ${safeText(comparison.wetTitle)}
          </h3>
          <p class="text-sm text-slate-600 mb-5">${safeText(comparison.wetDescription)}</p>
          <ul>
            ${wetExamples
              .map(
                (item) => `
                  <li class="flex items-start gap-3 text-slate-600 mb-3">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#f26522] mt-2 shrink-0"></span>
                    <span>${safeText(item)}</span>
                  </li>
                `
              )
              .join('')}
          </ul>
        </div>
      </div>

      <!-- Guia Interativo de Separação por Categoria (COM ABAS DE FILTRO) -->
      <div id="sub-separacao-residuos" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm mb-12">
        <div class="max-w-3xl mb-7">
          <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
            Filtro Interativo por Tipo de Material
          </p>
          <h3 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            ${safeText(sr.sectionTitle)}
          </h3>
          <p class="mt-2 text-sm sm:text-base text-slate-600">
            Clique em um tipo de material abaixo para filtrar ou visualize todos de uma vez:
          </p>
        </div>

        <!-- Barra de Abas de Filtro de Materiais -->
        <div class="flex flex-wrap items-center gap-2.5 mb-8" role="tablist" aria-label="Filtrar categorias de materiais recicláveis">
          <button
            type="button"
            data-material-filter="all"
            class="material-filter-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition bg-[#2b3582] text-white border-[#2b3582] shadow-sm"
          >
            <i data-lucide="layout-grid" class="w-4 h-4"></i>
            <span>Todos os Materiais (${categories.length})</span>
          </button>
          ${categories
            .map(
              (cat) => `
                <button
                  type="button"
                  data-material-filter="${safeText(cat.id)}"
                  class="material-filter-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition bg-slate-50 hover:bg-coop-50 text-slate-700 border-slate-200"
                >
                  <i data-lucide="${toLucideIcon(cat.icon)}" class="w-4 h-4"></i>
                  <span>${safeText(cat.name)}</span>
                </button>
              `
            )
            .join('')}
        </div>

        <!-- Grade de Cartões Filtráveis Minimalistas -->
        <div id="material-cards-grid" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ${categories
            .map((cat) => {
              const canList = Array.isArray(cat.canRecycle) ? cat.canRecycle : [];
              const cannotList = Array.isArray(cat.cannotRecycle) ? cat.cannotRecycle : [];
              const tips = Array.isArray(cat.preparationTips) ? cat.preparationTips : [];

              return `
                <div
                  data-material-card="${safeText(cat.id)}"
                  class="material-category-card bg-white rounded-3xl p-8 shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div class="mb-5">
                      <i data-lucide="${toLucideIcon(cat.icon)}" class="w-10 h-10 text-[#f26522] mb-4"></i>
                      <h4 class="font-display font-bold text-xl text-slate-900 leading-tight mb-1.5">${safeText(cat.name)}</h4>
                      <p class="text-sm text-slate-600">${safeText(cat.description)}</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div class="bg-slate-50 rounded-2xl p-6">
                        <h5 class="font-display font-bold text-sm text-slate-900 mb-3">
                          O que pode reciclar
                        </h5>
                        <ul>
                          ${canList
                            .map(
                              (item) => `
                                <li class="flex items-start gap-3 text-slate-600 mb-3">
                                  <span class="w-1.5 h-1.5 rounded-full bg-[#f26522] mt-2 shrink-0"></span>
                                  <span>${safeText(item)}</span>
                                </li>
                              `
                            )
                            .join('')}
                        </ul>
                      </div>

                      <div class="bg-slate-50 rounded-2xl p-6">
                        <h5 class="font-display font-bold text-sm text-slate-900 mb-3">
                          O que NÃO pode reciclar
                        </h5>
                        <ul>
                          ${cannotList
                            .map(
                              (item) => `
                                <li class="flex items-start gap-3 text-slate-600 mb-3">
                                  <span class="w-1.5 h-1.5 rounded-full bg-[#f26522] mt-2 shrink-0"></span>
                                  <span>${safeText(item)}</span>
                                </li>
                              `
                            )
                            .join('')}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="bg-slate-50 rounded-2xl p-6">
                    <h5 class="font-display font-bold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                      <i data-lucide="lightbulb" class="w-4 h-4 text-[#f26522]"></i>
                      <span>Dicas de Higiene e Preparo</span>
                    </h5>
                    <ul>
                      ${tips
                        .map(
                          (tip) => `
                            <li class="flex items-start gap-3 text-slate-600 mb-2">
                              <span class="w-1.5 h-1.5 rounded-full bg-[#f26522] mt-2 shrink-0"></span>
                              <span>${safeText(tip)}</span>
                            </li>
                          `
                        )
                        .join('')}
                    </ul>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <!-- Alerta de Segurança (Vidro Quebrado e Perfurocortantes) -->
      ${
        safety.title
          ? `
        <div class="bg-white rounded-3xl p-8 shadow-sm">
          <div class="space-y-3">
            <p class="text-xs font-bold uppercase tracking-wider text-coop-700">
              Cuidado com quem trabalha na triagem
            </p>
            <h4 class="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
              ${safeText(safety.title)}
            </h4>
            <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
              ${safeText(safety.description)}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
              ${safetyTips
                .map(
                  (tip) => `
                    <div class="bg-slate-50 rounded-2xl p-6 text-slate-700 text-sm leading-relaxed flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-[#f26522] mt-1.5 shrink-0"></span>
                      <span>${safeText(tip)}</span>
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>
        </div>
      `
          : ''
      }
    `;
  }

  /**
   * PÁGINA 5: Renderiza Entrega de Materiais + Parcerias (4 Perfis + Destaque UFF)
   */
  function renderEntregaMateriais(entregaMateriais, contatoLocalizacao) {
    const container = document.getElementById('entrega-container');
    if (!container || !entregaMateriais) return;

    const modalities = Array.isArray(entregaMateriais.modalities) ? entregaMateriais.modalities : [];
    const mapsUrl =
      (contatoLocalizacao && contatoLocalizacao.address && contatoLocalizacao.address.googleMapsUrl) ||
      'https://www.google.com/maps/search/?api=1&query=Rua+35,+650+-+Sessenta,+Volta+Redonda+-+RJ';
    const whatsappUrl = buildWhatsAppUrl(contatoLocalizacao && contatoLocalizacao.contacts);

    container.innerHTML = `
      <div class="mb-10">
        <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
          Destinação correta em Volta Redonda
        </p>
        <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          ${safeText(entregaMateriais.sectionTitle)}
        </h2>
        <p class="text-sm sm:text-base text-slate-600 max-w-3xl">
          ${safeText(entregaMateriais.subtitle)}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        ${modalities
          .map((mod) => {
            const instructions = Array.isArray(mod.instructions) ? mod.instructions : [];
            const isMaps = mod.ctaType === 'maps';
            const actionHref = isMaps ? mapsUrl : whatsappUrl;
            const actionIcon = isMaps ? 'map-pin' : 'message-circle';

            return `
              <div class="bg-white border border-slate-200 hover:border-coop-300 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center">
                    <i data-lucide="${actionIcon}" class="w-5 h-5"></i>
                  </div>
                  <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mt-4">${safeText(mod.audience)}</p>
                  <h3 class="font-display text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2.5">
                    ${safeText(mod.title)}
                  </h3>
                  <p class="text-sm text-slate-600 leading-relaxed mb-5">
                    ${safeText(mod.description)}
                  </p>

                  <div class="space-y-2.5 mb-6">
                    ${instructions
                      .map(
                        (inst, i) => `
                          <div class="flex items-start gap-2.5 text-sm text-slate-700">
                            <span class="font-bold text-coop-600 shrink-0">${i + 1}.</span>
                            <span>${safeText(inst)}</span>
                          </div>
                        `
                      )
                      .join('')}
                  </div>
                </div>

                <a
                  href="${safeText(actionHref)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-coop-50 hover:bg-coop-100 text-coop-800 font-bold text-sm px-5 py-3 transition"
                >
                  <span>${safeText(mod.ctaLabel)}</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 text-coop-600"></i>
                </a>
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center shrink-0">
            <i data-lucide="info" class="w-5 h-5"></i>
          </div>
          <p class="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            ${safeText(entregaMateriais.acceptedVolumeInfo)}
          </p>
        </div>
      </div>
    `;
  }

  function renderParcerias(parcerias, contatoLocalizacao) {
    const container = document.getElementById('parcerias-container');
    if (!container || !parcerias) return;

    const partnerGroups = Array.isArray(parcerias.partnerGroups) ? parcerias.partnerGroups : [];
    const uff = parcerias.uffHighlight || {};
    const uffActions = Array.isArray(uff.actionsSummary) ? uff.actionsSummary : [];
    const contacts = contatoLocalizacao && contatoLocalizacao.contacts;

    container.innerHTML = `
      <div class="mb-10">
        <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
          Rede de cooperação
        </p>
        <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          ${safeText(parcerias.sectionTitle)}
        </h2>
        <p class="text-sm sm:text-base text-slate-600 max-w-3xl">
          ${safeText(parcerias.subtitle)}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        ${partnerGroups
          .map((group) => {
            const benefits = Array.isArray(group.benefits) ? group.benefits : [];
            const customMsg = `Olá! Vim pelo site da Cooperativa Recicla VR e gostaria de conversar sobre parceria para: ${group.title}.`;
            const waHref = buildWhatsAppUrl(contacts, customMsg);

            return `
              <div class="bg-white border border-slate-200 hover:border-coop-300 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div class="w-10 h-10 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center">
                    <i data-lucide="${toLucideIcon(group.icon)}" class="w-5 h-5"></i>
                  </div>
                  <h3 class="font-display text-xl font-bold text-slate-900 mt-5 mb-1">${safeText(group.title)}</h3>
                  <p class="text-xs font-bold text-coop-700 mb-3">${safeText(group.subtitle)}</p>

                  <p class="text-sm text-slate-600 leading-relaxed mb-5">
                    ${safeText(group.description)}
                  </p>

                  <ul class="space-y-2 text-xs sm:text-sm text-slate-700 mb-6">
                    ${benefits
                      .map(
                        (b) => `
                          <li class="flex items-start gap-2">
                            <span class="text-coop-600 font-bold">•</span>
                            <span>${safeText(b)}</span>
                          </li>
                        `
                      )
                      .join('')}
                  </ul>
                </div>

                <a
                  href="${safeText(waHref)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 hover:bg-amber-300 text-coop-950 font-bold text-sm px-6 py-3 shadow-sm transition"
                >
                  <span>${safeText(group.ctaLabel)}</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
              </div>
            `;
          })
          .join('')}
      </div>

      ${
        uff.title
          ? `
        <div class="bg-[#2b3582] text-white rounded-2xl p-6 sm:p-10 shadow-sm">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-3">
              <p class="text-[#f8d96b] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                <span>${safeText(uff.badge)}</span>
              </p>
              <h3 class="font-display font-extrabold text-2xl sm:text-3xl text-white">
                ${safeText(uff.title)}
              </h3>
              <p class="text-slate-200 text-sm sm:text-base leading-relaxed">
                ${safeText(uff.description)}
              </p>
            </div>

            <div class="lg:col-span-5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 sm:p-6 space-y-3">
              <h4 class="font-display font-bold text-base text-[#f8d96b] flex items-center gap-2">
                <i data-lucide="check-circle-2" class="w-5 h-5"></i>
                <span>Frentes do Plano de Ação UFF + Recicla VR</span>
              </h4>
              <ul class="space-y-2.5 text-xs sm:text-sm text-white">
                ${uffActions
                  .map(
                    (act) => `
                      <li class="flex items-start gap-2.5">
                        <i data-lucide="check" class="w-4 h-4 text-[#f8d96b] shrink-0 mt-0.5"></i>
                        <span>${safeText(act)}</span>
                      </li>
                    `
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        </div>
      `
          : ''
      }
    `;
  }

  /**
   * PÁGINA 6: Renderiza FAQ (com Pílulas de Filtro de Categoria + Accordion) + Contato e Localização
   */
  function renderFaq(faq) {
    const container = document.getElementById('faq-container');
    if (!container || !faq) return;

    const items = Array.isArray(faq.items) ? faq.items : [];
    const uniqueCategories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));

    container.innerHTML = `
      <div class="mb-10">
        <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
          Tire Suas Dúvidas
        </p>
        <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          ${safeText(faq.sectionTitle)}
        </h2>
        <p class="mt-2 text-base text-slate-600">
          ${safeText(faq.subtitle)}
        </p>
        <p class="mt-1 text-sm text-slate-600">
          ${safeText(faq.intro)}
        </p>
      </div>

      <!-- Pílulas de Filtro de Categoria do FAQ -->
      <div class="flex flex-wrap items-center gap-2 mb-8" role="tablist" aria-label="Filtrar perguntas frequentes por tema">
        <button
          type="button"
          data-faq-filter="all"
          class="faq-filter-btn px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition bg-coop-700 text-white border-coop-700 shadow-sm"
        >
          Todas as Dúvidas (${items.length})
        </button>
        ${uniqueCategories
          .map(
            (cat) => `
              <button
                type="button"
                data-faq-filter="${safeText(cat)}"
                class="faq-filter-btn px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition bg-white hover:bg-coop-50 text-slate-700 border-slate-200"
              >
                ${safeText(cat)}
              </button>
            `
          )
          .join('')}
      </div>

      <div class="space-y-3" id="faq-accordion-list">
        ${items
          .map((item, idx) => {
            const isFirst = idx === 0;
            return `
              <div
                data-faq-category="${safeText(item.category)}"
                class="faq-item bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition"
              >
                <button
                  type="button"
                  class="faq-toggle-btn w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 focus:outline-none"
                  aria-expanded="${isFirst ? 'true' : 'false'}"
                >
                  <div class="space-y-1">
                    <span class="inline-block text-[11px] font-bold uppercase tracking-wider text-coop-700 bg-coop-50 px-2.5 py-0.5 rounded-md">
                      ${safeText(item.category)}
                    </span>
                    <h3 class="font-display font-bold text-base sm:text-lg text-slate-900">
                      ${safeText(item.question)}
                    </h3>
                  </div>
                  <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isFirst ? 'rotate-180 bg-coop-100 text-coop-800' : ''
                  }" data-faq-chevron>
                    <i data-lucide="chevron-down" class="w-5 h-5"></i>
                  </div>
                </button>
                <div class="faq-answer px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 ${
                  isFirst ? '' : 'hidden'
                }">
                  ${safeText(item.answer)}
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }

  function renderContatoEFooter(contatoLocalizacao, meta) {
    const container = document.getElementById('contato-container');
    const footerContainer = document.getElementById('footer-container');
    if (!contatoLocalizacao) return;

    const address = contatoLocalizacao.address || {};
    const hours = contatoLocalizacao.openingHours || {};
    const contacts = contatoLocalizacao.contacts || {};
    const social = contatoLocalizacao.socialLinks || {};
    const footer = contatoLocalizacao.footer || {};
    const whatsappUrl = buildWhatsAppUrl(contacts);

    const floatingWa = document.getElementById('floating-whatsapp-btn');
    if (floatingWa) {
      floatingWa.href = whatsappUrl;
    }

    if (container) {
      container.innerHTML = `
        <div class="max-w-3xl mb-10">
          <p class="text-xs font-bold uppercase tracking-wider text-coop-700 mb-1.5">
            Bairro Sessenta • Volta Redonda - RJ
          </p>
          <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            ${safeText(contatoLocalizacao.sectionTitle)}
          </h2>
          <p class="mt-2 text-base text-slate-600">
            ${safeText(contatoLocalizacao.subtitle)}
          </p>
          <p class="mt-1 text-sm text-slate-600">
            ${safeText(contatoLocalizacao.intro)}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div class="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-11 h-11 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center shrink-0">
                  <i data-lucide="map-pin" class="w-5 h-5"></i>
                </div>
                <div>
                  <h3 class="font-display font-bold text-lg text-slate-900">Endereço do Galpão</h3>
                  <p class="text-slate-800 font-semibold text-base mt-0.5">${safeText(address.fullAddress)}</p>
                  <p class="text-xs sm:text-sm text-slate-600 mt-1">
                    ${safeText(address.complement)} • CEP: ${safeText(address.zipCode)}
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">${safeText(address.reference)}</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <i data-lucide="clock" class="w-5 h-5"></i>
                </div>
                <div>
                  <h3 class="font-display font-bold text-lg text-slate-900">Horário de Atendimento</h3>
                  <p class="text-sm text-slate-700 font-medium mt-0.5">${safeText(hours.weekdays)}</p>
                  <p class="text-xs sm:text-sm text-slate-600">${safeText(hours.saturday)}</p>
                  <p class="text-xs sm:text-sm text-slate-600">${safeText(hours.sunday)}</p>
                  <p class="text-xs text-slate-500 mt-1.5 italic">${safeText(hours.notes)}</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-11 h-11 rounded-xl bg-coop-50 text-coop-700 flex items-center justify-center shrink-0">
                  <i data-lucide="phone" class="w-5 h-5"></i>
                </div>
                <div class="space-y-1">
                  <h3 class="font-display font-bold text-lg text-slate-900">Canais de Atendimento</h3>
                  <p class="text-sm text-slate-700">
                    <strong>WhatsApp / Telefone:</strong> ${safeText(contacts.whatsappDisplay)}
                  </p>
                  <p class="text-sm text-slate-700">
                    <strong>E-mail:</strong>
                    <a href="mailto:${safeText(contacts.email)}" class="text-coop-700 hover:underline font-medium">
                      ${safeText(contacts.email)}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="${safeText(whatsappUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-coop-950 font-bold text-sm px-5 py-3.5 rounded-full shadow-sm transition"
              >
                <i data-lucide="message-circle" class="w-4 h-4"></i>
                <span>Chamar no WhatsApp</span>
              </a>
              <a
                href="${safeText(address.googleMapsUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 bg-coop-800 hover:bg-coop-900 text-white font-bold text-sm px-5 py-3.5 rounded-full shadow-sm transition"
              >
                <i data-lucide="navigation" class="w-4 h-4"></i>
                <span>Abrir no Google Maps</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-72 sm:h-80 relative">
              <iframe
                title="Mapa de Localização da Cooperativa Recicla VR - Rua 35, nº 650, Bairro Sessenta, Volta Redonda - RJ"
                src="https://www.google.com/maps?q=${encodeURIComponent(
                  address.googleMapsEmbedQuery || 'Rua 35, 650 - Sessenta, Volta Redonda - RJ'
                )}&output=embed"
                class="w-full h-full border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 class="font-display font-bold text-lg text-slate-900">
                Siga e Conheça as Redes da Cooperativa Recicla VR
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="${safeText(social.instagramUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2.5 bg-slate-50 hover:bg-coop-50 border border-slate-200 hover:border-coop-300 rounded-xl p-3.5 text-sm font-semibold text-slate-800 transition"
                >
                  <i data-lucide="instagram" class="w-5 h-5 text-coop-700 shrink-0"></i>
                  <span class="truncate">${safeText(social.instagramHandle || 'Instagram')}</span>
                </a>

                <a
                  href="${safeText(social.facebookUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2.5 bg-slate-50 hover:bg-coop-50 border border-slate-200 hover:border-coop-300 rounded-xl p-3.5 text-sm font-semibold text-slate-800 transition"
                >
                  <i data-lucide="facebook" class="w-5 h-5 text-coop-700 shrink-0"></i>
                  <span class="truncate">${safeText(social.facebookName || 'Facebook')}</span>
                </a>

                <a
                  href="${safeText(social.blogUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2.5 bg-slate-50 hover:bg-coop-50 border border-slate-200 hover:border-coop-300 rounded-xl p-3.5 text-sm font-semibold text-slate-800 transition"
                >
                  <i data-lucide="book-open" class="w-5 h-5 text-coop-700 shrink-0"></i>
                  <span class="truncate">Blog Histórico (2015)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (footerContainer) {
      footerContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          <div class="lg:col-span-5 space-y-3">
            <div class="flex items-center gap-3">
              <img
                src="./imagens/logo.jfif"
                alt="Logotipo Cooperativa Recicla VR"
                onerror="if(!this.dataset.triedJpg){this.dataset.triedJpg=1;this.src='./imagens/logo.jpg';}else{this.onerror=null;this.src='./assets/logo-recicla-vr.svg';}"
                class="w-12 h-12 rounded-xl object-cover bg-white shrink-0"
              />
              <span class="font-display font-extrabold text-xl text-white">
                ${safeText((meta && meta.shortName) || 'Cooperativa Recicla VR')}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-200 font-medium">
              ${safeText((meta && meta.officialName) || '')}
            </p>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ${safeText((meta && meta.tagline) || '')}
            </p>
            <p class="text-xs text-slate-300 pt-1">
              📍 ${safeText(address.fullAddress)}
            </p>
          </div>

          <div class="lg:col-span-4 space-y-3">
            <h3 class="font-display font-bold text-sm uppercase tracking-wider text-[#f8d96b]">
              Páginas do Site (Navegação Rápida)
            </h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-200">
              ${PAGES.map(
                (p) => `
                  <li>
                    <a href="#${p.id}" data-nav-target="${p.id}" class="inline-flex items-center gap-1.5 hover:text-white transition">
                      <i data-lucide="${p.icon}" class="w-3.5 h-3.5 text-slate-400"></i>
                      <span>${safeText(p.label)}</span>
                    </a>
                  </li>
                `
              ).join('')}
            </ul>
          </div>

          <div class="lg:col-span-3 space-y-3">
            <h3 class="font-display font-bold text-sm uppercase tracking-wider text-[#f8d96b]">
              Redes e Gestão
            </h3>
            <div class="flex flex-col gap-2 text-xs sm:text-sm">
              <a href="${safeText(social.instagramUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition">
                <i data-lucide="instagram" class="w-4 h-4 text-pink-400"></i>
                <span>Instagram (${safeText(social.instagramHandle)})</span>
              </a>
              <a href="${safeText(social.facebookUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition">
                <i data-lucide="facebook" class="w-4 h-4 text-sky-400"></i>
                <span>Facebook Oficial</span>
              </a>
              <a href="${safeText(social.blogUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-slate-200 hover:text-white transition">
                <i data-lucide="archive" class="w-4 h-4 text-[#f8d96b]"></i>
                <span>${safeText(social.blogLabel)}</span>
              </a>
            </div>

            <div class="pt-3">
              <a
                href="admin.html"
                class="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs font-medium transition opacity-80 hover:opacity-100"
                title="Acesso restrito com login e senha para atualização do site"
              >
                <span>🔒 Acesso Restrito (Equipe UFF)</span>
              </a>
            </div>
          </div>
        </div>

        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div class="space-y-1 text-center sm:text-left">
            <p>${safeText(footer.copyright)}</p>
            <p class="text-slate-400">${safeText(footer.uffCredit)}</p>
          </div>
          <div class="text-center sm:text-right text-slate-400 max-w-md">
            <p>${safeText(footer.socialTechNote)}</p>
          </div>
        </div>
      `;
    }
  }

  /**
   * Configura todos os eventos interativos:
   * - Roteamento de links `#...` para as 6 páginas
   * - Abas de filtro de materiais na Página 4 (`como-reciclar`)
   * - Pílulas de filtro e accordions de FAQ na Página 6 (`contato`)
   * - Menu Mobile e Banner de Pré-visualização
   */
  function setupInteractivity(isCustomPreview) {
    // 1. Banner de pré-visualização de alterações locais (localStorage)
    const banner = document.getElementById('custom-content-banner');
    const resetBtn = document.getElementById('reset-preview-btn');
    if (banner && isCustomPreview) {
      banner.classList.remove('hidden');
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (window.confirm('Deseja restaurar o conteúdo original do site e descartar o rascunho salvo neste navegador?')) {
          localStorage.removeItem(STORAGE_KEY);
          window.location.reload();
        }
      });
    }

    // 2. Menu Mobile (Hambúrguer)
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('mobile-menu-icon-open');
    const iconClose = document.getElementById('mobile-menu-icon-close');

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function () {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          mobileMenu.classList.add('hidden');
          menuBtn.setAttribute('aria-expanded', 'false');
          if (iconOpen) iconOpen.classList.remove('hidden');
          if (iconClose) iconClose.classList.add('hidden');
        } else {
          mobileMenu.classList.remove('hidden');
          menuBtn.setAttribute('aria-expanded', 'true');
          if (iconOpen) iconOpen.classList.add('hidden');
          if (iconClose) iconClose.classList.remove('hidden');
        }
      });
    }

    // 3. Interceptação Inteligente de Links Internos (`#...`) para o Roteador Multi-Page
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#conteudo-principal') return;

      const targetKey = link.getAttribute('data-nav-target') || href.replace(/^#/, '');
      if (ROUTE_MAP[targetKey]) {
        e.preventDefault();
        const isTopTab = link.hasAttribute('data-page-tab');
        navigateToPage(targetKey, { forceTop: isTopTab });
      }
    });

    // Suporte aos botões Voltar/Avançar do navegador (hashchange / popstate)
    window.addEventListener('hashchange', function () {
      const currentHash = window.location.hash.replace(/^#/, '') || 'inicio';
      if (ROUTE_MAP[currentHash]) {
        navigateToPage(currentHash, { skipHashUpdate: true });
      }
    });

    // 4. Abas de Filtro Interativas de Materiais Recicláveis (Página 4: `como-reciclar`)
    const materialFilterBtns = document.querySelectorAll('.material-filter-btn');
    const materialCards = document.querySelectorAll('.material-category-card');
    const materialGrid = document.getElementById('material-cards-grid');

    materialFilterBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const selectedId = btn.getAttribute('data-material-filter') || 'all';

        materialFilterBtns.forEach((b) => {
          const isCurrent = b === btn;
          if (isCurrent) {
            b.className =
              'material-filter-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition bg-coop-700 text-white border-coop-700 shadow-sm';
          } else {
            b.className =
              'material-filter-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition bg-slate-50 hover:bg-coop-50 text-slate-700 border-slate-200';
          }
        });

        if (materialGrid) {
          materialGrid.className =
            selectedId === 'all'
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-7'
              : 'grid grid-cols-1 max-w-4xl mx-auto gap-7';
        }

        materialCards.forEach((card) => {
          const cardId = card.getAttribute('data-material-card');
          if (selectedId === 'all' || cardId === selectedId) {
            card.classList.remove('hidden');
            card.classList.add('flex');
          } else {
            card.classList.remove('flex');
            card.classList.add('hidden');
          }
        });
      });
    });

    // 5. Pílulas de Filtro de Categoria do FAQ (Página 6: `contato`)
    const faqFilterBtns = document.querySelectorAll('.faq-filter-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    faqFilterBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const selectedCat = btn.getAttribute('data-faq-filter') || 'all';

        faqFilterBtns.forEach((b) => {
          if (b === btn) {
            b.className =
              'faq-filter-btn px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition bg-coop-700 text-white border-coop-700 shadow-sm';
          } else {
            b.className =
              'faq-filter-btn px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition bg-white hover:bg-coop-50 text-slate-700 border-slate-200';
          }
        });

        faqItems.forEach((item) => {
          const itemCat = item.getAttribute('data-faq-category');
          if (selectedCat === 'all' || itemCat === selectedCat) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });

    // 6. Accordions Interativos de Perguntas Frequentes (FAQ)
    const faqButtons = document.querySelectorAll('.faq-toggle-btn');
    faqButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const parentItem = btn.closest('.faq-item');
        if (!parentItem) return;
        const answerEl = parentItem.querySelector('.faq-answer');
        const chevronEl = parentItem.querySelector('[data-faq-chevron]');
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          btn.setAttribute('aria-expanded', 'false');
          if (answerEl) answerEl.classList.add('hidden');
          if (chevronEl) {
            chevronEl.classList.remove('rotate-180', 'bg-coop-100', 'text-coop-800');
          }
        } else {
          btn.setAttribute('aria-expanded', 'true');
          if (answerEl) answerEl.classList.remove('hidden');
          if (chevronEl) {
            chevronEl.classList.add('rotate-180', 'bg-coop-100', 'text-coop-800');
          }
        }
      });
    });
  }

  /**
   * Inicialização Principal da Aplicação Multi-Page View
   */
  async function initApp() {
    const { content, isCustomPreview } = await loadSiteContent();

    renderNavigation(content.meta, content.contatoLocalizacao);
    renderPageHeadersAndFooters();

    renderHomePage(content);
    renderQuemSomos(content.quemSomos);
    renderHistoria(content.historia);
    renderFuncionamento(content.funcionamento);
    renderAutogestao(content.autogestao);
    renderImpacto(content.impactoSocialAmbiental);
    renderComoReciclarESeparacao(content.comoReciclar, content.separacaoResiduos);
    renderEntregaMateriais(content.entregaMateriais, content.contatoLocalizacao);
    renderParcerias(content.parcerias, content.contatoLocalizacao);
    renderFaq(content.faq);
    renderContatoEFooter(content.contatoLocalizacao, content.meta);
    if (window.initCursoAutogestao) window.initCursoAutogestao(content);

    setupInteractivity(isCustomPreview);

    // Define a página ativa inicial com base no hash da URL (ou 'inicio')
    const initialHash = window.location.hash.replace(/^#/, '') || 'inicio';
    navigateToPage(initialHash, { skipHashUpdate: true });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
