// ============ CARROSSÉIS — 4 séries × 1080×1350 ============

const CFrame = ({ children, bg = '#F8F9FA', dark = false, progress = 0, total = 1, idx = 0, last = false, style = {} }) => (
  <div className="tgl-stage" style={{
    width: 1080, height: 1350, background: bg, color: dark ? '#fff' : '#041020', ...style
  }}>
    {children}
    <div className={`carousel-progress ${!dark ? 'on-light' : ''}`}>
      <div className="fill" style={{ width: `${((idx + 1) / total) * 100}%` }} />
    </div>
    <div style={{ position: 'absolute', bottom: 30, left: 80, fontSize: 14, color: dark ? '#5A5E64' : '#5A5E64', letterSpacing: '0.1em', fontWeight: 600 }}>
      {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </div>
    {!last && (
      <div className={`carousel-next ${!dark ? 'on-light' : ''}`}>
        <IconChevronRight size={20} />
      </div>
    )}
  </div>
);

// ============ CARROSSEL A — planilha (6 slides) ============
const A1 = () => (
  <CFrame dark bg="linear-gradient(135deg, #041020 0%, #0F6CBD 100%)" total={6} idx={0}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline" style={{ color: '#fff', opacity: 0.85 }}>CARROSSEL · A</span>
        <TGLLogo tone="gradient" size={16} />
      </div>
      <div>
        <div style={{ fontSize: 22, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>
          ↓ arraste
        </div>
        <div className="display" style={{ fontSize: 92, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98 }}>
          O preço secreto<br/>de gerir seu negócio
        </div>
        <div className="display" style={{ fontSize: 92, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98, marginTop: 10 }}>
          numa <span className="grifo">planilha</span>.
        </div>
        <div style={{ fontSize: 28, color: '#CDCFD2', marginTop: 36, fontStyle: 'italic' }}>(ninguém te conta isso)</div>
      </div>
      <div />
    </div>
  </CFrame>
);

const ASlide = ({ n, Icon, h, body, total = 6, idx }) => (
  <CFrame total={total} idx={idx}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">PLANILHA · A</span>
        <TGLLogo tone="dark" size={16} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32 }}>
          <div className="display" style={{ fontSize: 260, color: '#0F6CBD', lineHeight: 0.78, letterSpacing: '-0.05em' }}>{n}</div>
          <div style={{ width: 90, height: 90, borderRadius: 18, background: '#fff', border: '1px solid rgba(4,16,32,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={42} stroke="#041020" />
          </div>
        </div>
        <div className="display" style={{ fontSize: 64, color: '#041020', letterSpacing: '-0.025em', lineHeight: 1.0, marginBottom: 24 }}>
          {h}
        </div>
        <div style={{ fontSize: 30, color: '#5A5E64', maxWidth: 760, lineHeight: 1.35, fontWeight: 500 }}>
          {body}
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

const A2 = () => <ASlide idx={1} n="01" Icon={IconSheet} h="Erro de digitação que vira prejuízo." body="Uma célula errada, um pedido perdido. Você só descobre no fim do mês — e é tarde." />;
const A3 = () => <ASlide idx={2} n="02" Icon={IconRepeat} h="Retrabalho que ninguém vê." body="A mesma informação digitada em 4 lugares diferentes. 4 chances de divergir." />;
const A4 = () => <ASlide idx={3} n="03" Icon={IconUser} h="Dependência de pessoa." body="Se quem 'sabe a planilha' sai, a operação trava. Conhecimento que não está no sistema, está no risco." />;
const A5 = () => <ASlide idx={4} n="04" Icon={IconClock} h="Zero visão em tempo real." body="Você não sabe o que está acontecendo agora — só no fim do mês. Decisão atrasada é decisão errada." />;

const A6 = () => (
  <CFrame dark bg="#041020" total={6} idx={5} last>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">CARROSSEL · A · FIM</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 84, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Tudo isso some
        </div>
        <div className="display" style={{ fontSize: 84, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginTop: 8 }}>
          com um <span className="accent">sistema sob medida</span>.
        </div>
        <div style={{ marginTop: 80, padding: 40, background: 'rgba(15,108,189,0.10)', border: '1px solid rgba(15,108,189,0.3)', borderRadius: 16 }}>
          <div style={{ fontSize: 24, color: '#CDCFD2', fontWeight: 500, marginBottom: 10 }}>Diagnóstico gratuito.</div>
          <div className="display" style={{ fontSize: 56, color: '#fff', letterSpacing: '-0.02em' }}>
            Escreva <span className="grifo">SOFTWARE</span><br/>no direct.
          </div>
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

// ============ CARROSSEL B — ideia vira SaaS (7 slides) ============
const B1 = () => (
  <CFrame dark bg="#041020" total={7} idx={0}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">CARROSSEL · B</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div style={{ fontSize: 22, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>nosso processo</div>
        <div className="display" style={{ fontSize: 88, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98 }}>
          Como a gente descobre
        </div>
        <div className="display" style={{ fontSize: 88, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98, marginTop: 10 }}>
          se sua ideia vira
        </div>
        <div className="display" style={{ fontSize: 88, color: '#0F6CBD', letterSpacing: '-0.03em', lineHeight: 0.98, marginTop: 10 }}>
          um SaaS lucrativo.
        </div>
        <div style={{ marginTop: 56, fontSize: 24, color: '#CDCFD2', fontWeight: 500 }}>
          5 passos · 5 critérios · zero achismo
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

const BStep = ({ n, label, h, body, idx }) => (
  <CFrame total={7} idx={idx}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">SAAS · B</span>
        <TGLLogo tone="dark" size={16} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
          {[1,2,3,4,5].map(i => (
            <React.Fragment key={i}>
              <div style={{
                width: i === n ? 56 : 40, height: i === n ? 56 : 40, borderRadius: '50%',
                background: i <= n ? '#0F6CBD' : 'transparent',
                border: i <= n ? 'none' : '1.5px solid rgba(4,16,32,0.15)',
                color: i <= n ? '#fff' : '#5A5E64',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: i === n ? 22 : 16,
                transition: 'all .2s'
              }}>
                {i}
              </div>
              {i < 5 && <div style={{ flex: 1, height: 2, background: i < n ? '#0F6CBD' : 'rgba(4,16,32,0.10)' }} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: 22, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>
          Passo {n} · {label}
        </div>
        <div className="display" style={{ fontSize: 80, color: '#041020', letterSpacing: '-0.025em', lineHeight: 0.98, marginBottom: 30 }}>
          {h}
        </div>
        <div style={{ fontSize: 30, color: '#5A5E64', maxWidth: 800, lineHeight: 1.35, fontWeight: 500 }}>
          {body}
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

const B2 = () => <BStep idx={1} n={1} label="dor real" h="A ideia resolve algo?" body="O problema é tão real que alguém pagaria hoje para ele sumir? Sem dor, não tem mercado." />;
const B3 = () => <BStep idx={2} n={2} label="mercado" h="Tem gente o bastante?" body="Quantos negócios têm essa dor? Se for muito nicho, o ticket precisa ser alto. Não tem mágica." />;
const B4 = () => <BStep idx={3} n={3} label="mvp enxuto" h="O menor produto possível." body="A versão mais simples que já entrega valor real. Tudo que sobrar é desperdício de mês de desenvolvimento." />;
const B5 = () => <BStep idx={4} n={4} label="validação" h="A gente testa com gente." body="Usuários de verdade usando o produto. Eles vão pagar? Eles voltam? Eles indicam? Dado, não opinião." />;
const B6 = () => <BStep idx={5} n={5} label="escala" h="Só investe pesado no que prova." body="Marketing, automação, time — entram quando os números justificam. Antes disso, é torrar dinheiro." />;

const B7 = () => (
  <CFrame dark bg="#041020" total={7} idx={6} last>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">CARROSSEL · B · FIM</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 70, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1 }}>
          Foi assim que nasceram
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
          {['TLS Barber', 'Captu', 'Vintech'].map(s => (
            <div key={s} className="display" style={{
              fontSize: 38, color: '#fff',
              padding: '14px 28px', borderRadius: 999,
              border: '1.5px solid rgba(15,108,189,0.55)', background: 'rgba(15,108,189,0.10)'
            }}>{s}</div>
          ))}
        </div>
        <div style={{ marginTop: 70, padding: 40, background: 'rgba(15,108,189,0.10)', border: '1px solid rgba(15,108,189,0.3)', borderRadius: 16 }}>
          <div style={{ fontSize: 24, color: '#CDCFD2', marginBottom: 10 }}>Tem uma ideia?</div>
          <div className="display" style={{ fontSize: 56, color: '#fff', letterSpacing: '-0.02em' }}>
            Escreva <span className="grifo">EVOLUIR</span> no direct.
          </div>
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

// ============ CARROSSEL C — 5 processos (7 slides) ============
const C1 = () => (
  <CFrame dark bg="linear-gradient(135deg, #041020 0%, #0F6CBD 100%)" total={7} idx={0}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline" style={{ color: '#fff', opacity: 0.85 }}>CARROSSEL · C</span>
        <TGLLogo tone="gradient" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 220, color: '#fff', letterSpacing: '-0.05em', lineHeight: 0.8 }}>5</div>
        <div className="display" style={{ fontSize: 70, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1, marginTop: 20 }}>
          processos que toda empresa<br/>deveria automatizar
        </div>
        <div className="display" style={{ fontSize: 70, color: '#0F6CBD', letterSpacing: '-0.025em', lineHeight: 1, marginTop: 12 }}>
          hoje.
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

const CProc = ({ n, Icon, h, body, idx }) => (
  <CFrame total={7} idx={idx} bg="#fff">
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">AUTOMAÇÃO · C</span>
        <TGLLogo tone="dark" size={16} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, marginBottom: 28 }}>
          <div className="display" style={{ fontSize: 320, color: '#0F6CBD', lineHeight: 0.78, letterSpacing: '-0.05em' }}>{n}</div>
          <div style={{ paddingBottom: 36 }}>
            <div style={{ width: 110, height: 110, borderRadius: 22, background: '#041020', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={48} stroke="#0F6CBD" />
            </div>
          </div>
        </div>
        <div className="display" style={{ fontSize: 72, color: '#041020', letterSpacing: '-0.025em', lineHeight: 0.98, marginBottom: 28 }}>
          {h}
        </div>
        <div style={{ fontSize: 30, color: '#5A5E64', maxWidth: 820, lineHeight: 1.35, fontWeight: 500 }}>
          {body}
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

const C2 = () => <CProc idx={1} n="1" Icon={IconCalendar} h="Agendamento." body="Cliente marca sozinho, sistema confirma e lembra. Sua agenda enche dormindo." />;
const C3 = () => <CProc idx={2} n="2" Icon={IconWallet} h="Cobrança." body="Boleto e Pix automáticos. Aviso de atraso sem você apertar um botão." />;
const C4 = () => <CProc idx={3} n="3" Icon={IconMsg} h="Atendimento." body="Respostas e triagem que não dependem de alguém online 24h. O bot faz o filtro, você fecha o negócio." />;
const C5 = () => <CProc idx={4} n="4" Icon={IconBar} h="Relatórios." body="O número que você precisa, pronto — sem montar planilha. Dashboard, não Excel." />;
const C6 = () => <CProc idx={5} n="5" Icon={IconDatabase} h="Cadastro." body="Dados do cliente entram uma vez e fluem por todo o sistema. Zero retrabalho." />;

const C7 = () => (
  <CFrame dark bg="#041020" total={7} idx={6} last>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">CARROSSEL · C · FIM</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 82, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
          Qual desses<br/>está te custando
        </div>
        <div className="display" style={{ fontSize: 82, color: '#0F6CBD', letterSpacing: '-0.03em', lineHeight: 1, marginTop: 10 }}>
          mais caro?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginTop: 60 }}>
          {[
            { i: IconCalendar, l: 'Agenda' },
            { i: IconWallet, l: 'Cobrança' },
            { i: IconMsg, l: 'Atendim.' },
            { i: IconBar, l: 'Relatórios' },
            { i: IconDatabase, l: 'Cadastro' },
          ].map((it, i) => (
            <div key={i} style={{ padding: 18, border: '1px solid #1E2122', borderRadius: 14, textAlign: 'center' }}>
              <it.i size={26} stroke="#0F6CBD" />
              <div style={{ fontSize: 14, color: '#CDCFD2', marginTop: 8, fontWeight: 600 }}>{it.l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56, padding: 40, background: 'rgba(15,108,189,0.10)', border: '1px solid rgba(15,108,189,0.3)', borderRadius: 16 }}>
          <div className="display" style={{ fontSize: 50, color: '#fff', letterSpacing: '-0.02em' }}>
            Escreva <span className="grifo">SOFTWARE</span> no direct.
          </div>
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

// ============ CARROSSEL D — bastidores (6 slides) ============
const D1 = () => (
  <CFrame dark bg="#041020" total={6} idx={0}>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">CARROSSEL · D</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div style={{ fontSize: 22, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 28 }}>
          BASTIDORES
        </div>
        <div className="display" style={{ fontSize: 92, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98 }}>
          3 SaaS que a gente
        </div>
        <div className="display" style={{ fontSize: 92, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98, marginTop: 10 }}>
          construiu <span className="accent">do zero</span>.
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 56, flexWrap: 'wrap' }}>
          {['TLS Barber', 'Captu', 'Vintech'].map(s => (
            <div key={s} style={{
              padding: '12px 22px', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999,
              fontFamily: 'DM Sans', fontWeight: 600, color: '#CDCFD2', fontSize: 22
            }}>{s}</div>
          ))}
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

const DProduct = ({ name, tag, body, kind, Screen, idx, total }) => (
  <CFrame total={total} idx={idx} dark bg="#041020">
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 80 }}>
            <span className="overline">PRODUTO · {String(idx).padStart(2,'0')}</span>
          </div>
          <div style={{ fontSize: 22, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>
            {tag}
          </div>
          <div className="display" style={{ fontSize: 96, color: '#fff', letterSpacing: '-0.035em', lineHeight: 0.95 }}>
            {name}
          </div>
          <div style={{ fontSize: 28, color: '#CDCFD2', marginTop: 38, maxWidth: 460, lineHeight: 1.35, fontWeight: 500 }}>
            {body}
          </div>
        </div>
        <TGLLogo tone="light" size={16} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {kind === 'phone' ? (
          <IPhoneMockup width={320}><Screen /></IPhoneMockup>
        ) : (
          <div style={{ width: 460 }}>
            <BrowserMockup label={`${name.toLowerCase()}.app`}><Screen /></BrowserMockup>
          </div>
        )}
      </div>
    </div>
  </CFrame>
);

const D2 = () => <DProduct idx={1} total={6} name="TLS Barber" tag="gestão de barbearia"
  body="Agenda, comanda, fidelidade, financeiro. Tudo no bolso do dono — e na mão do cliente que marca sozinho."
  kind="phone" Screen={ScreenBarber} />;

const D3 = () => <DProduct idx={2} total={6} name="Captu" tag="captação & gestão de leads*"
  body="Centraliza leads de todas as fontes (site, social, WhatsApp), qualifica e empurra pro funil sem perder ninguém no caminho."
  kind="phone" Screen={ScreenCaptu} />;

const D4 = () => <DProduct idx={3} total={6} name="Vintech" tag="gestão de vinícola"
  body="Da vindima à última taça: estoque, vendas, enoturismo e equipe em uma plataforma só. Tecnologia à altura da tradição do vinho."
  kind="web" Screen={ScreenVintech} />;

const D5 = () => (
  <CFrame total={6} idx={4} bg="#F8F9FA">
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">A LIÇÃO</span>
        <TGLLogo tone="dark" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 78, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98 }}>
          O que esses 3 têm
        </div>
        <div className="display" style={{ fontSize: 78, color: '#041020', letterSpacing: '-0.028em', lineHeight: 0.98, marginTop: 10 }}>
          em comum?
        </div>
        <div style={{ marginTop: 60, padding: 40, background: '#fff', borderRadius: 16, border: '1px solid rgba(4,16,32,0.06)', display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: '#0F6CBD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconLayers size={28} stroke="#fff" />
          </div>
          <div className="h-tight" style={{ fontSize: 36, color: '#041020', fontWeight: 600, lineHeight: 1.2 }}>
            Foram feitos <span style={{ color: '#0F6CBD' }}>sob medida</span> — e o seu pode ser o próximo.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 24 }}>
          {[
            { l: 'Arquitetura', v: 'pensada pro caso real' },
            { l: 'UX', v: 'sem fricção, pra dono e cliente' },
            { l: 'Escala', v: 'cresce com seu negócio' },
          ].map((it, i) => (
            <div key={i} style={{ padding: 24, background: '#fff', borderRadius: 14, border: '1px solid rgba(4,16,32,0.06)' }}>
              <div style={{ fontSize: 14, color: '#0F6CBD', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{it.l}</div>
              <div style={{ fontSize: 22, color: '#041020', marginTop: 8, fontWeight: 500, lineHeight: 1.3 }}>{it.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

const D6 = () => (
  <CFrame dark bg="#041020" total={6} idx={5} last>
    <div style={{ position: 'absolute', inset: 0, padding: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="overline">CARROSSEL · D · FIM</span>
        <TGLLogo tone="light" size={16} />
      </div>
      <div>
        <div className="display" style={{ fontSize: 88, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98 }}>
          Vamos conversar
        </div>
        <div className="display" style={{ fontSize: 88, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.98, marginTop: 10 }}>
          sobre o <span className="accent">seu</span>.
        </div>
        <div style={{ marginTop: 80, padding: 44, background: 'rgba(15,108,189,0.10)', border: '1px solid rgba(15,108,189,0.3)', borderRadius: 16 }}>
          <div style={{ fontSize: 24, color: '#CDCFD2', marginBottom: 14 }}>Dispara a conversa em 1 palavra:</div>
          <div className="display" style={{ fontSize: 64, color: '#fff', letterSpacing: '-0.02em' }}>
            Escreva <span className="grifo">EVOLUIR</span>.
          </div>
        </div>
        <div style={{ marginTop: 32, fontSize: 18, color: '#5A5E64' }}>
          ou <span style={{ color: '#CDCFD2', fontWeight: 600 }}>faça um orçamento</span> pelo link na bio.
        </div>
      </div>
      <div />
    </div>
  </CFrame>
);

Object.assign(window, {
  CFrame,
  A1, A2, A3, A4, A5, A6,
  B1, B2, B3, B4, B5, B6, B7,
  C1, C2, C3, C4, C5, C6, C7,
  D1, D2, D3, D4, D5, D6,
});
