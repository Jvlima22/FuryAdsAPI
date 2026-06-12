// ============ REELS (storyboards) + STORIES ============

const ReelFrame = ({ children }) => (
  <div className="tgl-stage" style={{
    width: 1500, height: 1920, background: '#F0EEE9',
    fontFamily: 'DM Sans, sans-serif',
  }}>
    {children}
  </div>
);

const KeyframePhone = ({ children, label, time }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <div style={{ flexShrink: 0 }}>
      <div style={{
        width: 56, padding: '8px 0',
        background: '#fff', borderRadius: 10, textAlign: 'center',
        border: '1px solid rgba(4,16,32,0.08)'
      }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: '#0F6CBD', lineHeight: 1 }}>{time}</div>
        <div style={{ fontSize: 9, color: '#5A5E64', marginTop: 2 }}>seg</div>
      </div>
    </div>
    <div style={{ width: 200, height: 356, borderRadius: 22, background: '#0a0f1a', padding: 6, border: '1px solid #1d2c4a', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <div style={{ borderRadius: 18, overflow: 'hidden', width: '100%', height: '100%', background: '#fff', position: 'relative' }}>
        {children}
      </div>
    </div>
    <div style={{ flex: 1, paddingLeft: 8 }}>
      <div style={{ fontSize: 11, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  </div>
);

const KFRosto = ({ caption, mood = 'normal' }) => (
  <div style={{ height: '100%', background: 'linear-gradient(180deg, #2a2520, #0e0a06)', position: 'relative' }}>
    <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 110, height: 110, borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 30%, #8a7560, #3a2e22 70%, transparent)',
      boxShadow: '0 0 40px rgba(255,187,54,0.18)' }} />
    <div style={{ position: 'absolute', top: '52%', left: '50%', transform: 'translate(-50%, 0)',
      width: 180, height: 110, borderRadius: '60% 60% 12% 12%/80% 80% 12% 12%',
      background: 'linear-gradient(180deg, #1f1b16, #0a0807)' }} />
    <div style={{ position: 'absolute', bottom: 36, left: 14, right: 14, textAlign: 'center' }}>
      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#fff', fontSize: 16, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
        {caption}
      </div>
    </div>
    {mood === 'chaos' && (
      <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9, color: '#fff', background: 'rgba(255,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>!</div>
    )}
  </div>
);

const KFTela = ({ children, caption }) => (
  <div style={{ height: '100%', background: '#041020', position: 'relative' }}>
    <div style={{ position: 'absolute', inset: '18px 14px 90px' }}>{children}</div>
    {caption && (
      <div style={{ position: 'absolute', bottom: 28, left: 14, right: 14, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#fff', fontSize: 14, lineHeight: 1.05 }}>{caption}</div>
      </div>
    )}
  </div>
);

const KFCard = ({ headline, cta }) => (
  <div style={{ height: '100%', background: 'linear-gradient(135deg, #041020 0%, #0F6CBD 100%)', position: 'relative', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div style={{ fontSize: 9, color: '#fff', opacity: 0.7, letterSpacing: '0.15em', textTransform: 'uppercase' }}>TGL</div>
    <div>
      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#fff', fontSize: 18, lineHeight: 1.0, letterSpacing: '-0.02em' }}>
        {headline}
      </div>
      {cta && (
        <div style={{ marginTop: 14, fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: '#041020', background: '#fff', padding: '6px 10px', borderRadius: 999, display: 'inline-block' }}>
          {cta}
        </div>
      )}
    </div>
    <div style={{ fontSize: 9, color: '#fff', opacity: 0.5 }}>tgl-solutions.com.br</div>
  </div>
);

const ScriptPanel = ({ id, title, hook, beats, audio, cta }) => (
  <div style={{ flex: 1, paddingLeft: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div>
      <div style={{ fontSize: 14, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        Reel {id}
      </div>
      <div className="display" style={{ fontSize: 36, color: '#041020', letterSpacing: '-0.02em', lineHeight: 1.02, marginTop: 6 }}>
        {title}
      </div>
    </div>
    <div style={{ background: '#041020', color: '#fff', padding: 16, borderRadius: 12 }}>
      <div style={{ fontSize: 11, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em' }}>GANCHO (0–3s)</div>
      <div style={{ fontSize: 16, marginTop: 4, lineHeight: 1.35, fontWeight: 500 }}>"{hook}"</div>
    </div>
    <div>
      <div style={{ fontSize: 11, color: '#5A5E64', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>roteiro</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {beats.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#041020', lineHeight: 1.4 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#0F6CBD', fontSize: 12, minWidth: 50 }}>{b.t}</span>
            <span style={{ fontWeight: 500 }}>{b.v}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <div style={{ padding: 12, background: '#fff', border: '1px solid rgba(4,16,32,0.08)', borderRadius: 10 }}>
        <div style={{ fontSize: 10, color: '#5A5E64', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>áudio</div>
        <div style={{ fontSize: 12, color: '#041020', marginTop: 4, fontWeight: 500, lineHeight: 1.3 }}>{audio}</div>
      </div>
      <div style={{ padding: 12, background: '#fff', border: '1px solid rgba(4,16,32,0.08)', borderRadius: 10 }}>
        <div style={{ fontSize: 10, color: '#5A5E64', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>cta final</div>
        <div style={{ fontSize: 12, color: '#041020', marginTop: 4, fontWeight: 600 }}>
          Escreva <span className="grifo" style={{ fontSize: 12 }}>{cta}</span>
        </div>
      </div>
    </div>
  </div>
);

const StoryboardLayout = ({ id, title, hook, beats, audio, cta, keyframes }) => (
  <ReelFrame>
    <div style={{ position: 'absolute', inset: 0, padding: 60, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <span className="overline">REEL {id} · 1080×1920</span>
        <TGLLogo tone="dark" size={14} />
      </div>
      <div style={{ flex: 1, display: 'flex', gap: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 4 }}>
          {keyframes.map((kf, i) => (
            <KeyframePhone key={i} time={kf.time} label={kf.label}>
              {kf.content}
            </KeyframePhone>
          ))}
        </div>
        <ScriptPanel id={id} title={title} hook={hook} beats={beats} audio={audio} cta={cta} />
      </div>
      <div style={{ borderTop: '1px solid rgba(4,16,32,0.08)', paddingTop: 14, marginTop: 10, fontSize: 11, color: '#5A5E64', textAlign: 'center' }}>
        storyboard · 4 keyframes · 18s · legenda palavra-a-palavra com keyword em #0F6CBD
      </div>
    </div>
  </ReelFrame>
);

const Reel1 = () => (
  <StoryboardLayout
    id="01"
    title='Humor — "o malabarismo do empreendedor"'
    hook="POV: você é o dono, o financeiro, o atendimento e o TI."
    audio="trilha cômica acelerada → corte seco para silêncio + clique macio no final"
    cta="SOFTWARE"
    beats={[
      { t: '0–3s', v: 'Rosto: cercado de papéis, celular tocando, expressão exausta.' },
      { t: '3–8s', v: 'Cortes rápidos: WhatsApp acumulando, planilha rolando, caderno virando.' },
      { t: '8–15s', v: 'Tela limpa de sistema substitui o caos. Tudo organizado. Som de "respiro".' },
      { t: '15–18s', v: 'Card final navy + CTA grifado.' },
    ]}
    keyframes={[
      { time: '0–3', label: 'Gancho (rosto)', content: <KFRosto caption='"POV: você é tudo ao mesmo tempo."' mood="chaos" /> },
      { time: '3–8', label: 'Caos (b-roll)', content: (
        <KFTela caption="o caos do dia a dia">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, height: '100%' }}>
            <div style={{ background: '#25D366', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconWhatsApp size={32} stroke="#fff" />
            </div>
            <div style={{ background: '#1e7e3c', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconSheet size={32} stroke="#fff" />
            </div>
            <div style={{ background: '#FFBB36', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBook size={32} stroke="#041020" />
            </div>
            <div style={{ background: '#5A5E64', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBell size={32} stroke="#fff" />
            </div>
          </div>
        </KFTela>
      ) },
      { time: '8–15', label: 'Solução (tela)', content: <KFTela caption="um sistema. um lugar."><div style={{ background: '#fff', borderRadius: 8, padding: 6, height: '100%' }}><div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%' }}><ScreenGenericDash /></div></div></KFTela> },
      { time: '15–18', label: 'CTA', content: <KFCard headline='"o malabarismo deixa de ser seu."' cta="SOFTWARE" /> },
    ]}
  />
);

const Reel2 = () => (
  <StoryboardLayout
    id="02"
    title="Autoridade — bastidores da software house"
    hook="Todo mundo diz que faz sistema."
    audio="trilha minimal tech, low-fi; corte seco entre telas; pulso final no CTA"
    cta="EVOLUIR"
    beats={[
      { t: '0–3s', v: 'Rosto direto na câmera, tom firme.' },
      { t: '3–10s', v: 'Telas reais (não maquetes): TLS Barber, Captu, Vintech em loop suave.' },
      { t: '10–16s', v: 'Mockup genérico "seu sistema aqui" surge no lugar.' },
      { t: '16–18s', v: 'Card navy + CTA.' },
    ]}
    keyframes={[
      { time: '0–3', label: 'Gancho', content: <KFRosto caption='"todo mundo DIZ que faz."' /> },
      { time: '3–10', label: 'Prova (3 SaaS)', content: (
        <KFTela caption="3 SaaS nossos, no ar.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
            <div style={{ flex: 1, background: '#fff', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%' }}><ScreenBarber /></div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%' }}><ScreenCaptu /></div>
            </div>
            <div style={{ flex: 1, background: '#fff', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left', width: '222%' }}><ScreenVintech /></div>
            </div>
          </div>
        </KFTela>
      ) },
      { time: '10–16', label: 'Seu sistema aqui', content: (
        <KFTela caption="o próximo pode ser o seu.">
          <div style={{ background: '#fff', border: '2px dashed #0F6CBD', borderRadius: 8, height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
            <IconCode size={28} stroke="#0F6CBD" />
            <div style={{ fontSize: 11, color: '#0F6CBD', fontWeight: 700 }}>seu sistema</div>
          </div>
        </KFTela>
      ) },
      { time: '16–18', label: 'CTA', content: <KFCard headline='"a gente já fez. e pode fazer o seu."' cta="EVOLUIR" /> },
    ]}
  />
);

const Reel3 = () => (
  <StoryboardLayout
    id="03"
    title="Educativo — 3 processos pra automatizar"
    hook="3 coisas que sua empresa ainda faz na mão (e não devia)."
    audio="batida tech mid-tempo; tick metálico a cada item; corte limpo"
    cta="SOFTWARE"
    beats={[
      { t: '0–3s', v: 'Rosto + texto sobreposto: gancho.' },
      { t: '3–7s', v: '1 — Agendamento. Tela: cliente marca, sistema confirma.' },
      { t: '7–11s', v: '2 — Cobrança. Tela: Pix automático + lembrete.' },
      { t: '11–15s', v: '3 — Relatório. Dashboard pronto, sem montar planilha.' },
      { t: '15–18s', v: 'CTA.' },
    ]}
    keyframes={[
      { time: '0–3', label: 'Gancho', content: <KFRosto caption='"3 coisas que ainda fazem na mão."' /> },
      { time: '3–7', label: '1 · Agenda', content: (
        <KFTela caption="01 · agendamento sozinho">
          <div style={{ background: '#fff', borderRadius: 8, padding: 12, height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <IconCalendar size={28} stroke="#0F6CBD" />
            {['09:00 — confirmado','11:30 — confirmado','14:00 — pendente'].map((t,i) => (
              <div key={i} style={{ fontSize: 10, color: '#041020', padding: 6, background: '#F8F9FA', borderRadius: 6, fontWeight: 600 }}>{t}</div>
            ))}
          </div>
        </KFTela>
      ) },
      { time: '7–11', label: '2 · Cobrança', content: (
        <KFTela caption="02 · pix + lembrete automático">
          <div style={{ background: '#fff', borderRadius: 8, padding: 12, height: '100%', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <IconWallet size={32} stroke="#0F6CBD" />
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, color: '#041020' }}>R$ 480</div>
            <div style={{ fontSize: 9, color: '#0F6CBD', fontWeight: 700, padding: '4px 8px', background: 'rgba(15,108,189,0.1)', borderRadius: 999 }}>pago via Pix ✓</div>
          </div>
        </KFTela>
      ) },
      { time: '11–15', label: '3 · Relatório', content: (
        <KFTela caption="03 · dashboard pronto">
          <div style={{ background: '#fff', borderRadius: 8, padding: 6, height: '100%', overflow: 'hidden' }}>
            <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%' }}><ScreenGenericDash /></div>
          </div>
        </KFTela>
      ) },
    ]}
  />
);

const Reel4 = () => (
  <StoryboardLayout
    id="04"
    title="Antes/Depois — caos vs sistema"
    hook="Isso é antes. Olha o depois."
    audio="silêncio inicial + 'whoosh' na transição; trilha sobe no depois"
    cta="SOFTWARE"
    beats={[
      { t: '0–3s', v: 'Rosto + tela tremida da planilha caótica ao lado.' },
      { t: '3–9s', v: 'Split horizontal: planilha → dashboard limpo (corta no swipe).' },
      { t: '9–15s', v: 'Navegação suave pelo dashboard (KPIs, gráfico).' },
      { t: '15–18s', v: 'CTA.' },
    ]}
    keyframes={[
      { time: '0–3', label: 'Antes (planilha)', content: (
        <KFTela caption='"isso é antes."'>
          <div style={{ background: '#fff', borderRadius: 6, height: '100%', overflow: 'hidden' }}>
            <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%' }}><ScreenChaosSheet /></div>
          </div>
        </KFTela>
      ) },
      { time: '3–9', label: 'Transição', content: (
        <div style={{ height: '100%', background: '#041020', position: 'relative', display: 'flex' }}>
          <div style={{ flex: 1, background: '#EFEFEF', clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconSheet size={26} stroke="#5A5E64" />
          </div>
          <div style={{ flex: 1, position: 'absolute', right: 0, top: 0, bottom: 0, width: '55%', clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconBar size={26} stroke="#0F6CBD" />
          </div>
          <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', fontFamily: 'Space Grotesk', fontWeight: 700, color: '#fff', fontSize: 14 }}>→</div>
        </div>
      ) },
      { time: '9–15', label: 'Depois (sistema)', content: (
        <KFTela caption='"depois. mesma info, zero dor."'>
          <div style={{ background: '#fff', borderRadius: 6, height: '100%', overflow: 'hidden' }}>
            <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%' }}><ScreenGenericDash /></div>
          </div>
        </KFTela>
      ) },
      { time: '15–18', label: 'CTA', content: <KFCard headline='"tudo num lugar. atualizado sozinho."' cta="SOFTWARE" /> },
    ]}
  />
);

const Reel5 = () => (
  <StoryboardLayout
    id="05"
    title='ASMR tech — "sensação de paz"'
    hook="(sem gancho de rosto · faceless do início ao fim)"
    audio="trilha lo-fi calma; sons de UI macios (clique, pop, swipe); zero voz"
    cta="EVOLUIR"
    beats={[
      { t: '0–6s', v: 'Close em UI: toque arrasta card, encaixa com som de "pop".' },
      { t: '6–12s', v: 'Transição suave entre telas; dados se organizando sozinhos (números rolando).' },
      { t: '12–16s', v: 'Vista de todo o dashboard, calmo, tudo em ordem.' },
      { t: '16–18s', v: 'Logo navy + CTA.' },
    ]}
    keyframes={[
      { time: '0–6', label: 'Toque · pop', content: (
        <KFTela caption="como é ter um sistema que só… funciona.">
          <div style={{ background: '#fff', borderRadius: 8, height: '100%', padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: 28, background: '#F8F9FA', borderRadius: 6 }} />
            <div style={{ height: 28, background: '#0F6CBD', borderRadius: 6, boxShadow: '0 4px 10px rgba(15,108,189,0.3)' }} />
            <div style={{ height: 28, background: '#F8F9FA', borderRadius: 6 }} />
            <div style={{ height: 28, background: '#F8F9FA', borderRadius: 6 }} />
          </div>
        </KFTela>
      ) },
      { time: '6–12', label: 'Números rolando', content: (
        <KFTela caption="">
          <div style={{ background: '#fff', borderRadius: 8, height: '100%', padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 9, color: '#5A5E64', fontWeight: 700, letterSpacing: '0.15em' }}>RECEITA · MÊS</div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 32, color: '#0F6CBD' }}>R$ 42.180</div>
            <div style={{ fontSize: 10, color: '#0F6CBD', fontWeight: 600 }}>+12,4% ↑</div>
          </div>
        </KFTela>
      ) },
      { time: '12–16', label: 'Tudo em ordem', content: (
        <KFTela caption="">
          <div style={{ background: '#fff', borderRadius: 8, height: '100%', overflow: 'hidden' }}>
            <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%' }}><ScreenGenericDash /></div>
          </div>
        </KFTela>
      ) },
      { time: '16–18', label: 'Logo + CTA', content: <KFCard headline='"só funciona."' cta="EVOLUIR" /> },
    ]}
  />
);

const Reel6 = () => (
  <StoryboardLayout
    id="06"
    title='Humor — "a planilha vingativa"'
    hook="quando você abre a planilha que não atualiza há 2 meses:"
    audio="trilha de suspense → quebra cômica → trilha calma no final"
    cta="SOFTWARE"
    beats={[
      { t: '0–3s', v: 'Rosto encarando a tela com medo.' },
      { t: '3–9s', v: 'Zoom dramático em células bagunçadas (#REF, datas erradas, duplicidades).' },
      { t: '9–15s', v: 'Sistema limpo organizado — alívio. Música muda.' },
      { t: '15–18s', v: 'CTA.' },
    ]}
    keyframes={[
      { time: '0–3', label: 'Gancho (medo)', content: <KFRosto caption='"a planilha que não atualiza há 2 meses:"' mood="chaos" /> },
      { time: '3–9', label: 'Zoom no caos', content: (
        <KFTela caption='"ela guarda rancor."'>
          <div style={{ background: '#fff', borderRadius: 6, height: '100%', overflow: 'hidden' }}>
            <div style={{ transform: 'scale(0.7)', transformOrigin: 'center', width: '143%', height: '143%' }}><ScreenChaosSheet /></div>
          </div>
        </KFTela>
      ) },
      { time: '9–15', label: 'Alívio (sistema)', content: (
        <KFTela caption='"ou troca por um sistema sem ressentimento."'>
          <div style={{ background: '#fff', borderRadius: 6, height: '100%', overflow: 'hidden' }}>
            <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%' }}><ScreenGenericDash /></div>
          </div>
        </KFTela>
      ) },
      { time: '15–18', label: 'CTA', content: <KFCard headline='"sistema não tem rancor."' cta="SOFTWARE" /> },
    ]}
  />
);

// ============ STORIES — 4 frames 1080×1920 ============
const StoryFrame = ({ children, bg = '#041020' }) => (
  <div className="tgl-stage" style={{ width: 1080, height: 1920, background: bg, color: '#fff' }}>
    <div style={{ position: 'absolute', top: 40, left: 40, right: 40, display: 'flex', gap: 4, zIndex: 5 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 2, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#fff', width: i === 1 ? '60%' : '0%' }} />
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', top: 60, left: 40, right: 40, display: 'flex', alignItems: 'center', gap: 12, zIndex: 5 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0F6CBD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14 }}>T</div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>tglsolutions</div>
      <div style={{ fontSize: 16, opacity: 0.7 }}>· 2h</div>
    </div>
    {children}
  </div>
);

const Story1 = () => (
  <StoryFrame bg="#041020">
    <div style={{ position: 'absolute', inset: '180px 80px 200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 50 }}>
      <div>
        <div className="overline" style={{ color: '#0F6CBD', fontSize: 18 }}>1 · ENQUETE</div>
        <div className="display" style={{ fontSize: 72, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1, marginTop: 20 }}>
          Como você gerencia<br/>seu negócio<br/>hoje?
        </div>
      </div>
      <div style={{ display: 'flex', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ flex: 1, background: '#fff', color: '#041020', padding: '28px 20px', textAlign: 'center', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 26 }}>
          📊 Planilha + WhatsApp
        </div>
        <div style={{ flex: 1, background: '#0F6CBD', color: '#fff', padding: '28px 20px', textAlign: 'center', fontFamily: 'DM Sans', fontWeight: 700, fontSize: 26 }}>
          ⚙ Tenho sistema
        </div>
      </div>
    </div>
    <div className="ig-bottom" style={{ textAlign: 'center', fontSize: 18, opacity: 0.7 }}>
      Toque pra responder ↓
    </div>
  </StoryFrame>
);

const Story2 = () => (
  <StoryFrame bg="#F8F9FA">
    <div style={{ position: 'absolute', inset: '180px 80px 200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
      <div className="overline" style={{ color: '#0F6CBD', fontSize: 18 }}>2 · RESPOSTA</div>
      <div>
        <div className="display" style={{ fontSize: 96, color: '#041020', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
          80%
        </div>
        <div className="display" style={{ fontSize: 56, color: '#041020', letterSpacing: '-0.025em', lineHeight: 1.0, marginTop: 16 }}>
          começa assim.
        </div>
      </div>
      <div style={{ height: 2, background: '#0F6CBD', width: 80 }} />
      <div className="h-tight" style={{ fontSize: 38, color: '#5A5E64', maxWidth: 800, fontWeight: 500, lineHeight: 1.25 }}>
        O problema é <span style={{ color: '#041020', fontWeight: 700 }}>continuar</span>.
      </div>
    </div>
    <div className="ig-bottom" style={{ color: '#041020', fontSize: 20, fontWeight: 600 }}>
      Mande → para ver a saída
    </div>
  </StoryFrame>
);

const Story3 = () => (
  <StoryFrame bg="#041020">
    <div style={{ position: 'absolute', inset: '180px 80px 200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
      <div>
        <div className="overline" style={{ color: '#0F6CBD', fontSize: 18 }}>3 · PROVA</div>
        <div className="display" style={{ fontSize: 60, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1, marginTop: 20 }}>
          A gente constrói<br/>o sistema <span className="accent">sob medida</span>.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ flex: '0 0 auto' }}>
          <IPhoneMockup width={200}><ScreenBarber /></IPhoneMockup>
        </div>
        <div style={{ flex: '0 0 auto' }}>
          <IPhoneMockup width={200}><ScreenCaptu /></IPhoneMockup>
        </div>
        <div style={{ flex: '0 0 auto', width: 290 }}>
          <BrowserMockup><ScreenVintech /></BrowserMockup>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {['TLS Barber', 'Captu', 'Vintech'].map(n => (
          <div key={n} style={{ fontSize: 22, color: '#0F6CBD', fontWeight: 700, padding: '8px 18px', border: '1px solid rgba(15,108,189,0.4)', borderRadius: 999 }}>{n}</div>
        ))}
      </div>
    </div>
    <div className="ig-bottom" style={{ textAlign: 'center', fontSize: 18, opacity: 0.7 }}>
      Próximo →
    </div>
  </StoryFrame>
);

const Story4 = () => (
  <StoryFrame bg="linear-gradient(180deg, #041020 0%, #0a2950 100%)">
    <div style={{ position: 'absolute', inset: '180px 80px 200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 50 }}>
      <div>
        <div className="overline" style={{ color: '#0F6CBD', fontSize: 18 }}>4 · CAIXA DE PERGUNTAS</div>
        <div className="display" style={{ fontSize: 64, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1, marginTop: 20 }}>
          Me conta:
        </div>
        <div className="display" style={{ fontSize: 56, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.05, marginTop: 18, fontWeight: 500 }}>
          qual processo do seu negócio mais te dá <span className="accent">dor de cabeça</span>?
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 30, color: '#041020', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ fontSize: 18, color: '#5A5E64', fontWeight: 600, marginBottom: 14 }}>Faça uma pergunta…</div>
        <div style={{ height: 1, background: 'rgba(4,16,32,0.1)' }} />
        <div style={{ fontSize: 16, color: '#0F6CBD', fontWeight: 700, marginTop: 14, letterSpacing: '0.1em' }}>RESPOSTA NO DIRECT</div>
      </div>
    </div>
    <div className="ig-bottom" style={{ textAlign: 'center', fontSize: 22, fontWeight: 600 }}>
      Resposta privada → <span className="grifo">SOFTWARE</span> ou <span className="grifo">EVOLUIR</span>
    </div>
  </StoryFrame>
);

Object.assign(window, {
  Reel1, Reel2, Reel3, Reel4, Reel5, Reel6,
  Story1, Story2, Story3, Story4,
});
