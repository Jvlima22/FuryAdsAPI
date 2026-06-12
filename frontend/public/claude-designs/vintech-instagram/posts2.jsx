/* 5 posts de boas-vindas / benefícios — Vintech feed warmup
   Formato: 1080x1350 (4:5) — mesma constante POST_W/POST_H/SAFE de posts.jsx */

// ════════════════════════════════════════════════════════════════════════
// POST B1 — Manifesto / Boas-vindas (foto de vinhedo + overlay)
// ════════════════════════════════════════════════════════════════════════
const PostB1Manifesto = () => (
  <PostFrame bg={VT.bordoDeep}>
    <img src={(window.__resources && window.__resources.vineyard) || "assets/vineyard.jpg"} alt="" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      objectFit: 'cover', objectPosition: 'center 40%',
      filter: 'saturate(1.05) contrast(1.05) brightness(0.92)',
    }}/>
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, rgba(48,8,16,0.45) 0%, rgba(48,8,16,0.55) 45%, rgba(48,8,16,0.95) 100%)',
    }}/>
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(200,164,76,0.30), transparent 65%)',
    }}/>

    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 16,
      color: VT.gold, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44}/> Bem-vindo à Vintech
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 540,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 138, lineHeight: 0.92,
      letterSpacing: '-0.035em', color: VT.cream, textWrap: 'balance',
    }}>
      Da vindima<br/>
      <span style={{ color: VT.gold, fontStyle: 'italic', fontWeight: 600 }}>à última taça.</span>
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 1010,
      fontFamily: SANS, fontSize: 30, lineHeight: 1.45, color: VT.goldSoft,
      fontWeight: 400, maxWidth: 720, textWrap: 'pretty',
    }}>
      O sistema integrado de gestão{' '}
      <span style={{ color: VT.cream, fontWeight: 500 }}>para vinícolas modernas.</span>
      <br/>Produtos · Enoturismo · Vendas · Equipe · Analytics.
    </div>

    <PostFooter dark microcopy="Tecnologia à altura da tradição."/>
  </PostFrame>
);

// ════════════════════════════════════════════════════════════════════════
// POST B2 — Pra quem é (4 perfis)
// ════════════════════════════════════════════════════════════════════════
const PostB2WhoFor = () => (
  <PostFrame bg={VT.bordoDeep}>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial }}/>

    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 16,
      color: VT.gold, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44}/> Pra quem é
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 240,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 1.02,
      letterSpacing: '-0.025em', color: VT.cream, textWrap: 'balance',
    }}>
      Feito para quem entende de vinho{' '}
      <span style={{ color: VT.gold, fontStyle: 'italic', fontWeight: 600 }}>
        — e quer entender de números.
      </span>
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 660,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22,
    }}>
      {[
        { I: IconBottle,  label: 'Donos de vinícola',  desc: 'Que fazem 4 funções ao mesmo tempo.' },
        { I: IconGrape,   label: 'Enólogos',           desc: 'Que tratam cada safra como única.' },
        { I: IconMapPin,  label: 'Gestores de enoturismo', desc: 'Que vivem de visita confirmada.' },
        { I: IconCart,    label: 'Distribuidores B2B', desc: 'Que precisam de pedido e prazo claros.' },
      ].map((p, i) => (
        <div key={i} style={{
          background: VT.bordo, border: '1px solid rgba(200,164,76,0.22)',
          borderRadius: 20, padding: '32px 30px', display: 'flex', alignItems: 'flex-start', gap: 20,
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: 16, flexShrink: 0,
            background: 'rgba(200,164,76,0.10)', border: '1px solid rgba(200,164,76,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <p.I size={34} color={VT.gold} stroke={1.6}/>
          </div>
          <div>
            <div style={{
              fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, color: VT.cream,
              letterSpacing: '-0.01em', marginBottom: 6,
            }}>{p.label}</div>
            <div style={{
              fontFamily: SANS, fontSize: 17, lineHeight: 1.4, color: VT.goldSoft,
            }}>{p.desc}</div>
          </div>
        </div>
      ))}
    </div>

    <PostFooter dark microcopy="Vinícola é gente — e dado também."/>
  </PostFrame>
);

// ════════════════════════════════════════════════════════════════════════
// POST B3 — Estoque cego (pergunta + mockup módulo Produtos)
// ════════════════════════════════════════════════════════════════════════
const PostB3StockBlind = () => (
  <PostFrame bg={VT.bordoDeep}>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial }}/>

    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 16,
      color: VT.gold, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44}/> Módulo Produtos
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 230,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 70, lineHeight: 1.02,
      letterSpacing: '-0.025em', color: VT.cream, textWrap: 'balance',
    }}>
      Sabe qual safra está encalhada na sua adega?
    </div>
    <div style={{
      position: 'absolute', left: SAFE, top: 510,
      fontFamily: DISPLAY, fontWeight: 700, fontStyle: 'italic', fontSize: 60,
      letterSpacing: '-0.02em', color: VT.gold,
    }}>
      A Vintech sabe.
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 660,
    }}>
      <BrowserChrome url="app.vintech.com/produtos" dark radius={14}>
        <div style={{
          padding: '24px 28px', background: VT.bordoDeep, color: VT.cream, fontFamily: SANS,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <IconWine size={22} color={VT.gold}/>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22 }}>Estoque por safra</span>
            </div>
            <span style={{
              fontSize: 13, padding: '6px 12px', borderRadius: 99,
              border: '1px solid rgba(200,164,76,0.30)', color: VT.goldSoft,
            }}>9 safras · 12.318 g.</span>
          </div>
          {[
            { y: '2023', n: 'Rosé Brut',        s: 'em alta',    v: '892 g.',   d: '+18%', alert: false },
            { y: '2022', n: 'Chardonnay Reserva', s: 'em alta',  v: '418 g.',   d: '+12%', alert: false },
            { y: '2021', n: 'Pinot Noir',       s: 'estável',    v: '604 g.',   d: '−2%',  alert: false },
            { y: '2019', n: 'Merlot Reserva',   s: 'parado · 9 meses', v: '342 g.', d: '−14%', alert: true },
            { y: '2018', n: 'Cabernet Sauv.',   s: 'em alta',    v: '218 g.',   d: '+9%',  alert: false },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '70px 1fr auto auto', gap: 18, alignItems: 'center',
              padding: '14px 16px', borderRadius: 12, marginBottom: 8,
              background: r.alert ? 'rgba(200,164,76,0.10)' : 'rgba(255,255,255,0.03)',
              border: '1px solid ' + (r.alert ? VT.gold : 'rgba(200,164,76,0.10)'),
            }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: r.alert ? VT.gold : VT.goldSoft }}>{r.y}</div>
              <div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 19, color: VT.cream }}>{r.n}</div>
                <div style={{ fontSize: 13, color: r.alert ? VT.gold : 'rgba(230,210,166,0.55)', marginTop: 2,
                  display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.alert && <span style={{ width: 6, height: 6, borderRadius: 3, background: VT.gold }}/>}
                  {r.s}
                </div>
              </div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: VT.cream }}>{r.v}</div>
              <div style={{
                fontSize: 14, color: r.d.startsWith('−') ? '#E89E9E' : '#9ED4A8', minWidth: 50, textAlign: 'right',
              }}>{r.d}</div>
            </div>
          ))}
        </div>
      </BrowserChrome>
    </div>

    <PostFooter dark microcopy="Da safra ao faturamento." showSave/>
  </PostFrame>
);

// ════════════════════════════════════════════════════════════════════════
// POST B4 — No-show -60% (stat card editorial)
// ════════════════════════════════════════════════════════════════════════
const PostB4NoShow = () => (
  <PostFrame bg={VT.cream}>
    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 16,
      color: VT.bordo, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44} color={VT.bordo}/> Módulo Enoturismo
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 220,
      fontFamily: SANS, fontSize: 26, lineHeight: 1.4, color: VT.ink, maxWidth: 700,
      fontWeight: 400,
    }}>
      Toda cadeira vazia na degustação é receita que evapora. <br/>
      <span style={{ fontFamily: DISPLAY, fontWeight: 600, color: VT.bordo, fontStyle: 'italic' }}>
        Lembrete automático resolve isso.
      </span>
    </div>

    <div style={{
      left: SAFE, right: SAFE, top: 420,
      background: VT.gradWine, borderRadius: 22, padding: '64px 56px',
      position: 'absolute', overflow: 'hidden',
      boxShadow: '0 30px 80px -30px rgba(33,10,15,0.4)',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial, pointerEvents: 'none' }}/>

      <div style={{
        fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, letterSpacing: '0.24em',
        color: VT.goldSoft, textTransform: 'uppercase', marginBottom: 12, position: 'relative',
      }}>
        Redução média de no-show
      </div>

      <div style={{
        fontFamily: DISPLAY, fontWeight: 700, fontSize: 320, lineHeight: 0.85,
        letterSpacing: '-0.045em', color: VT.gold, position: 'relative',
      }}>−60%</div>

      <div style={{
        marginTop: 36, paddingTop: 32, borderTop: '1px solid rgba(200,164,76,0.24)',
        display: 'flex', alignItems: 'center', gap: 32, position: 'relative',
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: 16, flexShrink: 0,
          background: 'rgba(200,164,76,0.10)', border: '1px solid rgba(200,164,76,0.30)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconCalendar size={36} color={VT.gold} stroke={1.6}/>
        </div>
        <div style={{
          fontFamily: SANS, fontSize: 22, lineHeight: 1.45, color: VT.cream, maxWidth: 620,
        }}>
          com confirmações automáticas{' '}
          <span style={{ color: VT.gold, fontWeight: 600 }}>24h e 2h</span>{' '}
          antes da degustação.
        </div>
      </div>
    </div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, bottom: 130,
      fontFamily: SANS, fontSize: 18, color: VT.inkSoft, fontStyle: 'italic',
    }}>
      Dado médio observado em vinícolas com lembrete automatizado.
    </div>

    <div style={{ position: 'absolute', left: SAFE, bottom: 56 }}>
      <VintechLogo size={28} color={VT.ink}/>
    </div>
    <div style={{
      position: 'absolute', right: SAFE, bottom: 64,
      fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 22, color: VT.bordo,
    }}>Da agenda ao faturamento.</div>
  </PostFrame>
);

// ════════════════════════════════════════════════════════════════════════
// POST B5 — Quote autoridade
// ════════════════════════════════════════════════════════════════════════
const PostB5Quote = () => (
  <PostFrame bg={VT.bordoDeep}>
    <div style={{ position: 'absolute', inset: 0, background: VT.gradGoldRadial }}/>

    <div style={{
      position: 'absolute', left: '20%', right: '-10%', bottom: '-8%',
      opacity: 0.35, filter: 'blur(6px) saturate(1.1)',
      transform: 'rotate(-4deg)', pointerEvents: 'none',
    }}>
      <BrowserChrome url="app.vintech.com/analytics" dark radius={14}>
        <AnalyticsMockup height={520}/>
      </BrowserChrome>
    </div>

    <div style={{
      position: 'absolute', top: SAFE + 14, left: SAFE,
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 16,
      color: VT.gold, letterSpacing: '0.28em', textTransform: 'uppercase',
    }}>
      <GoldRule width={44}/> Por que Vintech
    </div>

    <div style={{
      position: 'absolute', left: SAFE - 12, top: 250,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 220, lineHeight: 0.7,
      color: VT.gold, opacity: 0.35,
    }}>“</div>

    <div style={{
      position: 'absolute', left: SAFE, right: SAFE, top: 380,
      fontFamily: DISPLAY, fontWeight: 700, fontSize: 76, lineHeight: 1.05,
      letterSpacing: '-0.025em', color: VT.cream, textWrap: 'balance',
    }}>
      Toda grande vinícola tem uma história.
      <br/>
      <span style={{ color: 'rgba(248,245,241,0.55)' }}>Poucas têm os </span>
      <span style={{ color: VT.gold, fontStyle: 'italic' }}>dados</span>
      <span style={{ color: 'rgba(248,245,241,0.55)' }}> dela.</span>
    </div>

    <div style={{
      position: 'absolute', left: SAFE, bottom: 280,
      display: 'flex', alignItems: 'center', gap: 18,
      fontFamily: DISPLAY, fontWeight: 500, fontSize: 16, letterSpacing: '0.22em',
      color: VT.goldSoft, textTransform: 'uppercase',
    }}>
      <GoldRule width={40}/> Tecnologia à altura da tradição
    </div>

    <PostFooter dark microcopy="Da uva aos dados." showSave/>
  </PostFrame>
);

Object.assign(window, {
  PostB1Manifesto, PostB2WhoFor, PostB3StockBlind, PostB4NoShow, PostB5Quote,
});
