/* Shared building blocks for all Instagram pieces */

// ─── Brand tokens (locked from Vintech design system) ─────────────────
const VT = {
  bordoDeep: '#300810',
  bordo: '#571923',
  bordoGlow: '#6B2333',
  gold: '#C8A44C',
  goldSoft: '#E6D2A6',
  cream: '#F8F5F1',
  creamDeep: '#EEE7DD',
  ink: '#210A0F',
  inkSoft: 'rgba(33,10,15,0.62)',
  border: 'rgba(33,10,15,0.10)',
  gradWine: 'linear-gradient(135deg, #300810 0%, #571923 50%, #6B2333 100%)',
  gradGoldRadial: 'radial-gradient(ellipse 60% 60% at 90% 5%, rgba(200,164,76,0.45), transparent 65%)',
};

const DISPLAY = "'Space Grotesk', system-ui, sans-serif";
const SANS = "'DM Sans', system-ui, sans-serif";

// ─── Lucide-style line icons (24px viewBox, stroke 1.8) ────────────────
const Icon = ({ d, size = 24, color = VT.gold, stroke = 1.8, children, fill = 'none' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill}
       stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d}/> : children}
  </svg>
);

const IconWine = (p) => (
  <Icon {...p}><path d="M8 22h8M12 15v7M5 2h14l-1 9a6 6 0 0 1-12 0L5 2z"/><path d="M5.5 6.5h13"/></Icon>
);
const IconMapPin = (p) => (
  <Icon {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></Icon>
);
const IconCart = (p) => (
  <Icon {...p}><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2.5 3h2.5l2.4 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.5L21.5 7H6"/></Icon>
);
const IconUsers = (p) => (
  <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Icon>
);
const IconChart = (p) => (
  <Icon {...p}><path d="M3 3v17a1 1 0 0 0 1 1h17"/><path d="M7 14l4-4 4 4 5-5"/></Icon>
);
const IconBottle = (p) => (
  <Icon {...p}><path d="M10 2h4v4l1 3v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V9l1-3V2z"/><path d="M9 12h6"/></Icon>
);
const IconGrape = (p) => (
  <Icon {...p}><path d="M12 2v3"/><circle cx="12" cy="7" r="2"/><circle cx="8" cy="11" r="2"/><circle cx="16" cy="11" r="2"/><circle cx="6" cy="15" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="18" cy="15" r="2"/><circle cx="9" cy="19" r="2"/><circle cx="15" cy="19" r="2"/><circle cx="12" cy="22" r="0.5" fill={p.color||VT.gold}/></Icon>
);
const IconArrowRight = (p) => (
  <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>
);
const IconBookmark = (p) => (
  <Icon {...p}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></Icon>
);
const IconBell = (p) => (
  <Icon {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Icon>
);
const IconCheck = (p) => (
  <Icon {...p}><path d="M5 12l4 4L19 6"/></Icon>
);
const IconQ = (p) => (
  <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 4.5 1.5c-1 .8-2 1.2-2 2.5"/><circle cx="12" cy="17" r="0.5" fill={p.color||VT.gold}/></Icon>
);
const IconCalendar = (p) => (
  <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></Icon>
);
const IconPhone = (p) => (
  <Icon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></Icon>
);
const IconNote = (p) => (
  <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></Icon>
);
const IconArrowUp = (p) => (
  <Icon {...p}><path d="M12 19V5M5 12l7-7 7 7"/></Icon>
);

// ─── Vintech logo (mark + wordmark) ────────────────────────────────────
const VintechLogo = ({ size = 28, color = VT.cream, gold = VT.gold }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.42, fontFamily: DISPLAY }}>
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <circle cx="20" cy="20" r="19" fill={VT.bordo} stroke={gold} strokeWidth="1.2"/>
      <path d="M12 14 L20 28 L28 14" stroke={gold} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="22" r="2.2" fill={gold}/>
    </svg>
    <span style={{ fontWeight: 700, fontSize: size * 0.78, color, letterSpacing: '-0.02em' }}>Vintech</span>
  </div>
);

// ─── Hairline gold rule used across the system ─────────────────────────
const GoldRule = ({ width = '100%', height = 1, color = VT.gold, style = {} }) => (
  <div style={{ width, height, background: color, ...style }}/>
);

// ─── Browser window mockup (Mac traffic lights) ────────────────────────
const BrowserChrome = ({ url = 'app.vintech.com', dark = true, children, style = {}, radius = 14 }) => {
  const bg = dark ? VT.bordoDeep : '#fff';
  const fg = dark ? 'rgba(230,210,166,0.65)' : 'rgba(33,10,15,0.55)';
  const barBg = dark ? 'rgba(255,255,255,0.04)' : '#F4EFE8';
  const border = dark ? 'rgba(230,210,166,0.12)' : 'rgba(33,10,15,0.08)';
  return (
    <div style={{
      background: bg, borderRadius: radius, overflow: 'hidden',
      boxShadow: '0 30px 80px -30px rgba(0,0,0,0.55), 0 0 0 1px ' + border,
      ...style,
    }}>
      <div style={{
        background: barBg, padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid ' + border,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c =>
            <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }}/>
          )}
        </div>
        <div style={{
          flex: 1, height: 26, borderRadius: 6, background: dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
          fontFamily: SANS, fontSize: 12, color: fg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', letterSpacing: '0.02em',
        }}>{url}</div>
        <div style={{ width: 60 }}/>
      </div>
      {children}
    </div>
  );
};

// ─── iPhone frame ──────────────────────────────────────────────────────
const PhoneFrame = ({ children, width = 280, style = {} }) => {
  const height = width * (812 / 375);
  return (
    <div style={{
      width, height, borderRadius: width * 0.16, background: '#0A0608',
      padding: width * 0.022, boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(230,210,166,0.18)',
      position: 'relative', ...style,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: width * 0.14, overflow: 'hidden',
        background: VT.bordoDeep, position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: width * 0.32, height: width * 0.07, background: '#000', borderRadius: 999, zIndex: 2,
        }}/>
        {children}
      </div>
    </div>
  );
};

Object.assign(window, {
  VT, DISPLAY, SANS,
  Icon, IconWine, IconMapPin, IconCart, IconUsers, IconChart, IconBottle,
  IconGrape, IconArrowRight, IconBookmark, IconBell, IconCheck, IconQ,
  IconCalendar, IconPhone, IconNote, IconArrowUp,
  VintechLogo, GoldRule, BrowserChrome, PhoneFrame,
});
