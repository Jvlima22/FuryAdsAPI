/* Reels storyboards — 2 reels, 3 frames each, 9:16 portrait. */

const REEL_W = 1080;
const REEL_H = 1920;

const ReelFrame = ({ children, bg = VT.bordoDeep, style = {} }) => (
  <div style={{
    width: REEL_W, height: REEL_H, position: 'relative', overflow: 'hidden',
    background: bg, fontFamily: SANS, ...style,
  }}>
    {children}
  </div>
);

const ReelCaption = ({ children, position = 'center', maxWidth = 800, color = VT.cream }) => {
  const pos = { center: '50%', upper: '36%', lower: '70%' }[position] || position;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: pos, transform: 'translate(-50%, -50%)',
      width: maxWidth, textAlign: 'center',
      fontFamily: SANS, fontWeight: 600, fontSize: 56, lineHeight: 1.18,
      color, letterSpacing: '-0.01em',
      textShadow: '0 4px 24px rgba(0,0,0,0.55)', textWrap: 'balance',
    }}>{children}</div>
  );
};

const FrameLabel = ({ time, role, side = 'top' }) => (
  <div style={{
    position: 'absolute', top: 60, left: 60, right: 60,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontFamily: DISPLAY, fontWeight: 600, fontSize: 22, letterSpacing: '0.18em',
    color: VT.gold, textTransform: 'uppercase', zIndex: 5,
  }}>
    <span style={{
      background: 'rgba(48,8,16,0.65)', backdropFilter: 'blur(8px)',
      padding: '10px 18px', borderRadius: 99, border: '1px solid rgba(200,164,76,0.30)',
    }}>{time}</span>
    <span style={{
      background: 'rgba(48,8,16,0.65)', backdropFilter: 'blur(8px)',
      padding: '10px 18px', borderRadius: 99, border: '1px solid rgba(200,164,76,0.30)',
    }}>{role}</span>
  </div>
);

const Watermark = () => (
  <div style={{
    position: 'absolute', bottom: 60, left: 60, zIndex: 5,
    display: 'flex', alignItems: 'center', gap: 14,
    background: 'rgba(48,8,16,0.55)', backdropFilter: 'blur(8px)',
    padding: '12px 18px', borderRadius: 99, border: '1px solid rgba(200,164,76,0.22)',
  }}>
    <VintechLogo size={22} color={VT.cream}/>
  </div>
);

const G = ({ children }) => (
  <span style={{ color: VT.gold, fontWeight: 700 }}>{children}</span>
);

// ─── REEL 1 — Humor "Malabarismo da vinícola" ──────────────────────────
const R1F1 = () => (
  <ReelFrame bg="#1a1410">
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(ellipse 60% 40% at 50% 40%, rgba(200,140,80,0.25), transparent 70%),
        linear-gradient(180deg, #2a1d18 0%, #1a1410 60%, #0e0a08 100%)
      `,
    }}/>
    <div style={{ position: 'absolute', left: 140, top: 580, transform: 'rotate(-8deg)' }}>
      <div style={{
        width: 260, height: 480, borderRadius: 36, background: '#0A0608',
        padding: 8, boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)',
        border: '1.5px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 28, background: '#1FAA59',
          padding: 20, color: '#fff', fontFamily: SANS, fontSize: 18, position: 'relative' }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Distribuidor SP</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 20 }}>online</div>
          <div style={{ background: '#fff', color: '#111', padding: '10px 14px',
            borderRadius: 14, fontSize: 14, marginBottom: 8, maxWidth: 200 }}>
            E aí, vc tem 50cx do Merlot 19?
          </div>
          <div style={{ background: '#fff', color: '#111', padding: '10px 14px',
            borderRadius: 14, fontSize: 14, marginBottom: 8, maxWidth: 200 }}>
            preciso amanhã 🍷
          </div>
          <div style={{ background: '#fff', color: '#111', padding: '10px 14px',
            borderRadius: 14, fontSize: 14, marginBottom: 8, maxWidth: 220, fontStyle: 'italic' }}>
            ??
          </div>
          <div style={{ position: 'absolute', top: -4, right: -4,
            background: '#FF3B30', color: '#fff', borderRadius: 24,
            fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, padding: '4px 10px',
            border: '3px solid #1a1410' }}>12</div>
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', right: 60, top: 480, transform: 'rotate(7deg)', width: 520 }}>
      <BrowserChrome url="safras.xlsx" dark={false} radius={10}>
        <ExcelChaos height={420}/>
      </BrowserChrome>
    </div>

    <div style={{ position: 'absolute', right: 80, top: 1080, fontFamily: DISPLAY, fontWeight: 700,
      fontSize: 88, color: VT.gold, opacity: 0.6, textShadow: '0 0 30px rgba(200,164,76,0.5)' }}>
      14:58
    </div>

    <div style={{ position: 'absolute', left: 460, top: 380,
      width: 88, height: 88, borderRadius: 24,
      background: VT.bordo, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1.5px solid ' + VT.gold, boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      transform: 'rotate(-4deg)' }}>
      <IconBell size={44} color={VT.gold}/>
    </div>

    <FrameLabel time="0:00 — 0:03" role="Gancho · Caos"/>
    <Watermark/>
    <ReelCaption position="lower" maxWidth={900}>
      O dono da vinícola tentando gerir <G>safra, estoque, degustação e venda</G> ao mesmo tempo.
    </ReelCaption>
  </ReelFrame>
);

const R1F2 = () => (
  <ReelFrame bg={VT.bordoDeep}>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial }}/>
    <div style={{
      position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%, -50%)',
    }}>
      <PhoneFrame width={620}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <DashboardMockup height={1050}/>
        </div>
      </PhoneFrame>
    </div>
    <FrameLabel time="0:03 — 0:07" role="Resolução"/>
    <Watermark/>
    <ReelCaption position="lower" maxWidth={920}>
      A paz de ver <G>produtos, enoturismo e vendas</G> num lugar só.
    </ReelCaption>
  </ReelFrame>
);

const R1F3 = () => (
  <ReelFrame bg={VT.bordoDeep}>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial }}/>

    <div style={{
      position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)',
      width: 820,
    }}>
      <BrowserChrome url="app.vintech.com/enoturismo" dark radius={18}>
        <div style={{ padding: 36, background: VT.bordoDeep, color: VT.cream, fontFamily: SANS }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <IconCalendar size={28} color={VT.gold}/>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28 }}>Lembretes automáticos</span>
          </div>
          {[
            { t: 'Degustação Reserva', when: 'amanhã · 15h', n: '4 confirmações · 0 no-show', ok: true },
            { t: 'Visita guiada', when: 'amanhã · 10h', n: '6/8 lugares · 2 lembretes enviados', ok: true },
            { t: 'Hospedagem Chalé 02', when: 'sex · 18h', n: 'Pré-pago · confirmado por WhatsApp', ok: true },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px',
              background: 'rgba(200,164,76,0.06)', border: '1px solid rgba(200,164,76,0.20)',
              borderRadius: 14, marginBottom: 12,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 21, background: VT.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><IconCheck size={22} color={VT.bordoDeep}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: VT.cream }}>
                  {r.t} · <span style={{ color: VT.gold }}>{r.when}</span>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 16, color: VT.goldSoft, marginTop: 4 }}>{r.n}</div>
              </div>
            </div>
          ))}
        </div>
      </BrowserChrome>
    </div>

    <FrameLabel time="0:07 — 0:10" role="Cta · Comente VINHO"/>
    <Watermark/>

    <ReelCaption position="lower" maxWidth={920}>
      Pare de perder dinheiro com cadeira vazia na degustação.<br/>
      Comente <G>VINHO</G>.
    </ReelCaption>
  </ReelFrame>
);

// ─── REEL 2 — Autoridade "Do terroir aos dados" ────────────────────────
const R2F1 = () => (
  <ReelFrame bg={VT.bordoDeep}>
    <img src={(window.__resources && window.__resources.vineyard) || "assets/vineyard.jpg"} alt="" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
      objectPosition: 'center', filter: 'saturate(1.1) brightness(0.85)',
    }}/>
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, rgba(48,8,16,0.35) 0%, rgba(48,8,16,0.55) 50%, rgba(48,8,16,0.95) 100%)',
    }}/>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial }}/>

    <div style={{
      position: 'absolute', left: '50%', top: '62%', transform: 'translate(-50%, 0)',
      width: 820, perspective: 1200,
    }}>
      <div style={{ transform: 'rotateX(8deg)' }}>
        <BrowserChrome url="app.vintech.com" dark radius={14}>
          <DashboardMockup height={520}/>
        </BrowserChrome>
      </div>
      <div style={{
        height: 18, background: 'linear-gradient(180deg, #1d1d1f 0%, #0a0a0c 100%)',
        borderRadius: '0 0 18px 18px', boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
      }}/>
      <div style={{
        height: 4, width: 80, background: '#3a3a3c', margin: '0 auto', borderRadius: '0 0 6px 6px',
      }}/>
    </div>

    <FrameLabel time="0:00 — 0:03" role="Abertura · Vinhedo → Notebook"/>
    <Watermark/>
    <ReelCaption position="upper" maxWidth={920}>
      Toda grande vinícola tem uma <G>história</G>.<br/>
      Poucas têm os <G>dados</G> dela.
    </ReelCaption>
  </ReelFrame>
);

const R2F2 = () => (
  <ReelFrame bg={VT.bordoDeep}>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradWine }}/>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial }}/>

    <div style={{ position: 'absolute', inset: 0, padding: '180px 60px 240px' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, height: '100%',
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', height: '100%' }}>
          <img src={(window.__resources && window.__resources.heroWine) || "assets/hero-wine.jpg"} alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover', borderRadius: 24,
            boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)',
            filter: 'saturate(1.1) contrast(1.05)',
          }}/>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24,
            background: 'linear-gradient(180deg, transparent 50%, rgba(48,8,16,0.4) 100%)',
          }}/>
          <div style={{
            position: 'absolute', bottom: 22, left: 22, fontFamily: DISPLAY, fontWeight: 600,
            fontSize: 18, color: VT.gold, letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>· Taça</div>
        </div>
        <div style={{ position: 'relative', height: '100%', display: 'flex',
          flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
          <BrowserChrome url="app.vintech.com/produtos" dark radius={14}>
            <div style={{ height: 220, background: VT.bordoDeep, padding: 20, color: VT.cream, fontFamily: SANS }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <IconWine size={20} color={VT.gold}/>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18 }}>Produtos · Safras</span>
              </div>
              {['Merlot Reserva · 2019', 'Cabernet Sauv. · 2020', 'Chardonnay · 2022'].map((p,i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid rgba(200,164,76,0.14)', fontSize: 16 }}>
                  <span>{p}</span>
                  <span style={{ color: VT.gold }}>{[342, 218, 96][i]} g.</span>
                </div>
              ))}
            </div>
          </BrowserChrome>
          <BrowserChrome url="app.vintech.com/analytics" dark radius={14}>
            <AnalyticsMockup height={300}/>
          </BrowserChrome>
        </div>
      </div>
    </div>

    <FrameLabel time="0:03 — 0:06" role="Timelapse · Taça ↔ Telas"/>
    <Watermark/>
    <ReelCaption position="upper" maxWidth={920}>
      Vintech reúne <G>safra, enoturismo, vendas e equipe</G> numa só plataforma.
    </ReelCaption>
  </ReelFrame>
);

const R2F3 = () => (
  <ReelFrame bg={VT.bordoDeep}>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial }}/>

    <div style={{
      position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%, -50%) rotate(-3deg)',
    }}>
      <PhoneFrame width={580}>
        <div style={{ position: 'absolute', inset: 0, padding: 28, background: VT.bordoDeep,
          color: VT.cream, fontFamily: SANS, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24 }}>Sua vinícola, hoje</span>
            <span style={{ color: VT.gold, fontSize: 18 }}>↗</span>
          </div>
          {[
            ['Faturamento', 'R$ 412k', '+24%'],
            ['Garrafas vendidas', '8.214', '+18%'],
            ['Enoturistas/mês', '326', '+31%'],
            ['Assinantes do clube', '184', '+12%'],
          ].map(([k, v, d], i) => (
            <div key={i} style={{
              background: i === 0 ? VT.bordo : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (i === 0 ? VT.gold : 'rgba(200,164,76,0.16)'),
              borderRadius: 16, padding: '22px 24px',
              boxShadow: i === 0 ? '0 8px 30px -10px rgba(200,164,76,0.5)' : 'none',
            }}>
              <div style={{ fontSize: 14, color: 'rgba(230,210,166,0.65)', textTransform: 'uppercase',
                letterSpacing: '0.16em', marginBottom: 6 }}>{k}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 40,
                  color: i === 0 ? VT.gold : VT.cream }}>{v}</span>
                <span style={{ fontSize: 18, color: '#9ED4A8',
                  display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <IconArrowUp size={16} color="#9ED4A8" stroke={2.2}/>{d}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PhoneFrame>
    </div>

    <FrameLabel time="0:06 — 0:10" role="Encerramento · CTA"/>
    <Watermark/>
    <ReelCaption position="lower" maxWidth={940}>
      Da <G>vindima</G> à <G>última taça</G>, com a precisão que o seu terroir merece.
    </ReelCaption>
  </ReelFrame>
);

Object.assign(window, {
  REEL_W, REEL_H, ReelFrame, ReelCaption, FrameLabel,
  R1F1, R1F2, R1F3, R2F1, R2F2, R2F3,
});
