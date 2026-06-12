/* Vintech — 5 Carousel slide sets */

/* ================================================================
   CAROUSEL 1 — Brand Intro  "Da vindima à última taça"
   ================================================================ */
const C1_TOTAL = 6;

const C1_Cover = () => (
  <SlideFrame bgImage={window.__resources.vineyard} overlay={`linear-gradient(180deg, ${BORDO_DEEP}cc 0%, ${BORDO_DEEP}aa 40%, ${BORDO_DEEP}f2 100%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <LogoBlock light size="md"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GoldRule/>
        <Overline gold style={{ fontSize: 14 }}>Sistema Integrado de Gestão Vinícola</Overline>
        <h1 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 88, lineHeight: 1, letterSpacing: '-0.03em', margin: 0 }}>
          Da vindima<br/><span style={{ color: GOLD, fontStyle: 'italic' }}>à última taça.</span>
        </h1>
        <p style={{ fontSize: 22, lineHeight: 1.45, color: 'rgba(255,255,255,0.72)', maxWidth: 800, margin: 0 }}>
          A plataforma completa de gestão para vinícolas modernas.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <SwipeHint/>
        <PageDots total={C1_TOTAL} current={0}/>
      </div>
    </div>
  </SlideFrame>
);

const C1_WhatIs = () => (
  <SlideFrame bg={CREAM} style={{ color: INK }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <LogoBlock light={false} size="sm"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Overline>O que é Vintech?</Overline>
        <h2 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0, color: INK }}>
          O ERP feito <span style={{ color: BORDO, fontStyle: 'italic' }}>exclusivamente</span> para vinícolas brasileiras.
        </h2>
        <p style={{ fontSize: 22, lineHeight: 1.5, color: INK_SOFT, margin: 0 }}>
          Produtos, enoturismo, vendas, equipe e analytics — cinco módulos integrados em uma única plataforma elegante. Sem planilhas. Sem WhatsApp paralelo.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <SwipeHint light={false}/>
        <PageDots total={C1_TOTAL} current={1} light={false}/>
      </div>
    </div>
  </SlideFrame>
);

const C1_Modules = () => {
  const mods = [
    { icon: <WineIcon/>, name: 'Produtos' },
    { icon: <PinIcon/>, name: 'Enoturismo' },
    { icon: <CartIcon/>, name: 'Vendas' },
    { icon: <UsersIcon/>, name: 'Equipe' },
    { icon: <ChartIcon/>, name: 'Analytics' },
  ];
  return (
    <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(ellipse at top, ${BORDO}66, transparent 60%)`}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Overline gold>5 Módulos. Uma plataforma.</Overline>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {mods.map(m => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }}>
              <IconSquare size={52}>{React.cloneElement(m.icon, { width: 24, height: 24 })}</IconSquare>
              <span style={{ fontFamily: FONT_D, fontWeight: 600, fontSize: 26, color: '#fff' }}>{m.name}</span>
            </div>
          ))}
        </div>
        <PageDots total={C1_TOTAL} current={2}/>
      </div>
    </SlideFrame>
  );
};

const C1_Stats = () => {
  const stats = [
    { v: '5', l: 'Módulos integrados' },
    { v: '100%', l: 'Multi-tenant nativo' },
    { v: '24/7', l: 'Suporte premium' },
  ];
  return (
    <SlideFrame bgImage={window.__resources.bottles} overlay={`linear-gradient(180deg, ${BORDO_DEEP}dd 0%, ${BORDO_DEEP}cc 50%, ${BORDO_DEEP}ee 100%)`}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Overline gold>Em números</Overline>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {stats.map(s => (
            <div key={s.l} style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 28 }}>
              <div style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 80, lineHeight: 1, color: GOLD, letterSpacing: '-0.02em' }}>{s.v}</div>
              <div style={{ marginTop: 8, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <PageDots total={C1_TOTAL} current={3}/>
      </div>
    </SlideFrame>
  );
};

const C1_Quote = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(circle at 80% 20%, ${GOLD}15, transparent 50%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <LogoBlock light size="sm"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ width: 48, height: 2, background: GOLD }}/>
        <h2 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 64, lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0, fontStyle: 'italic', color: GOLD_SOFT }}>
          "Tecnologia à altura da tradição do vinho."
        </h2>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          Do produtor familiar ao grupo com múltiplas marcas — uma única fonte de verdade para toda a operação.
        </p>
      </div>
      <PageDots total={C1_TOTAL} current={4}/>
    </div>
  </SlideFrame>
);

const C1_CTA = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(ellipse at bottom right, ${GOLD}18, transparent 50%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
      <VtLogo size={72}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center' }}>
        <h2 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 56, lineHeight: 1.05, margin: 0 }}>
          Comece <span style={{ color: GOLD, fontStyle: 'italic' }}>grátis</span> por 15 dias.
        </h2>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 700 }}>
          Todos os módulos liberados. Sem cartão de crédito. Migração assistida.
        </p>
        <CtaButton>Iniciar teste grátis →</CtaButton>
      </div>
      <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)' }}>vintech.com.br</div>
    </div>
  </SlideFrame>
);

/* ================================================================
   CAROUSEL 2 — 5 Módulos (deep-dive)
   ================================================================ */
const C2_TOTAL = 7;
const moduleData = [
  { icon: <WineIcon/>, name: 'Produtos', desc: 'Catálogo completo de vinhos, safras, estoque e fichas técnicas.', feats: ['Gestão de safras', 'Controle de estoque', 'Fichas técnicas', 'Harmonizações'], img: window.__resources.wineProducts },
  { icon: <PinIcon/>, name: 'Enoturismo', desc: 'Visitas, degustações, eventos sazonais, hospedagem e cursos.', feats: ['Agendamentos online', 'Eventos & Vindima', 'Hospedagem integrada', 'Calendário visual'], img: window.__resources.enotourism },
  { icon: <CartIcon/>, name: 'Vendas', desc: 'Pedidos, clientes, distribuidores, clube de assinatura e e-commerce.', feats: ['Clube de assinatura', 'Distribuição B2B', 'E-commerce próprio', 'CRM integrado'], img: window.__resources.bottles },
  { icon: <UsersIcon/>, name: 'Equipe', desc: 'Funcionários, papéis e permissões granulares por módulo.', feats: ['RBAC completo', 'Departamentos', 'Permissões finas', 'Multi-tenant'], img: window.__resources.vineyardAerial },
  { icon: <ChartIcon/>, name: 'Analytics', desc: 'KPIs em tempo real, dashboards por papel e exportação de relatórios.', feats: ['KPIs em tempo real', 'Relatórios PDF', 'Tendências', 'Dashboard custom'], img: window.__resources.heroWinery },
];

const C2_Cover = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(ellipse at top, ${BORDO}55, transparent 60%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <LogoBlock light size="sm"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GoldRule/>
        <Overline gold>Conheça a plataforma</Overline>
        <h1 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 76, lineHeight: 1.02, letterSpacing: '-0.03em', margin: 0 }}>
          Cinco módulos.<br/><span style={{ color: GOLD, fontStyle: 'italic' }}>Uma plataforma.</span>
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.5, color: 'rgba(255,255,255,0.68)', margin: 0, maxWidth: 700 }}>
          Tudo que sua vinícola precisa, em um só lugar.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <SwipeHint/>
        <PageDots total={C2_TOTAL} current={0}/>
      </div>
    </div>
  </SlideFrame>
);

const C2_Module = ({ idx }) => {
  const m = moduleData[idx];
  return (
    <SlideFrame bg={CREAM} style={{ color: INK }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Overline>{`Módulo ${idx + 1} de 5`}</Overline>
          <VtLogo size={32}/>
        </div>
        <div style={{ borderRadius: 24, overflow: 'hidden', height: 320, background: `url(${m.img}) center/cover`, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, ${BORDO_DEEP}cc 100%)` }}/>
          <div style={{ position: 'absolute', bottom: 24, left: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <IconSquare size={56}>{React.cloneElement(m.icon, { width: 26, height: 26 })}</IconSquare>
            <span style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 36, color: '#fff' }}>{m.name}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p style={{ fontSize: 22, lineHeight: 1.45, color: INK_SOFT, margin: 0 }}>{m.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {m.feats.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, fontSize: 16, fontWeight: 500, color: INK }}>
                <CheckIcon color={BORDO} size={18}/>{f}
              </div>
            ))}
          </div>
        </div>
        <PageDots total={C2_TOTAL} current={idx + 1} light={false}/>
      </div>
    </SlideFrame>
  );
};

const C2_CTA = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(ellipse at bottom, ${GOLD}12, transparent 50%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
      <VtLogo size={64}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        <h2 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 52, lineHeight: 1.05, margin: 0 }}>
          Teste <span style={{ color: GOLD, fontStyle: 'italic' }}>todos os módulos</span> por 15 dias.
        </h2>
        <CtaButton>Começar grátis →</CtaButton>
      </div>
      <PageDots total={C2_TOTAL} current={6}/>
    </div>
  </SlideFrame>
);

/* ================================================================
   CAROUSEL 3 — Dashboard / Analytics
   ================================================================ */
const C3_TOTAL = 5;

const C3_Cover = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(ellipse at top right, ${GOLD}18, transparent 50%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <LogoBlock light size="sm"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GoldRule/>
        <Overline gold>Dashboard em tempo real</Overline>
        <h1 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 72, lineHeight: 1.02, letterSpacing: '-0.025em', margin: 0 }}>
          Sua vinícola<br/>em <span style={{ color: GOLD, fontStyle: 'italic' }}>tempo real.</span>
        </h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <SwipeHint/>
        <PageDots total={C3_TOTAL} current={0}/>
      </div>
    </div>
  </SlideFrame>
);

const C3_KPIs = () => {
  const kpis = [
    { label: 'Receita do mês', value: 'R$ 184.290', change: '+12.5%', wine: true },
    { label: 'Pedidos totais', value: '1.284', change: '+5.2%', wine: false },
    { label: 'Garrafas vendidas', value: '8.940', change: '+8.1%', wine: false },
    { label: 'Visitantes', value: '512', change: '+22%', wine: false },
  ];
  return (
    <SlideFrame bg={CREAM} style={{ color: INK }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Overline>KPIs · Visão geral</Overline>
          <VtLogo size={32}/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {kpis.map(k => (
            <div key={k.label} style={{
              padding: 28, borderRadius: 20, position: 'relative', overflow: 'hidden',
              background: k.wine ? GRADIENT_WINE : '#fff',
              border: k.wine ? 'none' : `1px solid ${BORDER}`,
              color: k.wine ? '#fff' : INK,
              boxShadow: k.wine ? SHADOW_ELEGANT : SHADOW_CARD,
            }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: '50%', background: `${GOLD}15`, filter: 'blur(20px)' }}/>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: k.wine ? 'rgba(255,255,255,0.6)' : INK_SOFT }}>{k.label}</div>
                <div style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 36, letterSpacing: '-0.02em', marginTop: 10, color: k.wine ? GOLD : INK }}>{k.value}</div>
                <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, background: k.wine ? `${SUCCESS}33` : `${SUCCESS}18`, color: k.wine ? '#fff' : SUCCESS, padding: '3px 10px', borderRadius: 8 }}>↑ {k.change}</div>
              </div>
            </div>
          ))}
        </div>
        <PageDots total={C3_TOTAL} current={1} light={false}/>
      </div>
    </SlideFrame>
  );
};

const C3_Revenue = () => (
  <SlideFrame bg={CREAM} style={{ color: INK }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Overline>Desempenho de vendas</Overline>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${SUCCESS}15`, color: SUCCESS, padding: '5px 12px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>↑ +47% YoY</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 24, padding: 32, boxShadow: SHADOW_CARD }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: FONT_D, fontWeight: 600, fontSize: 24, margin: 0 }}>Receita acumulada</h3>
            <span style={{ fontSize: 14, color: INK_SOFT }}>Últimos 12 meses · R$ 1.84M</span>
          </div>
          <svg viewBox="0 0 900 300" preserveAspectRatio="none" style={{ width: '100%', height: 260 }}>
            <defs>
              <linearGradient id="c3rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BORDO} stopOpacity="0.35"/><stop offset="100%" stopColor={BORDO} stopOpacity="0"/></linearGradient>
            </defs>
            <g stroke={BORDER} strokeDasharray="3 3"><line x1="40" y1="40" x2="860" y2="40"/><line x1="40" y1="120" x2="860" y2="120"/><line x1="40" y1="200" x2="860" y2="200"/><line x1="40" y1="260" x2="860" y2="260"/></g>
            <path d="M40,210 L108,195 L176,185 L244,160 L312,145 L380,130 L448,115 L516,105 L584,90 L652,75 L720,62 L788,52 L860,40 L860,260 L40,260 Z" fill="url(#c3rev)"/>
            <path d="M40,210 L108,195 L176,185 L244,160 L312,145 L380,130 L448,115 L516,105 L584,90 L652,75 L720,62 L788,52 L860,40" fill="none" stroke={BORDO} strokeWidth="3"/>
            <g fill={BORDO}><circle cx="40" cy="210" r="5"/><circle cx="244" cy="160" r="5"/><circle cx="448" cy="115" r="5"/><circle cx="652" cy="75" r="5"/><circle cx="860" cy="40" r="5"/></g>
          </svg>
        </div>
      </div>
      <PageDots total={C3_TOTAL} current={2} light={false}/>
    </div>
  </SlideFrame>
);

const C3_Channels = () => {
  const channels = [
    { name: 'E-commerce', pct: 38, w: '100%' },
    { name: 'Clube assinatura', pct: 28, w: '74%' },
    { name: 'Enoturismo', pct: 22, w: '58%' },
    { name: 'Distribuição B2B', pct: 18, w: '47%' },
    { name: 'PDV vinícola', pct: 11, w: '29%' },
  ];
  return (
    <SlideFrame bg={CREAM} style={{ color: INK }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Overline>Vendas por canal</Overline>
          <VtLogo size={32}/>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 24, padding: 36, boxShadow: SHADOW_CARD, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {channels.map(c => (
            <div key={c.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 17, fontWeight: 500 }}>
                <span>{c.name}</span>
                <span style={{ fontFamily: FONT_D, fontWeight: 700, color: BORDO }}>{c.pct}%</span>
              </div>
              <div style={{ height: 28, background: `${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ width: c.w, height: '100%', background: GRADIENT_GOLD, borderRadius: 8 }}/>
              </div>
            </div>
          ))}
        </div>
        <PageDots total={C3_TOTAL} current={3} light={false}/>
      </div>
    </SlideFrame>
  );
};

const C3_CTA = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(ellipse at bottom, ${GOLD}12, transparent 50%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
      <VtLogo size={64}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center' }}>
        <h2 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 52, lineHeight: 1.05, margin: 0 }}>
          Decisões guiadas por <span style={{ color: GOLD, fontStyle: 'italic' }}>dados de safra.</span>
        </h2>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: 700 }}>Acesse o dashboard e veja tudo em tempo real.</p>
        <CtaButton>Testar agora →</CtaButton>
      </div>
      <PageDots total={C3_TOTAL} current={4}/>
    </div>
  </SlideFrame>
);

/* ================================================================
   CAROUSEL 4 — Planos & Preços
   ================================================================ */
const C4_TOTAL = 5;
const planData = [
  { name: 'Viticultura', price: '129', desc: 'Gestão operacional e conformidade.', feats: ['Até 3 membros', 'Todos os módulos', '500 pedidos/mês', 'Suporte por email'], featured: false },
  { name: 'Business', price: '349', desc: 'Para vinícolas em expansão.', feats: ['Até 7 membros', 'Todos os módulos', '1.000 pedidos/mês', 'Clube de assinatura', 'Suporte prioritário'], featured: true },
  { name: 'Sommelier', price: '849', desc: 'Ecossistema completo e inteligência.', feats: ['Membros ilimitados', 'Todos os módulos', 'Pedidos ilimitados', 'API & integrações', 'SLA 99.9% + gerente'], featured: false },
];

const C4_Cover = () => (
  <SlideFrame bgImage={window.__resources.heroWine} overlay={`linear-gradient(180deg, ${BORDO_DEEP}cc, ${BORDO_DEEP}ee)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <LogoBlock light size="sm"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GoldRule/>
        <Overline gold>Planos transparentes</Overline>
        <h1 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 68, lineHeight: 1.02, letterSpacing: '-0.025em', margin: 0 }}>
          O plano certo para o <span style={{ color: GOLD, fontStyle: 'italic' }}>ritmo da sua colheita.</span>
        </h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <SwipeHint/>
        <PageDots total={C4_TOTAL} current={0}/>
      </div>
    </div>
  </SlideFrame>
);

const C4_Plan = ({ idx }) => {
  const p = planData[idx];
  const isF = p.featured;
  return (
    <SlideFrame bg={isF ? BORDO_DEEP : CREAM} style={{ color: isF ? '#fff' : INK }} overlay={isF ? `radial-gradient(ellipse at top, ${BORDO}66, transparent 60%)` : undefined}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Overline gold={isF} style={isF ? {} : {}}>{`Plano ${idx + 1} de 3`}</Overline>
          <VtLogo size={32}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1, justifyContent: 'center' }}>
          {isF && <div style={{ alignSelf: 'flex-start', background: GOLD, color: BORDO_DEEP, padding: '6px 18px', borderRadius: 999, fontFamily: FONT_D, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em' }}>Mais escolhido</div>}
          <h2 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 48, margin: 0, color: isF ? GOLD : BORDO }}>Vintech {p.name}</h2>
          <p style={{ fontSize: 20, color: isF ? 'rgba(255,255,255,0.65)' : INK_SOFT, margin: 0 }}>{p.desc}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ fontSize: 28, opacity: 0.7 }}>R$</span>
            <span style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 88, lineHeight: 1, letterSpacing: '-0.02em', color: isF ? GOLD : INK }}>{p.price}</span>
            <span style={{ fontSize: 20, color: isF ? 'rgba(255,255,255,0.5)' : INK_SOFT }}>/mês</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
            {p.feats.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 18, color: isF ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.75)' }}>
                <CheckIcon color={isF ? GOLD : BORDO} size={20}/>{f}
              </div>
            ))}
          </div>
        </div>
        <PageDots total={C4_TOTAL} current={idx + 1} light={isF}/>
      </div>
    </SlideFrame>
  );
};

const C4_CTA = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(ellipse at bottom, ${GOLD}12, transparent 50%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
      <VtLogo size={64}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center' }}>
        <h2 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 52, lineHeight: 1.05, margin: 0 }}>
          Escolha seu plano e <span style={{ color: GOLD, fontStyle: 'italic' }}>comece hoje.</span>
        </h2>
        <CtaButton>Ver planos →</CtaButton>
      </div>
      <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)' }}>vintech.com.br · 15 dias grátis</div>
    </div>
  </SlideFrame>
);

/* ================================================================
   CAROUSEL 5 — CTA / 15 dias grátis
   ================================================================ */
const C5_TOTAL = 5;

const C5_Cover = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(circle at 70% 30%, ${GOLD}22, transparent 45%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <LogoBlock light size="sm"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GoldRule/>
        <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: GOLD, color: BORDO_DEEP, padding: '8px 20px', borderRadius: 999, fontFamily: FONT_D, fontSize: 15, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Oferta exclusiva</div>
        <h1 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 82, lineHeight: 1, letterSpacing: '-0.03em', margin: 0 }}>
          15 dias<br/><span style={{ color: GOLD, fontStyle: 'italic' }}>grátis.</span>
        </h1>
        <p style={{ fontSize: 22, lineHeight: 1.45, color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: 700 }}>
          Experimente a plataforma completa, sem compromisso. Todos os módulos liberados.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <SwipeHint/>
        <PageDots total={C5_TOTAL} current={0}/>
      </div>
    </div>
  </SlideFrame>
);

const C5_Included = () => {
  const items = [
    { icon: <WineIcon/>, t: 'Todos os 5 módulos' },
    { icon: <ShieldIcon/>, t: 'Sem cartão de crédito' },
    { icon: <UsersIcon/>, t: 'Migração de dados assistida' },
    { icon: <ZapIcon/>, t: 'Suporte premium incluso' },
    { icon: <ChartIcon/>, t: 'Dashboard completo' },
  ];
  return (
    <SlideFrame bg={CREAM} style={{ color: INK }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Overline>O que está incluso</Overline>
          <VtLogo size={32}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map(it => (
            <div key={it.t} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, boxShadow: SHADOW_CARD }}>
              <IconSquare size={52}>{React.cloneElement(it.icon, { width: 24, height: 24 })}</IconSquare>
              <span style={{ fontFamily: FONT_D, fontWeight: 600, fontSize: 22, color: INK }}>{it.t}</span>
            </div>
          ))}
        </div>
        <PageDots total={C5_TOTAL} current={1} light={false}/>
      </div>
    </SlideFrame>
  );
};

const C5_Demo = () => (
  <SlideFrame bgImage={window.__resources.enotourism} overlay={`linear-gradient(180deg, ${BORDO_DEEP}dd, ${BORDO_DEEP}ee)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Overline gold>Demonstração ao vivo</Overline>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <h2 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 60, lineHeight: 1.05, margin: 0 }}>
          Agende uma <span style={{ color: GOLD, fontStyle: 'italic' }}>reunião de 30 min.</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {['Apresentação ao vivo da plataforma', 'Conduzida pelo time de produto', 'Horário flexível, online ou presencial', 'Proposta personalizada ao final'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 19, color: 'rgba(255,255,255,0.8)' }}>
              <CheckIcon color={GOLD} size={20}/>{t}
            </div>
          ))}
        </div>
      </div>
      <PageDots total={C5_TOTAL} current={2}/>
    </div>
  </SlideFrame>
);

const C5_Social = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(circle at 20% 80%, ${GOLD}12, transparent 50%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <LogoBlock light size="sm"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <GoldRule/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[{ v: '126', l: 'Vinícolas ativas' }, { v: '96%', l: 'Retenção líquida' }, { v: '4.9', l: 'Nota média' }].map(s => (
            <div key={s.l} style={{ padding: '28px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 44, color: GOLD }}>{s.v}</div>
              <div style={{ marginTop: 8, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.55)' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 24, lineHeight: 1.45, color: GOLD_SOFT, fontStyle: 'italic', fontFamily: FONT_D, margin: 0 }}>
          "A Vintech transformou a forma como gerenciamos nossa operação."
        </p>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: 0 }}>— Vinícola São Bento, RS</p>
      </div>
      <PageDots total={C5_TOTAL} current={3}/>
    </div>
  </SlideFrame>
);

const C5_FinalCTA = () => (
  <SlideFrame bg={BORDO_DEEP} overlay={`radial-gradient(ellipse at bottom right, ${GOLD}18, transparent 50%)`}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
      <VtLogo size={72}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center' }}>
        <h2 style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: 56, lineHeight: 1.05, margin: 0 }}>
          Da vindima<br/><span style={{ color: GOLD, fontStyle: 'italic' }}>à última taça.</span>
        </h2>
        <CtaButton style={{ fontSize: 22, height: 72, padding: '0 44px' }}>Começar grátis →</CtaButton>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 16, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>
          <span>contato.vintech@gmail.com</span>
          <span>+55 (11) 97567-8074</span>
          <span>vintech.com.br</span>
        </div>
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>© 2026 Vintech · Feito com paixão pelo vinho.</div>
    </div>
  </SlideFrame>
);

/* ====== EXPORTS ====== */
Object.assign(window, {
  C1_Cover, C1_WhatIs, C1_Modules, C1_Stats, C1_Quote, C1_CTA,
  C2_Cover, C2_Module, C2_CTA,
  C3_Cover, C3_KPIs, C3_Revenue, C3_Channels, C3_CTA,
  C4_Cover, C4_Plan, C4_CTA,
  C5_Cover, C5_Included, C5_Demo, C5_Social, C5_FinalCTA,
});
