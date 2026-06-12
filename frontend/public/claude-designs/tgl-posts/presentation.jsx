// ============ APRESENTAÇÃO DA EMPRESA ============
// 3 posts unitários + 2 carrosséis (usa CFrame de carousels.jsx)

const PresFrame = ({ children, bg = '#F8F9FA', dark = false, style = {} }) =>
<div className="tgl-stage" style={{
  width: 1080, height: 1350, background: bg, color: dark ? '#fff' : '#041020', ...style
}}>
    {children}
  </div>;

// POST P1 — QUEM SOMOS
const PostP1 = () =>
<PresFrame bg="#041020" dark>
    <svg style={{ position: 'absolute', inset: 0, opacity: 0.04 }} width="100%" height="100%">
      <defs>
        <pattern id="grid-p1" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-p1)" />
    </svg>

    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">APRESENTAÇÃO · 01</span>
        <TGLLogo tone="light" size={16} />
      </div>

      <div>
        <div style={{ fontSize: 28, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 36 }}>
          Quem somos
        </div>
        <div className="display" style={{ fontSize: 88, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.96 }}>
          A software house
        </div>
        <div className="display" style={{ fontSize: 88, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.96, marginTop: 10, width: "880px", height: "84px" }}>
          que <span className="grifo" style={{ lineHeight: "0", letterSpacing: "-2.6px", opacity: "1", padding: "0px 16px", borderRadius: "10px", fontSize: "88px" }}>não vende site</span>
        </div>
        <div className="display" style={{ fontSize: 88, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.96, marginTop: 14 }}>
          — vende <span className="accent">solução.</span>
        </div>

        <div style={{ fontSize: 30, color: '#CDCFD2', marginTop: 56, maxWidth: 880, lineHeight: 1.4, fontWeight: 500, letterSpacing: '-0.005em' }}>
          A TGL Solutions constrói automações, dashboards e SaaS sob medida — para empresas que cansaram de planilha, retrabalho e dependência de pessoa.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: 20, color: '#5A5E64', fontWeight: 600, letterSpacing: '0.05em' }}>
          tgl-solutions.com.br
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 36, height: 1, background: '#0F6CBD' }} />
          <span style={{ fontSize: 18, color: '#CDCFD2', fontWeight: 600, letterSpacing: '0.05em' }}>P1</span>
        </div>
      </div>
    </div>
  </PresFrame>;

// POST P2 — O QUE FAZEMOS
const PostP2 = () =>
<PresFrame bg="#F8F9FA">
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">APRESENTAÇÃO · 02</span>
        <TGLLogo tone="dark" size={16} />
      </div>

      <div>
        <div style={{ fontSize: 28, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24 }}>
          O que fazemos
        </div>
        <div className="display" style={{ fontSize: 80, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98 }}>
          Quatro frentes.
        </div>
        <div className="display" style={{ fontSize: 80, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98, marginTop: 8 }}>
          Um objetivo: <span className="accent">automatizar.</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 56 }}>
          {[
        { i: IconCode, k: '01', t: 'Software sob medida', b: 'Sistemas web e mobile feitos para o seu processo, não para o template de ninguém.' },
        { i: IconZap, k: '02', t: 'Automação de processos', b: 'Tira do humano tudo que é repetitivo. Integrações que conversam entre sistemas.' },
        { i: IconBar, k: '03', t: 'Dashboards & BI', b: 'A informação certa, no momento certo. Decisão com dado, não achismo.' },
        { i: IconLayers, k: '04', t: 'Produtos SaaS', b: 'Tem ideia de produto? A gente valida, constrói e coloca pra rodar.' }].
        map((s, i) =>
        <div key={i} style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid rgba(4,16,32,0.06)',
          padding: 26,
          display: 'flex', flexDirection: 'column', gap: 14
        }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: '#041020', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                  <s.i size={24} stroke="#0F6CBD" />
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, color: 'rgba(4,16,32,0.12)' }}>{s.k}</div>
              </div>
              <div>
                <div className="display" style={{ fontSize: 26, color: '#041020', letterSpacing: '-0.015em', lineHeight: 1.05 }}>{s.t}</div>
                <div style={{ fontSize: 16, color: '#5A5E64', marginTop: 10, lineHeight: 1.4, fontWeight: 500 }}>{s.b}</div>
              </div>
            </div>
        )}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(4,16,32,0.08)', paddingTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 22, color: '#041020', fontWeight: 500 }}>
          Tudo isso conversa. <span style={{ color: '#0F6CBD', fontWeight: 700 }}>Aí está a diferença.</span>
        </div>
        <span style={{ fontSize: 16, color: '#5A5E64', fontWeight: 600 }}>P2</span>
      </div>
    </div>
  </PresFrame>;

// POST P3 — POR QUE TGL
const PostP3 = () =>
<PresFrame bg="#fff">
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '90px 100px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <span className="overline">APRESENTAÇÃO · 03</span>
          <TGLLogo tone="dark" size={16} />
        </div>
        <div style={{ fontSize: 28, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 22 }}>
          Por que TGL
        </div>
        <div className="display" style={{ fontSize: 76, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98 }}>
          Construímos os <span className="accent">nossos</span><br />
          antes de construir o <span style={{ fontWeight: 700 }}>seu</span>.
        </div>
      </div>

      <div style={{ flex: 1, background: '#041020', padding: '50px 100px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, color: '#5A5E64', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 30 }}>
          Provas no ar
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
          {[
        { n: 'TLS Barber', t: 'gestão de barbearia', tag: 'Mobile · iOS/Android' },
        { n: 'Captu', t: 'captação & gestão de leads*', tag: 'Web app' },
        { n: 'Vintech', t: 'gestão de vinícola', tag: 'SaaS multi-tenant' }].
        map((s, i) =>
        <div key={i} style={{
          padding: 24,
          borderRadius: 14,
          background: 'rgba(15,108,189,0.08)',
          border: '1px solid rgba(15,108,189,0.25)'
        }}>
              <div className="display" style={{ fontSize: 26, color: '#fff', letterSpacing: '-0.015em' }}>{s.n}</div>
              <div style={{ fontSize: 14, color: '#CDCFD2', marginTop: 6, lineHeight: 1.35 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: '#0F6CBD', fontWeight: 700, marginTop: 14, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.tag}</div>
            </div>
        )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 36 }}>
          {[
        { k: '3', l: 'SaaS próprios', sub: 'construídos do zero' },
        { k: 'sob medida', l: 'cada projeto', sub: 'zero template' },
        { k: 'do MVP', l: 'até a escala', sub: 'a gente acompanha' }].
        map((it, i) =>
        <div key={i} style={{ borderTop: '1px solid #1E2122', paddingTop: 18 }}>
              <div className="display" style={{ fontSize: 28, color: '#0F6CBD', letterSpacing: '-0.02em', lineHeight: 1 }}>{it.k}</div>
              <div style={{ fontSize: 16, color: '#fff', fontWeight: 600, marginTop: 6 }}>{it.l}</div>
              <div style={{ fontSize: 13, color: '#5A5E64', marginTop: 2 }}>{it.sub}</div>
            </div>
        )}
        </div>
      </div>

      <div style={{ background: '#fff', padding: '32px 100px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(4,16,32,0.08)' }}>
        <div style={{ fontSize: 22, color: '#041020', fontWeight: 500 }}>
          Próximo SaaS é o <span style={{ color: '#0F6CBD', fontWeight: 700 }}>seu</span>? Escreva <span className="grifo">EVOLUIR</span>.
        </div>
        <span style={{ fontSize: 16, color: '#5A5E64', fontWeight: 600 }}>P3</span>
      </div>
    </div>
  </PresFrame>;

// CARROSSEL E — Conheça a TGL (7 slides)
const E1 = () =>
<CFrame dark bg="linear-gradient(135deg, #041020 0%, #0F6CBD 100%)" total={7} idx={0}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline" style={{ color: '#fff', opacity: 0.85 }}>CARROSSEL · E · APRESENTAÇÃO</span>
        <TGLLogo tone="gradient" size={16} />
      </div>
      <div>
        <div style={{ fontSize: 22, color: '#fff', opacity: 0.7, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28 }}>
          ↓ arraste para conhecer
        </div>
        <div className="display" style={{ fontSize: 110, color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.94 }}>
          Conheça
        </div>
        <div className="display" style={{ fontSize: 110, color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.94, marginTop: 8 }}>
          a TGL.
        </div>
        <div style={{ fontSize: 30, color: '#fff', opacity: 0.85, marginTop: 36, fontWeight: 500, maxWidth: 700, lineHeight: 1.35 }}>
          A software house que constrói o que sua empresa precisa — sem template, sem rodeio.
        </div>
      </div>
      <div />
    </div>
  </CFrame>;

const E2 = () =>
<CFrame total={7} idx={1}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">A TESE</span>
        <TGLLogo tone="dark" size={16} />
      </div>
      <div>
        <div style={{ fontSize: 22, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24 }}>
          o que a gente acredita
        </div>
        <div className="display" style={{ fontSize: 70, color: '#041020', letterSpacing: '-0.028em', lineHeight: 1.0 }}>
          Empresa que cresce é
        </div>
        <div className="display" style={{ fontSize: 70, color: '#041020', letterSpacing: '-0.028em', lineHeight: 1.0, marginTop: 10 }}>
          empresa que <span className="accent">automatiza</span>.
        </div>
        <div style={{ fontSize: 28, color: '#5A5E64', marginTop: 56, maxWidth: 820, lineHeight: 1.45, fontWeight: 500 }}>
          Site, planilha, grupo de WhatsApp — não escalam com você. Sistema sob medida, sim.
        </div>
        <div style={{ marginTop: 40, padding: 24, background: '#fff', borderRadius: 14, border: '1px solid rgba(4,16,32,0.08)', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: '#0F6CBD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconZap size={24} stroke="#fff" />
          </div>
          <div className="h-tight" style={{ fontSize: 24, color: '#041020', fontWeight: 600, lineHeight: 1.3 }}>
            Software é alavanca. A gente projeta a alavanca certa pro seu negócio.
          </div>
        </div>
      </div>
      <div />
    </div>
  </CFrame>;

const E3 = () =>
<CFrame total={7} idx={2}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">O QUE FAZEMOS</span>
        <TGLLogo tone="dark" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 72, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98 }}>
          4 frentes.
        </div>
        <div className="display" style={{ fontSize: 72, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98, marginTop: 8 }}>
          Tudo conectado.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 56 }}>
          {[
        { i: IconCode, n: '01', t: 'Software sob medida', b: 'web e mobile · do design ao deploy' },
        { i: IconZap, n: '02', t: 'Automação de processos', b: 'integrações · bots · workflows' },
        { i: IconBar, n: '03', t: 'Dashboards & BI', b: 'KPIs · gráficos · alertas em tempo real' },
        { i: IconLayers, n: '04', t: 'Produtos SaaS', b: 'do MVP à versão multi-tenant' }].
        map((s, i) =>
        <div key={i} style={{
          padding: 20, background: '#fff', borderRadius: 14,
          border: '1px solid rgba(4,16,32,0.06)',
          display: 'grid', gridTemplateColumns: '60px 1fr 60px', alignItems: 'center', gap: 18
        }}>
              <div style={{ width: 60, height: 60, borderRadius: 12, background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.i size={26} stroke="#041020" />
              </div>
              <div>
                <div className="display" style={{ fontSize: 28, color: '#041020', letterSpacing: '-0.015em' }}>{s.t}</div>
                <div style={{ fontSize: 17, color: '#5A5E64', marginTop: 4, fontWeight: 500 }}>{s.b}</div>
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, color: '#0F6CBD', textAlign: 'right' }}>{s.n}</div>
            </div>
        )}
        </div>
      </div>
      <div />
    </div>
  </CFrame>;

const E4 = () =>
<CFrame dark bg="#041020" total={7} idx={3}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">COMO TRABALHAMOS</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 70, color: '#fff', letterSpacing: '-0.028em', lineHeight: 0.98 }}>
          Do briefing
        </div>
        <div className="display" style={{ fontSize: 70, color: '#fff', letterSpacing: '-0.028em', lineHeight: 0.98, marginTop: 10 }}>
          ao <span className="accent">software no ar</span>.
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 60, alignItems: 'stretch' }}>
          {[
        { n: '01', t: 'Diagnóstico', b: 'Entender a dor e mapear processo.' },
        { n: '02', t: 'Escopo enxuto', b: 'Menor sistema que já entrega valor.' },
        { n: '03', t: 'Build', b: 'Sprints curtos com feedback contínuo.' },
        { n: '04', t: 'Vida no ar', b: 'Deploy, treinamento, suporte.' }].
        map((s, i, arr) =>
        <React.Fragment key={i}>
              <div style={{
            flex: 1, padding: 22,
            background: 'rgba(15,108,189,0.10)',
            border: '1px solid rgba(15,108,189,0.25)',
            borderRadius: 14,
            display: 'flex', flexDirection: 'column', gap: 10
          }}>
                <div className="display" style={{ fontSize: 38, color: '#0F6CBD', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.n}</div>
                <div className="display" style={{ fontSize: 22, color: '#fff', letterSpacing: '-0.015em' }}>{s.t}</div>
                <div style={{ fontSize: 15, color: '#CDCFD2', lineHeight: 1.35, fontWeight: 500 }}>{s.b}</div>
              </div>
              {i < arr.length - 1 &&
          <div style={{ display: 'flex', alignItems: 'center', color: '#0F6CBD' }}>
                  <IconArrowRight size={20} />
                </div>
          }
            </React.Fragment>
        )}
        </div>
        <div style={{ fontSize: 22, color: '#CDCFD2', marginTop: 40, fontWeight: 500 }}>
          Cada etapa com prazo claro, escopo travado, sem surpresa no fim.
        </div>
      </div>
      <div />
    </div>
  </CFrame>;

const E5 = () =>
<CFrame total={7} idx={4} bg="#F8F9FA">
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">PROVAS NO AR · OS 3 SAAS</span>
        <TGLLogo tone="dark" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 64, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98 }}>
          O que dizemos<br />está <span className="accent">no ar</span>.
        </div>
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {[
          { name: 'TLS Barber', tag: 'gestão de barbearia', img: window.__resources.shotTlsBarber },
          { name: 'Vintech', tag: 'gestão de vinícola', img: window.__resources.shotVintech }].
          map((s, i) =>
          <div key={i} style={{
            padding: 24, background: '#fff', borderRadius: 16,
            border: '1px solid rgba(4,16,32,0.06)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14
          }}>
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <img src={s.img} alt={s.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="display" style={{ fontSize: 24, color: '#041020', letterSpacing: '-0.015em' }}>{s.name}</div>
                  <div style={{ fontSize: 14, color: '#5A5E64', marginTop: 4, fontWeight: 500 }}>{s.tag}</div>
                </div>
              </div>
          )}
          </div>
          <div style={{
            marginTop: 18, padding: 28, background: '#fff', borderRadius: 16,
            border: '1px solid rgba(4,16,32,0.06)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
          }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={window.__resources.shotCaptu} alt="Captu" style={{ maxWidth: '100%', maxHeight: 380, width: 'auto', objectFit: 'contain', display: 'block', borderRadius: 6 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="display" style={{ fontSize: 24, color: '#041020', letterSpacing: '-0.015em' }}>Captu</div>
              <div style={{ fontSize: 14, color: '#5A5E64', marginTop: 4, fontWeight: 500 }}>leads &amp; captação*</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32, fontSize: 22, color: '#5A5E64', fontWeight: 500 }}>
          Três SaaS construídos do zero. Em operação. Servindo clientes reais.
        </div>
      </div>
      <div />
    </div>
  </CFrame>;

const E6 = () =>
<CFrame total={7} idx={5}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">PARA QUEM</span>
        <TGLLogo tone="dark" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 70, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98 }}>
          A TGL é para
        </div>
        <div className="display" style={{ fontSize: 70, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98, marginTop: 10 }}>
          quem cansou de…
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 56 }}>
          {[
        { i: IconSheet, t: 'Planilha que não escala.' },
        { i: IconWhatsApp, t: 'Gestão por grupo de WhatsApp.' },
        { i: IconClock, t: 'Retrabalho que come o mês.' },
        { i: IconUser, t: 'Dependência de “a pessoa que sabe”.' },
        { i: IconBar, t: 'Tomar decisão sem dado.' },
        { i: IconZap, t: 'Comprar template caro que não serve.' }].
        map((it, i) =>
        <div key={i} style={{
          padding: 22, background: '#fff', borderRadius: 14,
          border: '1px solid rgba(4,16,32,0.08)',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <it.i size={22} stroke="#0F6CBD" />
              </div>
              <div style={{ fontSize: 22, color: '#041020', fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{it.t}</div>
            </div>
        )}
        </div>
        <div style={{ marginTop: 36, padding: 22, borderLeft: '3px solid #0F6CBD', paddingLeft: 24 }}>
          <div className="h-tight" style={{ fontSize: 28, color: '#041020', fontWeight: 600, lineHeight: 1.3 }}>
            Se você se reconheceu em <span style={{ color: '#0F6CBD' }}>2 ou mais</span>, dá pra resolver.
          </div>
        </div>
      </div>
      <div />
    </div>
  </CFrame>;

const E7 = () =>
<CFrame dark bg="#041020" total={7} idx={6} last>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">PRIMEIRO PASSO</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 88, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98 }}>
          Vamos conversar.
        </div>
        <div style={{ marginTop: 60, padding: 44, background: 'rgba(15,108,189,0.10)', border: '1px solid rgba(15,108,189,0.3)', borderRadius: 16 }}>
          <div style={{ fontSize: 24, color: '#CDCFD2', marginBottom: 14, fontWeight: 500 }}>Diagnóstico gratuito · 30min · sem pegadinha:</div>
          <div className="display" style={{ fontSize: 60, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            Escreva <span className="grifo">EVOLUIR</span><br />no direct.
          </div>
        </div>
        <div style={{ marginTop: 36, display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ fontSize: 18, color: '#5A5E64' }}>ou</span>
          <span style={{ fontSize: 22, color: '#fff', fontWeight: 600 }}>
            faça um orçamento <span style={{ color: '#0F6CBD' }}>→</span> link na bio
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: 18, color: '#5A5E64', fontWeight: 600, letterSpacing: '0.05em' }}>tgl-solutions.com.br</div>
      </div>
    </div>
  </CFrame>;

// CARROSSEL F — catálogo de serviços (6 slides)
const F1 = () =>
<CFrame dark bg="#041020" total={6} idx={0}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">CARROSSEL · F · SERVIÇOS</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div style={{ fontSize: 22, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 28 }}>
          o catálogo
        </div>
        <div className="display" style={{ fontSize: 96, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
          O que a gente
        </div>
        <div className="display" style={{ fontSize: 96, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.95, marginTop: 10 }}>
          <span className="accent">entrega</span> — em detalhe.
        </div>
        <div style={{ fontSize: 28, color: '#CDCFD2', marginTop: 40, maxWidth: 760, lineHeight: 1.4, fontWeight: 500 }}>
          4 serviços principais + o que cada um inclui na prática. Sem firula.
        </div>
      </div>
      <div />
    </div>
  </CFrame>;

const FService = ({ idx, total, n, Icon, title, sub, includes, deliv }) =>
<CFrame total={total} idx={idx} bg="#F8F9FA">
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">SERVIÇO · {n}</span>
        <TGLLogo tone="dark" size={16} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, marginBottom: 28 }}>
          <div className="display" style={{ fontSize: 240, color: '#0F6CBD', lineHeight: 0.78, letterSpacing: '-0.05em' }}>{n}</div>
          <div style={{ paddingBottom: 26 }}>
            <div style={{ width: 100, height: 100, borderRadius: 20, background: '#041020', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={44} stroke="#0F6CBD" />
            </div>
          </div>
        </div>
        <div className="display" style={{ fontSize: 64, color: '#041020', letterSpacing: '-0.025em', lineHeight: 0.98 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, color: '#5A5E64', marginTop: 14, fontWeight: 500, lineHeight: 1.4, maxWidth: 800 }}>
          {sub}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginTop: 40 }}>
          <div style={{ padding: 22, background: '#fff', borderRadius: 14, border: '1px solid rgba(4,16,32,0.06)' }}>
            <div style={{ fontSize: 13, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>
              o que está incluso
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {includes.map((it, i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 18, color: '#041020', fontWeight: 500, lineHeight: 1.3 }}>
                  <IconCheck size={18} stroke="#0F6CBD" strokeWidth={2.5} />
                  <span>{it}</span>
                </div>
            )}
            </div>
          </div>
          <div style={{ padding: 22, background: '#041020', borderRadius: 14, color: '#fff' }}>
            <div style={{ fontSize: 13, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>
              entrega típica
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {deliv.map((d, i) =>
            <div key={i}>
                  <div style={{ fontSize: 12, color: '#5A5E64', fontWeight: 600, letterSpacing: '0.1em' }}>{d.k}</div>
                  <div style={{ fontSize: 18, color: '#fff', fontWeight: 600, marginTop: 2 }}>{d.v}</div>
                </div>
            )}
            </div>
          </div>
        </div>
      </div>
      <div />
    </div>
  </CFrame>;

const F2 = () => <FService idx={1} total={6} n="01" Icon={IconCode}
  title="Software sob medida."
  sub="Sistemas web e mobile feitos pra resolver o seu processo — não o template de ninguém."
  includes={['Descoberta + UX', 'Design da interface', 'Front + back-end', 'Banco de dados', 'Deploy + monitoramento']}
  deliv={[{ k: 'PRAZO', v: '6–16 semanas' }, { k: 'FORMATO', v: 'web · iOS · Android' }, { k: 'GARANTIA', v: '60 dias pós-go-live' }]} />;

const F3 = () => <FService idx={2} total={6} n="02" Icon={IconZap}
  title="Automação de processos."
  sub="Tira do humano tudo que é repetitivo. Integrações que conversam entre seus sistemas."
  includes={['Mapeamento do fluxo', 'Integração entre apps', 'Bots de WhatsApp / e-mail', 'Workflows automáticos', 'Painel de controle']}
  deliv={[{ k: 'PRAZO', v: '3–8 semanas' }, { k: 'STACK', v: 'n8n · Make · custom' }, { k: 'RESULTADO', v: 'horas/semana de volta' }]} />;

const F4 = () => <FService idx={3} total={6} n="03" Icon={IconBar}
  title="Dashboards & BI."
  sub="A informação certa, no momento certo. Decisão com dado — não com achismo de fim de mês."
  includes={['Conexão a fontes (CRM, ERP, planilha)', 'Modelagem de KPIs', 'Painel web responsivo', 'Alertas automáticos', 'Acesso por perfil/equipe']}
  deliv={[{ k: 'PRAZO', v: '4–10 semanas' }, { k: 'FORMATO', v: 'web app + mobile' }, { k: 'UPDATE', v: 'tempo real ou diário' }]} />;

const F5 = () => <FService idx={4} total={6} n="04" Icon={IconLayers}
  title="Produtos SaaS."
  sub="Tem ideia de produto? A gente valida, constrói o MVP e leva até a versão multi-cliente."
  includes={['Validação de mercado', 'MVP enxuto', 'Arquitetura multi-tenant', 'Cobrança recorrente', 'Roadmap de produto']}
  deliv={[{ k: 'PRAZO', v: 'MVP em 8–12 sem.' }, { k: 'MODELO', v: 'parceria ou contratação' }, { k: 'PROVA', v: '3 SaaS no ar' }]} />;

const F6 = () =>
<CFrame dark bg="#041020" total={6} idx={5} last>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">PRIMEIRO PASSO</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 78, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98 }}>
          Não sabe qual desses
        </div>
        <div className="display" style={{ fontSize: 78, color: '#0F6CBD', letterSpacing: '-0.03em', lineHeight: 0.98, marginTop: 10 }}>
          é o seu caso?
        </div>
        <div style={{ fontSize: 28, color: '#CDCFD2', marginTop: 40, fontWeight: 500, lineHeight: 1.4, maxWidth: 800 }}>
          Tudo bem. A gente descobre junto — em uma conversa de 30 minutos. Sem cobrar, sem vender no susto.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 50 }}>
          <div style={{ padding: 30, background: 'rgba(15,108,189,0.12)', border: '1px solid rgba(15,108,189,0.35)', borderRadius: 14 }}>
            <div style={{ fontSize: 14, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>direct rápido</div>
            <div className="display" style={{ fontSize: 38, color: '#fff', letterSpacing: '-0.02em', marginTop: 10 }}>
              Escreva <span className="grifo">EVOLUIR</span>
            </div>
          </div>
          <div style={{ padding: 30, background: '#fff', borderRadius: 14, color: '#041020' }}>
            <div style={{ fontSize: 14, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>orçamento</div>
            <div className="display" style={{ fontSize: 38, color: '#041020', letterSpacing: '-0.02em', marginTop: 10 }}>
              Link na bio <span style={{ color: '#0F6CBD' }}>→</span>
            </div>
          </div>
        </div>
      </div>
      <div />
    </div>
  </CFrame>;

Object.assign(window, {
  PostP1, PostP2, PostP3,
  E1, E2, E3, E4, E5, E6, E7,
  F1, F2, F3, F4, F5, F6
});
