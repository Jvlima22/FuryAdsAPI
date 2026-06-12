// Primitivos compartilhados — TGL Solutions
// Logo, Mockups (Browser/iPhone), Icons (Lucide-style SVGs), helpers

const TGLLogo = ({ tone = 'light', size = 18 }) => {
  const src = tone === 'gradient'
    ? window.__resources.tglLogoGradient
    : tone === 'light'
      ? window.__resources.tglLogoNavy
      : window.__resources.tglLogo;
  const h = Math.round(size * 2.1);
  return (
    <img
      src={src}
      alt="TGL Solutions"
      style={{ height: h, width: 'auto', display: 'block' }}
    />
  );
};

// ============ ICONS (lucide-style) ============
const makeIcon = (svgInner) => (p = {}) => {
  const { size = 24, stroke = 'currentColor', strokeWidth = 2, fill = 'none' } = p;
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill, stroke, strokeWidth,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    dangerouslySetInnerHTML: { __html: svgInner },
  });
};

const IconCheck       = makeIcon('<path d="M20 6L9 17l-5-5"/>');
const IconArrowRight  = makeIcon('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>');
const IconChevronRight= makeIcon('<path d="M9 18l6-6-6-6"/>');
const IconHeart       = makeIcon('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>');
const IconRepeat      = makeIcon('<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>');
const IconReply       = makeIcon('<path d="M9 17l-5-5 5-5M4 12h12a4 4 0 0 1 0 8h-2"/>');
const IconUpload      = makeIcon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>');
const IconCalendar    = makeIcon('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>');
const IconWallet      = makeIcon('<path d="M19 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM3 9V5a2 2 0 0 1 2-2h11"/><circle cx="17" cy="14" r="1.5" fill="currentColor" stroke="none"/>');
const IconMsg         = makeIcon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>');
const IconBar         = makeIcon('<line x1="3" y1="20" x2="21" y2="20"/><rect x="5" y="12" width="3" height="8"/><rect x="11" y="6" width="3" height="14"/><rect x="17" y="9" width="3" height="11"/>');
const IconUser        = makeIcon('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>');
const IconZap         = makeIcon('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>');
const IconClock       = makeIcon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>');
const IconWhatsApp    = makeIcon('<path d="M21 11.5a8.38 8.38 0 0 1-12.65 7.18L3 21l2.42-5.32A8.38 8.38 0 1 1 21 11.5z"/>');
const IconSheet       = makeIcon('<rect x="3" y="4" width="18" height="16" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="14" x2="21" y2="14"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/>');
const IconBell        = makeIcon('<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>');
const IconDatabase    = makeIcon('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>');
const IconCode        = makeIcon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>');
const IconWine        = makeIcon('<path d="M8 22h8M12 15v7M17 5H7l-1 5a6 6 0 0 0 12 0z"/>');
const IconBook        = makeIcon('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>');
const IconLayers      = makeIcon('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>');
const IconChart       = makeIcon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>');

// ============ MOCKUP COMPONENTS ============
const BrowserMockup = ({ children, width = '100%', height = 'auto', label = '' }) => (
  <div className="mockup-browser" style={{ width, height }}>
    <div className="bar">
      <span className="dot" style={{ background: '#ff5f57' }} />
      <span className="dot" style={{ background: '#febc2e' }} />
      <span className="dot" style={{ background: '#28c840' }} />
      {label && (
        <span style={{ marginLeft: 12, color: '#5a6c8a', fontFamily: 'DM Sans', fontSize: 11, fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
    <div style={{ background: '#fff' }}>{children}</div>
  </div>
);

const IPhoneMockup = ({ children, width = 280 }) => (
  <div className="mockup-iphone" style={{ width }}>
    <div className="screen" style={{ aspectRatio: '9/19' }}>
      <div className="notch" />
      {children}
    </div>
  </div>
);

// ============ MOCK SCREENS ============
const ScreenBarber = () => (
  <div style={{ background: '#0e1116', height: '100%', color: '#fff', padding: '50px 18px 20px', fontFamily: 'DM Sans, sans-serif' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 11, color: '#8a8f99' }}>Hoje, qua 28</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Agenda</div>
      </div>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1b2030', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconBell size={14} stroke="#fff" />
      </div>
    </div>
    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
      {['Seg','Ter','Qua','Qui','Sex'].map((d, i) => (
        <div key={d} style={{
          flex: 1, padding: '8px 0', borderRadius: 8,
          background: i === 2 ? '#FFBB36' : '#1b2030',
          color: i === 2 ? '#0e1116' : '#cdcfd2',
          textAlign: 'center', fontSize: 10, fontWeight: 600
        }}>
          <div>{d}</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{26+i}</div>
        </div>
      ))}
    </div>
    {[
      { h: '09:00', c: 'Lucas Pereira', s: 'Corte + Barba', v: 'R$ 80' },
      { h: '10:30', c: 'André Costa', s: 'Corte', v: 'R$ 50' },
      { h: '11:30', c: 'Vinícius S.', s: 'Barba', v: 'R$ 35' },
      { h: '14:00', c: 'Marcos Lima', s: 'Pigmentação', v: 'R$ 120' },
    ].map((it, i) => (
      <div key={i} style={{
        background: '#161b27', borderRadius: 10, padding: 10, marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#FFBB36', width: 38 }}>{it.h}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{it.c}</div>
          <div style={{ fontSize: 10, color: '#8a8f99' }}>{it.s}</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600 }}>{it.v}</div>
      </div>
    ))}
  </div>
);

const ScreenCaptu = () => (
  <div style={{ background: '#fff', height: '100%', padding: '50px 18px 20px', fontFamily: 'DM Sans, sans-serif' }}>
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: '#0F6CBD', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>captu</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#041020' }}>Leads de hoje</div>
    </div>
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      {[{ l: 'Novos', v: '24', a: true }, { l: 'Qualificados', v: '11' }, { l: 'Fechados', v: '3' }].map((s, i) => (
        <div key={i} style={{
          flex: 1, padding: 10, borderRadius: 10,
          background: s.a ? '#0F6CBD' : '#F8F9FA',
          color: s.a ? '#fff' : '#041020',
        }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{s.v}</div>
          <div style={{ fontSize: 9, opacity: 0.85 }}>{s.l}</div>
        </div>
      ))}
    </div>
    {[
      { n: 'Mariana V.', src: 'Instagram', s: 'Novo' },
      { n: 'Empresa Vega', src: 'Site', s: 'Qualif.' },
      { n: 'João R.', src: 'WhatsApp', s: 'Novo' },
      { n: 'Beta Ltda.', src: 'Indicação', s: 'Fechado' },
    ].map((l, i) => (
      <div key={i} style={{
        borderTop: '1px solid #efefef', padding: '10px 0',
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0F6CBD', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
          {l.n[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#041020' }}>{l.n}</div>
          <div style={{ fontSize: 10, color: '#5A5E64' }}>via {l.src}</div>
        </div>
        <div style={{ fontSize: 10, color: '#0F6CBD', fontWeight: 600 }}>{l.s}</div>
      </div>
    ))}
  </div>
);

const ScreenVintech = () => (
  <div style={{ background: '#fff', minHeight: 240, fontFamily: 'DM Sans, sans-serif', display: 'flex' }}>
    <div style={{ width: 70, background: '#350f15', padding: '14px 8px', color: '#d6c294' }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}>VINTECH</div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {[IconBar, IconWine, IconUser, IconChart].map((I, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: i === 0 ? '#c8a052' : 'transparent', color: i === 0 ? '#350f15' : '#d6c294'
          }}>
            <I size={16} />
          </div>
        ))}
      </div>
    </div>
    <div style={{ flex: 1, padding: '14px 16px' }}>
      <div style={{ fontSize: 9, color: '#9b6b1c', fontWeight: 600, letterSpacing: '0.15em' }}>VISÃO GERAL</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: '#350f15', marginBottom: 12 }}>Olá, Helena ✦</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { l: 'Vendas mês', v: 'R$ 142k' },
          { l: 'Enoturismo', v: '38 visitas' },
          { l: 'Estoque', v: '2.140 gf.' },
        ].map((k, i) => (
          <div key={i} style={{ background: '#faf6ee', border: '1px solid #e8dec8', borderRadius: 10, padding: 8 }}>
            <div style={{ fontSize: 9, color: '#7a6b4a' }}>{k.l}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#350f15' }}>{k.v}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#350f15', borderRadius: 10, padding: 10, color: '#fff' }}>
        <div style={{ fontSize: 9, color: '#c8a052', fontWeight: 600 }}>SAFRAS</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 50, marginTop: 6 }}>
          {[40, 60, 35, 80, 55, 70, 90].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: '#c8a052', borderRadius: 2, opacity: 0.4 + i * 0.08 }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ScreenGenericDash = () => (
  <div style={{ background: '#fff', padding: 16, fontFamily: 'DM Sans, sans-serif', minHeight: 240 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#041020' }}>Painel</div>
      <div style={{ display: 'flex', gap: 6 }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F6CBD', display: 'inline-block' }} />
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 10 }}>
      {[
        { l: 'Receita', v: 'R$ 38.2k', up: '+12%' },
        { l: 'Clientes', v: '212', up: '+8%' },
        { l: 'Pendentes', v: '4', up: '-50%' },
      ].map((k, i) => (
        <div key={i} style={{ background: '#F8F9FA', borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 9, color: '#5A5E64' }}>{k.l}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#041020' }}>{k.v}</div>
          <div style={{ fontSize: 9, color: '#0F6CBD', fontWeight: 600 }}>{k.up}</div>
        </div>
      ))}
    </div>
    <div style={{ background: '#F8F9FA', borderRadius: 10, padding: 12 }}>
      <div style={{ fontSize: 10, color: '#5A5E64', marginBottom: 8 }}>Últimos 30 dias</div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        <path d="M0,50 Q30,40 50,30 T100,20 T150,15 T200,5" stroke="#0F6CBD" strokeWidth="2" fill="none" />
        <path d="M0,50 Q30,40 50,30 T100,20 T150,15 T200,5 L200,60 L0,60 Z" fill="rgba(15,108,189,0.12)" />
      </svg>
    </div>
  </div>
);

const ScreenChaosSheet = () => (
  <div style={{ background: '#fff', padding: 0, fontFamily: 'DM Sans, sans-serif', minHeight: 240 }}>
    <div style={{ background: '#1e7e3c', color: '#fff', padding: '8px 12px', fontSize: 11, fontWeight: 600 }}>
      controle_clientes_FINAL_v3 (1) (2).xlsx
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '30px repeat(5, 1fr)', fontSize: 9, color: '#041020' }}>
      {['', 'Cliente', 'Serviço', 'Valor', 'Data', 'Pago?'].map((h, i) => (
        <div key={i} style={{ background: '#f1f3f4', padding: 6, borderRight: '1px solid #d6d9dc', borderBottom: '1px solid #d6d9dc', fontWeight: 700 }}>{h}</div>
      ))}
      {[
        ['1','joao','corte','50','12/05','sim'],
        ['2','MARIA','manicure','45,00','13/5','sm'],
        ['3','Pedro','corte+barba','R$80','14-05','??'],
        ['4','','','','',''],
        ['5','ana cláudia','escova','40','15/5','pagou'],
        ['6','PEDRO','barba','35','14/05','dup?'],
        ['7','lia','','','','não'],
        ['8','=SOMA(C2','#REF!','','','#ERROR'],
      ].map((row, i) => row.map((c, j) => (
        <div key={`${i}-${j}`} style={{
          padding: 5, borderRight: '1px solid #e8eaed', borderBottom: '1px solid #e8eaed',
          background: j === 0 ? '#f8f9fa' : c.includes('#') ? '#fde7e9' : '#fff',
          color: c.includes('#') ? '#b71c1c' : '#041020',
          fontWeight: j === 0 ? 600 : 400,
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
        }}>{c}</div>
      )))}
    </div>
  </div>
);

const ScreenWhatsChaos = () => (
  <div style={{ background: '#e5ddd5', height: '100%', padding: '50px 12px 20px', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[
        { side: 'l', t: 'oi vc tá aí?', h: '14:22' },
        { side: 'l', t: 'preciso remarcar', h: '14:22' },
        { side: 'r', t: 'pra quando?', h: '14:35' },
        { side: 'l', t: 'qualquer dia', h: '14:36' },
        { side: 'l', t: 'amanhã serve?', h: '14:40' },
        { side: 'r', t: 'só pela tarde', h: '15:12' },
        { side: 'l', t: 'esqueci. dps te falo', h: '17:48' },
        { side: 'l', t: 'cadê?', h: '09:01' },
        { side: 'l', t: '?', h: '09:30' },
      ].map((m, i) => (
        <div key={i} style={{ alignSelf: m.side === 'r' ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
          <div style={{
            background: m.side === 'r' ? '#dcf8c6' : '#fff',
            padding: '6px 9px', borderRadius: 8, fontSize: 11, color: '#041020',
            boxShadow: '0 1px 0 rgba(0,0,0,0.08)'
          }}>
            {m.t}
            <span style={{ fontSize: 8, color: '#65737e', marginLeft: 6 }}>{m.h}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

Object.assign(window, {
  TGLLogo,
  IconCheck, IconArrowRight, IconChevronRight, IconHeart, IconRepeat, IconReply,
  IconUpload, IconCalendar, IconWallet, IconMsg, IconBar, IconUser, IconZap,
  IconClock, IconWhatsApp, IconSheet, IconBell, IconDatabase,
  IconCode, IconChart, IconWine, IconBook, IconLayers,
  BrowserMockup, IPhoneMockup,
  ScreenBarber, ScreenCaptu, ScreenVintech, ScreenGenericDash,
  ScreenChaosSheet, ScreenWhatsChaos,
});
