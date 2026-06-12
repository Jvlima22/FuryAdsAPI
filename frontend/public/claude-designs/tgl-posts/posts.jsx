// ============ POSTS UNITÁRIOS — 7 peças 1080×1350 ============

const PostFrame = ({ children, bg = 'var(--off)', dark = false, style = {} }) => (
  <div className="tgl-stage" style={{
    width: 1080, height: 1350, background: bg, color: dark ? '#fff' : '#041020', ...style
  }}>
    {children}
  </div>
);

// -------- POST 1 — Meme "print de tweet" --------
const Post1 = () => (
  <PostFrame bg="#F8F9FA">
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">ALÍVIO CÔMICO · 01</span>
        <TGLLogo tone="dark" size={16} />
      </div>

      <div style={{ background: '#fff', borderRadius: 20, padding: 56, boxShadow: '0 30px 80px -30px rgba(4,16,32,0.18)', border: '1px solid rgba(4,16,32,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30 }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg, #CDCFD2, #5A5E64)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconUser size={34} stroke="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 26, color: '#041020' }}>Dono Cansado</div>
            <div style={{ fontSize: 20, color: '#5A5E64' }}>@dono_cansado · 4h</div>
          </div>
        </div>

        <div className="h-tight" style={{ fontSize: 50, fontWeight: 500, color: '#041020', lineHeight: 1.18, letterSpacing: '-0.015em' }}>
          meu sistema de gestão são <span style={{ fontWeight: 700 }}>14 grupos de WhatsApp</span>, <span style={{ fontWeight: 700 }}>3 planilhas</span> que ninguém atualiza e <span style={{ fontWeight: 700 }}>a memória da minha recepcionista</span>.
          <div style={{ marginTop: 24, fontWeight: 700, color: '#0F6CBD' }}>e ela vai sair de férias.</div>
        </div>

        <div style={{ display: 'flex', gap: 36, marginTop: 36, color: '#5A5E64', alignItems: 'center', fontSize: 18 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconReply size={22} /> 142</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconRepeat size={22} /> 891</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconHeart size={22} /> 3.2k</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconUpload size={22} /></span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div className="display" style={{ fontSize: 32, color: '#0F6CBD' }}>a gente resolve isso. de verdade.</div>
      </div>
    </div>
  </PostFrame>
);

// -------- POST 2 — Quote de autoridade --------
const Post2 = () => (
  <PostFrame bg="#041020" dark>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">A TESE</span>
        <TGLLogo tone="light" size={16} />
      </div>

      <div style={{ textAlign: 'left' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 220, lineHeight: 0.7, color: '#0F6CBD', marginBottom: 0 }}>"</div>
        <div className="display" style={{ fontSize: 92, color: '#fff', lineHeight: 0.98, letterSpacing: '-0.03em', marginTop: -20 }}>
          Sua empresa não precisa de mais um site.
        </div>
        <div className="display" style={{ fontSize: 92, color: '#fff', lineHeight: 0.98, letterSpacing: '-0.03em', marginTop: 20 }}>
          Precisa de <span className="accent">automação sob medida</span>.
        </div>

        <div style={{ fontSize: 28, color: '#CDCFD2', marginTop: 56, fontWeight: 400, lineHeight: 1.45, maxWidth: 820, letterSpacing: '-0.01em' }}>
          A gente constrói software que trabalha enquanto você dorme.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: 18, color: '#5A5E64', fontWeight: 600, letterSpacing: '0.05em' }}>tgl-solutions.com.br</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 36, height: 1, background: '#0F6CBD' }} />
          <span style={{ fontSize: 18, fontWeight: 600, color: '#CDCFD2', letterSpacing: '0.05em' }}>02</span>
        </div>
      </div>
    </div>
  </PostFrame>
);

// -------- POST 3 — Antes vs Depois de processo --------
const Post3 = () => (
  <PostFrame bg="#fff">
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '80px 100px 40px' }}>
        <span className="overline">MANUAL PRÁTICO · 03</span>
        <div className="display" style={{ fontSize: 70, color: '#041020', marginTop: 22, letterSpacing: '-0.025em', lineHeight: 1 }}>
          Como a automação <br/>muda o seu dia.
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(4,16,32,0.08)' }}>
        <div style={{ background: '#EFEFEF', padding: '50px 50px 60px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: '#fff', border: '1px solid rgba(4,16,32,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconSheet size={22} stroke="#5A5E64" />
            </div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 18, fontWeight: 700, letterSpacing: '0.18em', color: '#5A5E64' }}>ANTES</div>
          </div>
          {[
            'Anota no caderno.',
            'Confere planilha.',
            'Manda no zap.',
            'Esquece.',
            'Cliente cobra.',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, color: '#5A5E64', fontSize: 28, fontWeight: 500, lineHeight: 1.25 }}>
              <span style={{ color: '#9aa1ab', fontWeight: 700, marginTop: 2 }}>·</span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#041020', padding: '50px 100px 60px 50px', color: '#fff', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: '#0F6CBD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconZap size={22} stroke="#fff" />
            </div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 18, fontWeight: 700, letterSpacing: '0.18em', color: '#0F6CBD' }}>DEPOIS</div>
          </div>
          {[
            'Sistema registra.',
            'Avisa sozinho.',
            'Cliente recebe.',
            'Você dorme.',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 28, fontWeight: 500, lineHeight: 1.25 }}>
              <IconCheck size={24} stroke="#0F6CBD" strokeWidth={2.5} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#041020', padding: '32px 100px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1E2122' }}>
        <div style={{ fontSize: 24, color: '#CDCFD2', fontWeight: 500 }}>
          Escreva <span className="grifo" style={{ color: '#041020' }}>SOFTWARE</span> no direct.
        </div>
        <TGLLogo tone="light" size={16} />
      </div>
    </div>
  </PostFrame>
);

// -------- POST 4 — Bastidor "Como nasce um SaaS" --------
const Post4 = () => (
  <PostFrame bg="#041020" dark>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">PROVA · 04</span>
        <TGLLogo tone="light" size={16} />
      </div>

      <div style={{ marginTop: 40 }}>
        <div className="display" style={{ fontSize: 74, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1 }}>
          Não falamos que <br/>sabemos fazer.
        </div>
        <div className="display" style={{ fontSize: 74, color: '#0F6CBD', letterSpacing: '-0.025em', lineHeight: 1, marginTop: 14 }}>
          A gente já fez.
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 30, marginTop: 60 }}>
        {[
          { name: 'TLS Barber', tag: 'gestão de barbearia', kind: 'phone', screen: <ScreenBarber /> },
          { name: 'Captu', tag: 'captação & gestão de leads*', kind: 'phone', screen: <ScreenCaptu /> },
          { name: 'Vintech', tag: 'gestão de vinícola', kind: 'web', screen: <ScreenVintech /> },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ height: 380, display: 'flex', alignItems: 'center' }}>
              {s.kind === 'phone' ? (
                <IPhoneMockup width={195}>{s.screen}</IPhoneMockup>
              ) : (
                <div style={{ width: 280, transform: 'rotate(-1deg)' }}>
                  <BrowserMockup>{s.screen}</BrowserMockup>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="display" style={{ fontSize: 28, color: '#0F6CBD' }}>{s.name}</div>
              <div style={{ fontSize: 17, color: '#CDCFD2', marginTop: 6 }}>{s.tag}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #1E2122', paddingTop: 26, marginTop: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 26, color: '#fff', fontWeight: 500 }}>
          O próximo pode ser o do <span className="accent" style={{ fontWeight: 700 }}>seu negócio</span>.
        </div>
        <div style={{ fontSize: 13, color: '#5A5E64' }}>* descrição a confirmar</div>
      </div>
    </div>
  </PostFrame>
);

// -------- POST 5 — Dado / estatística --------
const Post5 = () => (
  <PostFrame bg="#F8F9FA">
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">DADO · 05</span>
        <TGLLogo tone="dark" size={16} />
      </div>

      <div>
        <div style={{ fontSize: 28, color: '#5A5E64', marginBottom: 16, fontWeight: 500 }}>até</div>
        <div className="display" style={{ fontSize: 320, color: '#0F6CBD', lineHeight: 0.82, letterSpacing: '-0.04em' }}>
          8h
        </div>
        <div style={{ fontSize: 36, color: '#041020', fontWeight: 700, marginTop: 8, letterSpacing: '-0.02em' }}>
          por semana.
        </div>

        <div style={{ height: 1, background: 'rgba(4,16,32,0.1)', margin: '50px 0', width: 200 }} />

        <div className="h-tight" style={{ fontSize: 36, color: '#041020', maxWidth: 820, fontWeight: 500, lineHeight: 1.25 }}>
          é quanto um time perde repetindo tarefa manual que um sistema faria <span style={{ fontWeight: 700 }}>em segundos</span>.
        </div>
        <div style={{ fontSize: 15, color: '#5A5E64', marginTop: 18 }}>* estimativa — varia por operação.</div>
      </div>

      <div style={{ borderTop: '1px solid rgba(4,16,32,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 24, color: '#041020' }}>
          Quanto vale o seu tempo? Escreva <span className="grifo">EVOLUIR</span>.
        </div>
        <IconArrowRight size={28} stroke="#0F6CBD" />
      </div>
    </div>
  </PostFrame>
);

// -------- POST 6 — Meme minimalista tweet only --------
const Post6 = () => (
  <PostFrame bg="#041020" dark>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">ALÍVIO CÔMICO · 06</span>
        <TGLLogo tone="light" size={16} />
      </div>

      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="display" style={{ fontSize: 86, color: '#fff', lineHeight: 1.02, letterSpacing: '-0.025em' }}>
          "Depois eu organizo<br/>isso num sistema."
        </div>
        <div style={{ marginTop: 72 }}>
          <div className="display" style={{ fontSize: 48, color: '#0F6CBD', letterSpacing: '-0.02em' }}>
            — você, há 3 anos.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 32, height: 1, background: '#1E2122' }} />
        <span style={{ fontSize: 16, color: '#5A5E64', letterSpacing: '0.2em', textTransform: 'uppercase' }}>TGL Solutions</span>
        <span style={{ width: 32, height: 1, background: '#1E2122' }} />
      </div>
    </div>
  </PostFrame>
);

// -------- POST 7 — Quote-tese versão marca --------
const Post7 = () => (
  <PostFrame bg="#F8F9FA">
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">A MARCA · 07</span>
        <TGLLogo tone="dark" size={16} />
      </div>

      <div>
        <div className="display" style={{ fontSize: 104, color: '#041020', letterSpacing: '-0.035em', lineHeight: 0.98 }}>
          Muito mais que uma
        </div>
        <div className="display" style={{ fontSize: 104, color: '#041020', letterSpacing: '-0.035em', lineHeight: 0.98, marginTop: 10, position: 'relative', display: 'inline-block' }}>
          software house.
          <span style={{ position: 'absolute', left: 0, right: 0, bottom: -14, height: 6, background: '#0F6CBD', borderRadius: 3 }} />
        </div>

        <div style={{ fontSize: 28, color: '#5A5E64', marginTop: 70, maxWidth: 820, lineHeight: 1.45, fontWeight: 500 }}>
          Automações, dashboards, CRM e apps <span style={{ color: '#041020', fontWeight: 700 }}>sob medida</span> — feitos para o seu negócio, não para o template de ninguém.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(4,16,32,0.08)', paddingTop: 32 }}>
        <div style={{ fontSize: 24, color: '#041020', fontWeight: 600 }}>
          Faça um orçamento <span style={{ color: '#0F6CBD' }}>→</span> link na bio.
        </div>
        <div style={{ fontSize: 18, color: '#5A5E64', fontWeight: 600, letterSpacing: '0.05em' }}>tgl-solutions.com.br</div>
      </div>
    </div>
  </PostFrame>
);

Object.assign(window, { Post1, Post2, Post3, Post4, Post5, Post6, Post7 });
