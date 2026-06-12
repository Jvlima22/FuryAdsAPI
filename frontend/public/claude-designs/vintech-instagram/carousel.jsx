/* Carousel — 6 slides, 1080x1350 each, "5 sinais que sua vinícola perde dinheiro" */

const CAR_W = 1080;
const CAR_H = 1350;

const Slide = ({ children, bg, slideNum, total = 6, tear = 'mid', dark = true, style = {} }) => {
  const tearOffsets = { mid: 0, 'tilt-up': -10, 'tilt-down': 14 };
  const offY = tearOffsets[tear] ?? 0;
  return (
    <div style={{
      width: CAR_W, height: CAR_H, position: 'relative', overflow: 'hidden',
      background: bg, fontFamily: SANS, color: dark ? VT.cream : VT.ink, ...style,
    }}>
      {children}
      <svg viewBox={`0 0 ${CAR_W} 120`} width={CAR_W} height={120} preserveAspectRatio="none"
        style={{ position: 'absolute', left: 0, bottom: 80, pointerEvents: 'none' }}>
        <path d={`M0 60 L${CAR_W} ${60 + offY}`} stroke={VT.gold} strokeWidth="2" fill="none"/>
      </svg>
      {slideNum && (
        <div style={{
          position: 'absolute', right: SAFE, top: SAFE,
          fontFamily: DISPLAY, fontWeight: 500, fontSize: 16, letterSpacing: '0.2em',
          color: dark ? 'rgba(230,210,166,0.6)' : 'rgba(33,10,15,0.5)',
        }}>
          {String(slideNum).padStart(2,'0')} <span style={{ opacity: 0.5 }}>/ {String(total).padStart(2,'0')}</span>
        </div>
      )}
    </div>
  );
};

const CSlide1 = () => (
  <Slide bg={VT.bordoDeep} slideNum={1} tear="tilt-down">
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial, pointerEvents: 'none' }}/>
    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 15,
      color: VT.gold, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44}/> Manual prático · 1 / 6
    </div>

    <div style={{
      position: 'absolute', left: SAFE, top: 260,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 108, lineHeight: 0.96,
      letterSpacing: '-0.03em', color: VT.cream, maxWidth: 760, textWrap: 'balance',
    }}>
      5 sinais de que sua vinícola{' '}
      <span style={{ color: VT.gold }}>perde dinheiro</span>{' '}
      sem perceber.
    </div>

    <div style={{
      position: 'absolute', right: SAFE, bottom: 280,
      display: 'flex', alignItems: 'flex-end', gap: 32,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <IconWine size={88} color={VT.gold} stroke={1.4}/>
        <IconChart size={88} color={VT.goldSoft} stroke={1.4}/>
      </div>
    </div>

    <div style={{
      position: 'absolute', right: SAFE, bottom: 150, display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, letterSpacing: '0.22em',
      color: VT.gold, textTransform: 'uppercase',
    }}>
      arraste <IconArrowRight size={28} color={VT.gold}/>
    </div>

    <div style={{ position: 'absolute', left: SAFE, bottom: 56 }}>
      <VintechLogo size={28} color={VT.cream}/>
    </div>
  </Slide>
);

const SinalSlide = ({ num, total, eyebrow, headline, body, accentLine, icon: I, mockup, slideNum, tear }) => (
  <Slide bg={VT.bordo} slideNum={slideNum} tear={tear}>
    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 15,
      color: VT.gold, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44}/> {eyebrow}
    </div>

    <div style={{
      position: 'absolute', right: -30, top: 140, fontFamily: DISPLAY, fontWeight: 700,
      fontSize: 540, color: 'rgba(200,164,76,0.10)', lineHeight: 0.85, letterSpacing: '-0.05em',
    }}>{num}</div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 320,
      background: VT.bordoDeep, borderRadius: 22, padding: '56px 56px 48px',
      border: '1px solid rgba(200,164,76,0.20)',
      boxShadow: '0 30px 80px -30px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 36 }}>
        <div style={{
          width: 70, height: 70, borderRadius: 16, background: 'rgba(200,164,76,0.10)',
          border: '1px solid rgba(200,164,76,0.30)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I size={36} color={VT.gold} stroke={1.6}/>
        </div>
        <div style={{
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, letterSpacing: '0.22em',
          color: VT.gold, textTransform: 'uppercase',
        }}>Sinal nº{num}</div>
      </div>
      <div style={{
        fontFamily: DISPLAY, fontWeight: 700, fontSize: 56, lineHeight: 1.08,
        letterSpacing: '-0.02em', color: VT.cream, textWrap: 'balance',
      }}>
        {headline}
      </div>
      {body && (
        <div style={{
          marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(200,164,76,0.16)',
          fontFamily: SANS, fontSize: 22, lineHeight: 1.55, color: VT.goldSoft, maxWidth: 740,
        }}>{body}</div>
      )}
      {accentLine && (
        <div style={{
          marginTop: 28, display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, letterSpacing: '0.2em',
          color: VT.gold, textTransform: 'uppercase',
        }}>
          <span style={{ width: 28, height: 1, background: VT.gold }}/>
          Custo invisível
        </div>
      )}
    </div>

    {mockup && (
      <div style={{ position: 'absolute', left: SAFE, right: SAFE, bottom: 220 }}>
        {mockup}
      </div>
    )}

    <div style={{ position: 'absolute', left: SAFE, bottom: 56 }}>
      <VintechLogo size={26} color={VT.cream}/>
    </div>
  </Slide>
);

const CSlide2 = () => (
  <SinalSlide
    slideNum={2} num="01" tear="tilt-up"
    eyebrow="Sinal 1 · Estoque"
    icon={IconBottle}
    headline={<>Você não sabe qual <span style={{ color: VT.gold }}>safra está encalhada</span> no estoque.</>}
    body="Garrafas que envelhecem na adega são capital parado. Sem visão por safra, o Merlot 2019 vira saldo invisível — até o cliente perguntar."
    accentLine
  />
);

const CSlide3 = () => (
  <SinalSlide
    slideNum={3} num="02" tear="tilt-down"
    eyebrow="Sinal 2 · Enoturismo"
    icon={IconCalendar}
    headline={<>Degustações e visitas viram <span style={{ color: VT.gold }}>no-show</span> porque não há lembrete automático.</>}
    body="Cadeira vazia na degustação é receita que evapora. Confirmação 24h e 2h antes reduz no-show em até 60%."
    accentLine
  />
);

const CSlide4 = () => (
  <SinalSlide
    slideNum={4} num="03" tear="tilt-up"
    eyebrow="Sinal 3 · Distribuidores"
    icon={IconPhone}
    headline={<>Pedidos de <span style={{ color: VT.gold }}>distribuidor B2B</span> controlados no WhatsApp e no caderno.</>}
    body="Conversa que some, pedido perdido, valor combinado que ninguém lembra. B2B sem registro central é margem que escorre todo mês."
    accentLine
  />
);

const CSlide5 = () => (
  <Slide bg={VT.bordo} slideNum={5} tear="tilt-down">
    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 15,
      color: VT.gold, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44}/> Sinais 4 & 5 · Receita
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 240,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 56, lineHeight: 1.08,
      letterSpacing: '-0.02em', color: VT.cream, textWrap: 'balance',
    }}>
      E os dois que mais doem na conta no fim do mês.
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 460,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
    }}>
      {[
        { n: '04', I: IconUsers, h: 'Sem clube de assinatura recorrente.',
          b: 'MRR é o que separa vinícola estável de vinícola que vive da próxima vindima.' },
        { n: '05', I: IconChart, h: 'Decisão no achismo, sem KPIs em tempo real.',
          b: 'Sem dashboard, você descobre o que vende quando o estoque já acabou.' },
      ].map((s, i) => (
        <div key={i} style={{
          background: VT.bordoDeep, borderRadius: 20, padding: 38,
          border: '1px solid rgba(200,164,76,0.20)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 12, background: 'rgba(200,164,76,0.10)',
              border: '1px solid rgba(200,164,76,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <s.I size={28} color={VT.gold} stroke={1.6}/>
            </div>
            <div style={{
              fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: '0.22em',
              color: VT.gold, textTransform: 'uppercase',
            }}>Sinal nº{s.n}</div>
          </div>
          <div style={{
            fontFamily: DISPLAY, fontWeight: 700, fontSize: 32, lineHeight: 1.12,
            letterSpacing: '-0.02em', color: VT.cream, textWrap: 'balance',
          }}>{s.h}</div>
          <div style={{
            marginTop: 22, fontFamily: SANS, fontSize: 17, lineHeight: 1.5,
            color: VT.goldSoft,
          }}>{s.b}</div>
        </div>
      ))}
    </div>

    <div style={{ position: 'absolute', left: SAFE, bottom: 56 }}>
      <VintechLogo size={26} color={VT.cream}/>
    </div>
  </Slide>
);

const CSlide6 = () => (
  <Slide bg={VT.gold} slideNum={6} tear="mid" dark={false}>
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse 60% 50% at 5% 0%, rgba(87,25,35,0.25), transparent 60%)',
    }}/>

    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 15,
      color: VT.bordoDeep, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44} color={VT.bordoDeep}/> Próximo passo
    </div>

    <div style={{
      position: 'absolute', left: SAFE, top: 220, right: SAFE,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 104, lineHeight: 0.95,
      letterSpacing: '-0.03em', color: VT.bordoDeep, textWrap: 'balance',
    }}>
      Pronto para parar de perder dinheiro?
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 720,
      display: 'flex', flexDirection: 'column', gap: 28,
    }}>
      <div style={{
        background: VT.bordoDeep, color: VT.gold, padding: '32px 44px',
        borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 20px 60px -20px rgba(33,10,15,0.4)',
      }}>
        <span style={{
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: '0.05em',
        }}>QUERO ORGANIZAR MINHA VINÍCOLA</span>
        <IconArrowRight size={36} color={VT.gold} stroke={2}/>
      </div>
      <div style={{
        fontFamily: SANS, fontSize: 26, lineHeight: 1.45, color: VT.bordoDeep, textWrap: 'pretty',
      }}>
        Comente <span style={{
          fontFamily: DISPLAY, fontWeight: 700, color: VT.gold, background: VT.bordoDeep,
          padding: '2px 12px', borderRadius: 6, letterSpacing: '0.04em',
        }}>VINHO</span> que enviamos o acesso no seu direct.
      </div>
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, bottom: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <VintechLogo size={28} color={VT.bordoDeep} gold={VT.bordoDeep}/>
      <span style={{
        fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 22, color: VT.bordoDeep,
      }}>Da vindima à última taça.</span>
    </div>
  </Slide>
);

Object.assign(window, { CAR_W, CAR_H, CSlide1, CSlide2, CSlide3, CSlide4, CSlide5, CSlide6 });
