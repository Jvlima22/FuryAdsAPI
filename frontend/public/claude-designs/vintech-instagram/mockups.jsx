/* Mini-mockups: chaotic Excel & polished Vintech dashboard */

// ─── Chaotic Excel — desaturated, messy, with sticky notes ─────────────
const ExcelChaos = ({ height = 300 }) => {
  const cellH = 22;
  const rows = Array.from({ length: 10 });
  const cols = ['SAFRA', 'PRODUTO', 'EST.', 'PREÇO', 'VEND.', 'NOTA'];
  const data = [
    ['2014', 'Merlot Res.', '?', 'R$ —', '12?', 'rever'],
    ['2018', 'Cab. Sauv.', '47', '85', '23', 'ok?'],
    ['2020', 'Chardonn.', '0', '92', '—', 'acabou'],
    ['2019', 'Tannat', '120', '110', '8', '👀'],
    ['2021', 'Pinot N.', '?', '', '?', '???'],
    ['2017', 'Espumante', '34', '78', '15', ''],
    ['2022', 'Riesling', '', '60', '5', 'falar c/ joão'],
    ['2016', 'Malbec', '12', '95', '?', 'old'],
    ['2023', 'Rosé', '90', '55', '40', 'ok'],
  ];
  return (
    <div style={{
      background: '#FBFAF7', height, position: 'relative', overflow: 'hidden',
      fontFamily: 'Menlo, monospace', filter: 'saturate(0.55) contrast(0.95)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: `36px repeat(${cols.length}, 1fr)`,
        background: '#E8E4DC', borderBottom: '1px solid #C9C4BA', fontSize: 10, color: '#5b554a',
      }}>
        <div style={{ padding: '4px 6px', borderRight: '1px solid #C9C4BA' }}></div>
        {cols.map((c, i) => (
          <div key={i} style={{ padding: '4px 8px', borderRight: '1px solid #C9C4BA', fontWeight: 600 }}>{c}</div>
        ))}
      </div>
      {rows.map((_, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: `36px repeat(${cols.length}, 1fr)`,
          height: cellH, borderBottom: '1px solid #ECE8E0', fontSize: 10, color: '#3a352d',
          background: i % 2 ? '#FBFAF7' : '#F6F3EC',
        }}>
          <div style={{ padding: '4px 6px', background: '#E8E4DC', borderRight: '1px solid #C9C4BA', textAlign: 'center', color: '#7a7466' }}>{i+1}</div>
          {(data[i] || cols.map(() => '')).map((v, j) => (
            <div key={j} style={{
              padding: '4px 8px', borderRight: '1px solid #ECE8E0', overflow: 'hidden', whiteSpace: 'nowrap',
              color: String(v).includes('?') ? '#a04040' : '#3a352d',
              background: String(v) === '' ? '#FFF8C8' : 'transparent',
              fontStyle: String(v).includes('falar') || String(v).includes('rever') ? 'italic' : 'normal',
            }}>{v}</div>
          ))}
        </div>
      ))}
      <div style={{
        position: 'absolute', top: 130, right: 20, width: 70, height: 70, borderRadius: 50,
        background: 'radial-gradient(circle, rgba(120,80,40,0.18) 30%, rgba(120,80,40,0.05) 60%, transparent 75%)',
      }}/>
      <div style={{
        position: 'absolute', bottom: 12, left: 28, width: 110, padding: '8px 10px',
        background: '#FFE680', color: '#5a4a2a', fontFamily: "'DM Sans', sans-serif",
        fontSize: 10, lineHeight: 1.3, transform: 'rotate(-4deg)',
        boxShadow: '0 4px 10px -4px rgba(0,0,0,0.25)',
      }}>conferir<br/>com a vinícola<br/><span style={{opacity:0.6}}>(2014?)</span></div>
    </div>
  );
};

// ─── Vintech dashboard mini-mockup ─────────────────────────────────────
const DashboardMockup = ({ height = 300, focus = 'overview' }) => {
  return (
    <div style={{
      height, background: VT.bordoDeep, display: 'grid', gridTemplateColumns: '110px 1fr',
      fontFamily: SANS, color: VT.cream,
    }}>
      <div style={{
        background: 'hsl(350 65% 9%)', borderRight: '1px solid rgba(230,210,166,0.10)',
        padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
          <svg viewBox="0 0 40 40" width={16} height={16}>
            <circle cx="20" cy="20" r="19" fill={VT.bordo} stroke={VT.gold} strokeWidth="1.2"/>
            <path d="M12 14 L20 28 L28 14" stroke={VT.gold} strokeWidth="1.8" fill="none"/>
            <circle cx="20" cy="22" r="2.2" fill={VT.gold}/>
          </svg>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11 }}>Vintech</span>
        </div>
        {[
          ['Visão', '◆', focus === 'overview'],
          ['Produtos', '◇', focus === 'produtos'],
          ['Enoturismo', '◇', focus === 'enoturismo'],
          ['Vendas', '◇', focus === 'vendas'],
          ['Equipe', '◇', false],
          ['Analytics', '◇', focus === 'analytics'],
        ].map(([l, g, active], i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 7px',
            borderRadius: 5, fontSize: 9.5,
            background: active ? 'rgba(200,164,76,0.14)' : 'transparent',
            color: active ? VT.gold : 'rgba(230,210,166,0.65)',
          }}>
            <span style={{ fontSize: 8 }}>{g}</span>{l}
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13 }}>
              Olá, Marina <span style={{ color: VT.gold }}>✦</span>
            </div>
            <div style={{ fontSize: 9, color: 'rgba(230,210,166,0.5)' }}>Resumo · hoje</div>
          </div>
          <div style={{
            fontSize: 8.5, padding: '3px 7px', borderRadius: 99,
            border: '1px solid rgba(230,210,166,0.20)', color: 'rgba(230,210,166,0.75)',
          }}>Safra 2024</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            ['Faturamento', 'R$ 184k', '+12.4%', true],
            ['Pedidos', '247', '+8', false],
            ['Garrafas', '3.812', '−2.1%', false],
          ].map(([k, v, d, hi], i) => (
            <div key={i} style={{
              background: hi ? VT.bordo : 'rgba(255,255,255,0.04)',
              border: '1px solid ' + (hi ? VT.gold : 'rgba(230,210,166,0.10)'),
              borderRadius: 8, padding: '8px 10px',
              boxShadow: hi ? '0 4px 16px -6px rgba(200,164,76,0.4)' : 'none',
            }}>
              <div style={{ fontSize: 7.5, color: 'rgba(230,210,166,0.55)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{k}</div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: hi ? VT.gold : VT.cream, marginTop: 2 }}>{v}</div>
              <div style={{ fontSize: 8, color: String(d).startsWith('−') ? '#E89E9E' : '#9ED4A8', marginTop: 1 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(230,210,166,0.10)',
          borderRadius: 8, padding: '10px 12px', position: 'relative', minHeight: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, color: 'rgba(230,210,166,0.6)', marginBottom: 6 }}>
            <span>Vendas · 12 meses</span><span style={{ color: VT.gold }}>↗</span>
          </div>
          <svg viewBox="0 0 240 70" preserveAspectRatio="none" style={{ width: '100%', height: 'calc(100% - 14px)' }}>
            <defs>
              <linearGradient id="dgrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={VT.gold} stopOpacity="0.35"/>
                <stop offset="100%" stopColor={VT.gold} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0 55 L20 52 L40 48 L60 50 L80 42 L100 36 L120 38 L140 30 L160 26 L180 20 L200 18 L220 12 L240 8 L240 70 L0 70 Z" fill="url(#dgrad)"/>
            <path d="M0 55 L20 52 L40 48 L60 50 L80 42 L100 36 L120 38 L140 30 L160 26 L180 20 L200 18 L220 12 L240 8" fill="none" stroke={VT.gold} strokeWidth="1.4"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

// ─── Analytics-focused mockup (used in Post 3 — "depois") ──────────────
const AnalyticsMockup = ({ height = 300 }) => (
  <div style={{
    height, background: VT.bordoDeep, fontFamily: SANS, color: VT.cream,
    padding: 18, display: 'flex', flexDirection: 'column', gap: 12,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconChart size={14} color={VT.gold}/>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13 }}>Analytics</span>
      </div>
      <div style={{ fontSize: 9, color: 'rgba(230,210,166,0.55)' }}>Últimos 90 dias</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <div style={{ background: VT.bordo, border: '1px solid ' + VT.gold, borderRadius: 8, padding: '8px 10px' }}>
        <div style={{ fontSize: 7.5, color: 'rgba(230,210,166,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Faturamento</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: VT.gold }}>R$ 412k</div>
        <div style={{ fontSize: 9, color: '#9ED4A8' }}>+24% vs trimestre</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(230,210,166,0.12)', borderRadius: 8, padding: '8px 10px' }}>
        <div style={{ fontSize: 7.5, color: 'rgba(230,210,166,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Margem</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: VT.cream }}>38,2%</div>
        <div style={{ fontSize: 9, color: '#9ED4A8' }}>+3,1pp</div>
      </div>
    </div>
    <div style={{
      flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(230,210,166,0.12)',
      borderRadius: 8, padding: 12, minHeight: 0,
    }}>
      <div style={{ fontSize: 9, color: 'rgba(230,210,166,0.6)', marginBottom: 6 }}>Tendência de vendas</div>
      <svg viewBox="0 0 240 100" preserveAspectRatio="none" style={{ width: '100%', height: 'calc(100% - 16px)' }}>
        <defs>
          <linearGradient id="agrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={VT.gold} stopOpacity="0.45"/>
            <stop offset="100%" stopColor={VT.gold} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[20,40,60,80].map(y =>
          <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="rgba(230,210,166,0.08)" strokeWidth="0.5"/>
        )}
        <path d="M0 82 L24 78 L48 70 L72 72 L96 60 L120 52 L144 54 L168 40 L192 32 L216 22 L240 10 L240 100 L0 100 Z" fill="url(#agrad)"/>
        <path d="M0 82 L24 78 L48 70 L72 72 L96 60 L120 52 L144 54 L168 40 L192 32 L216 22 L240 10" fill="none" stroke={VT.gold} strokeWidth="1.8"/>
        <circle cx="240" cy="10" r="3" fill={VT.gold}/>
      </svg>
    </div>
  </div>
);

Object.assign(window, { ExcelChaos, DashboardMockup, AnalyticsMockup });
