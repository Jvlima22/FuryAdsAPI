/* 3 static posts — 1080x1350 (4:5) */

const POST_W = 1080;
const POST_H = 1350;
const SAFE = 100; // safe margin in px (per brief)

// ─── Generic post frame ────────────────────────────────────────────────
const PostFrame = ({ children, bg, style = {} }) => (
  <div style={{
    width: POST_W, height: POST_H, position: 'relative', overflow: 'hidden',
    background: bg, fontFamily: SANS, color: VT.ink, ...style,
  }}>{children}</div>
);

// ─── Footer block reused across posts ──────────────────────────────────
const PostFooter = ({ dark, microcopy = 'Da uva aos dados.', showSave = false, microcolor }) => {
  const cream = dark;
  return (
    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, bottom: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <VintechLogo size={36} color={cream ? VT.cream : VT.ink} gold={VT.gold}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{
          fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 22,
          color: microcolor || VT.gold, letterSpacing: '-0.01em',
        }}>{microcopy}</span>
        {showSave && <IconBookmark size={22} color={VT.gold}/>}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
// POST 1 — Humor / fake-tweet + VS mockup
// ════════════════════════════════════════════════════════════════════════
const Post1Humor = () => (
  <PostFrame bg={VT.cream}>
    <div style={{
      position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none',
      background: 'radial-gradient(circle at 18% 12%, rgba(200,164,76,0.06), transparent 40%)',
    }}/>

    <div style={{
      position: 'absolute', top: 90, left: SAFE, right: SAFE,
      background: '#fff', borderRadius: 22,
      boxShadow: '0 10px 40px -10px rgba(33,10,15,0.18), 0 1px 0 rgba(33,10,15,0.04)',
      padding: '36px 44px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: VT.bordo,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid ' + VT.gold }}>
          <svg viewBox="0 0 40 40" width={38} height={38}>
            <path d="M12 14 L20 28 L28 14" stroke={VT.gold} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="22" r="2.4" fill={VT.gold}/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: VT.ink }}>Vintech</span>
            <svg viewBox="0 0 24 24" width={20} height={20}>
              <path d="M12 2 L14.2 5.6 L18.2 4.5 L19.4 8.6 L23.3 10 L21.5 13.7 L23.3 17.4 L19.4 18.8 L18.2 22.9 L14.2 21.8 L12 25.4 L9.8 21.8 L5.8 22.9 L4.6 18.8 L0.7 17.4 L2.5 13.7 L0.7 10 L4.6 8.6 L5.8 4.5 L9.8 5.6 Z" fill={VT.gold} transform="scale(0.85) translate(2 -1.6)"/>
              <path d="M7.5 12 L10.5 15 L16 9.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 16, color: VT.inkSoft }}>@vintech.app · 2h</div>
        </div>
        <div style={{ fontSize: 28, color: VT.inkSoft, fontWeight: 300, letterSpacing: 2 }}>···</div>
      </div>
      <div style={{
        fontFamily: SANS, fontSize: 31, lineHeight: 1.42, color: VT.ink, fontWeight: 500,
        textWrap: 'pretty',
      }}>
        Dono de vinícola jura que controla safra, estoque, degustação e distribuidor tudo na cabeça e numa <span style={{ background: 'rgba(200,164,76,0.22)', padding: '0 4px', borderRadius: 4 }}>planilha de 2014.</span>
      </div>
      <div style={{
        marginTop: 24, paddingTop: 18, borderTop: '1px solid rgba(33,10,15,0.08)',
        display: 'flex', gap: 36, color: VT.inkSoft, fontSize: 15, fontFamily: SANS,
      }}>
        <span>♡ 2.4k</span><span>↻ 318</span><span>💬 142</span>
      </div>
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 600,
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 0, alignItems: 'center',
    }}>
      <BrowserChrome url="planilha-safras.xlsx" dark={false} radius={14}>
        <ExcelChaos height={340}/>
      </BrowserChrome>
      <div style={{
        width: 78, height: 78, borderRadius: 50, background: VT.bordo, color: VT.gold,
        fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, display: 'flex',
        alignItems: 'center', justifyContent: 'center', margin: '0 -32px', zIndex: 2,
        border: '3px solid ' + VT.cream, boxShadow: '0 8px 20px -6px rgba(33,10,15,0.4)',
      }}>VS</div>
      <BrowserChrome url="app.vintech.com" dark={true} radius={14}>
        <DashboardMockup height={340}/>
      </BrowserChrome>
    </div>

    <PostFooter microcopy="Da uva aos dados."/>
  </PostFrame>
);

// ════════════════════════════════════════════════════════════════════════
// POST 2 — "5 módulos" authority
// ════════════════════════════════════════════════════════════════════════
const Post2Modules = () => (
  <PostFrame bg={VT.bordoDeep}>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial, pointerEvents: 'none' }}/>
    <div style={{
      position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
      background: 'radial-gradient(circle at 80% 90%, rgba(200,164,76,0.5), transparent 50%)',
    }}/>

    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 16,
      color: VT.gold, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44}/> Uma plataforma
    </div>

    <div style={{
      position: 'absolute', top: 250, left: SAFE, right: SAFE,
      fontFamily: DISPLAY, fontWeight: 700, color: VT.gold,
      fontSize: 360, lineHeight: 0.85, letterSpacing: '-0.045em',
    }}>
      5
      <span style={{ fontSize: 96, marginLeft: 28, letterSpacing: '-0.02em' }}>módulos.</span>
    </div>

    <div style={{
      position: 'absolute', top: 720, left: SAFE, right: SAFE,
      fontFamily: SANS, fontSize: 30, lineHeight: 1.45, color: VT.cream, fontWeight: 400,
      textWrap: 'pretty', maxWidth: 760,
    }}>
      <span style={{ color: VT.goldSoft, fontWeight: 500 }}>
        Produtos · Enoturismo · Vendas · Equipe · Analytics.
      </span>
      <br/>
      Tudo que sua vinícola precisa, numa só plataforma — da vindima à última taça.
    </div>

    <div style={{
      position: 'absolute', bottom: 220, left: SAFE, right: SAFE,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      {[
        [IconWine, 'Produtos'],
        [IconMapPin, 'Enoturismo'],
        [IconCart, 'Vendas'],
        [IconUsers, 'Equipe'],
        [IconChart, 'Analytics'],
      ].map(([I, label], i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(200,164,76,0.32)', background: 'rgba(200,164,76,0.06)',
          }}>
            <I size={42} color={VT.gold} stroke={1.7}/>
          </div>
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 14, color: VT.goldSoft, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</span>
        </div>
      ))}
    </div>

    <PostFooter dark microcopy="Da vindima à última taça." showSave/>
  </PostFrame>
);

// ════════════════════════════════════════════════════════════════════════
// POST 3 — Antes vs Depois split
// ════════════════════════════════════════════════════════════════════════
const Post3BeforeAfter = () => (
  <PostFrame bg={VT.cream}>
    <div style={{
      position: 'absolute', top: 88, left: SAFE, right: SAFE,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 1.05,
      letterSpacing: '-0.02em', color: VT.ink, textWrap: 'balance',
    }}>
      Gerir vinícola no escuro<br/>
      <span style={{ color: VT.gold }}>vs.</span> saber exatamente o que vende.
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 340, bottom: 250,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
    }}>
      <div style={{
        background: '#E6E2DB', borderRadius: 18, padding: 36, position: 'relative', overflow: 'hidden',
        filter: 'saturate(0.4)',
      }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, letterSpacing: '0.24em',
          color: '#7a7466', textTransform: 'uppercase', marginBottom: 22 }}>
          Antes
        </div>
        <div style={{ position: 'relative', height: 280, marginBottom: 18 }}>
          {[
            { c: '#F5E68A', t: 'safra 2014?', x: 0, y: 30, r: -6 },
            { c: '#E8C5B0', t: 'pedir 50cx p/ João', x: 110, y: 0, r: 4 },
            { c: '#D8E3B8', t: 'degust. 15h\n— confirmou?', x: 30, y: 130, r: -3 },
            { c: '#F5E68A', t: 'estoque???', x: 170, y: 160, r: 6 },
          ].map((p, i) => (
            <div key={i} style={{
              position: 'absolute', left: p.x, top: p.y, transform: `rotate(${p.r}deg)`,
              width: 130, padding: '14px 14px 18px', background: p.c, color: '#5a4a2a',
              fontFamily: SANS, fontSize: 14, lineHeight: 1.3, whiteSpace: 'pre-line',
              boxShadow: '0 8px 18px -8px rgba(0,0,0,0.3)',
            }}>{p.t}</div>
          ))}
        </div>
        <div style={{
          position: 'absolute', bottom: 20, right: 30, fontFamily: DISPLAY, fontWeight: 700,
          fontSize: 160, color: 'rgba(33,10,15,0.12)', lineHeight: 1,
        }}>?</div>
        <div style={{ fontFamily: SANS, fontSize: 17, color: '#5a554a', lineHeight: 1.45, position: 'relative', zIndex: 1, maxWidth: 280 }}>
          Caderno, planilha, WhatsApp, achismo.
        </div>
      </div>

      <div style={{
        background: VT.gradWine, borderRadius: 18, padding: 36, position: 'relative', overflow: 'hidden',
        boxShadow: '0 30px 80px -30px rgba(33,10,15,0.45)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial, pointerEvents: 'none' }}/>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, letterSpacing: '0.24em',
          color: VT.gold, textTransform: 'uppercase', marginBottom: 22, position: 'relative' }}>
          Depois
        </div>
        <div style={{ position: 'relative' }}>
          <BrowserChrome url="app.vintech.com/analytics" dark radius={10}>
            <AnalyticsMockup height={260}/>
          </BrowserChrome>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 17, color: VT.goldSoft, lineHeight: 1.45, marginTop: 20, position: 'relative' }}>
          Faturamento, margem e tendência — em tempo real.
        </div>
      </div>
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, bottom: 130,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
    }}>
      <div style={{ fontFamily: SANS, fontSize: 22, color: VT.ink, lineHeight: 1.4, maxWidth: 540 }}>
        Comente <span style={{
          fontFamily: DISPLAY, fontWeight: 700, color: VT.bordo, background: 'rgba(200,164,76,0.25)',
          padding: '2px 10px', borderRadius: 6, letterSpacing: '0.04em',
        }}>VINHO</span> e receba um diagnóstico no direct.
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px',
        background: VT.bordo, color: VT.gold, borderRadius: 12,
        fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, letterSpacing: '0.04em',
      }}>
        Direct <IconArrowRight size={18} color={VT.gold}/>
      </div>
    </div>

    <div style={{ position: 'absolute', left: SAFE, bottom: 56 }}>
      <VintechLogo size={28} color={VT.ink}/>
    </div>
  </PostFrame>
);

Object.assign(window, { POST_W, POST_H, SAFE, PostFrame, PostFooter, Post1Humor, Post2Modules, Post3BeforeAfter });
