/* Vintech Instagram Carousel — Shared slide components */

/* ====== CONSTANTS ====== */
const BORDO_DEEP = 'hsl(350 70% 11%)';
const BORDO = 'hsl(350 55% 22%)';
const BORDO_GLOW = 'hsl(350 55% 35%)';
const GOLD = 'hsl(43 53% 54%)';
const GOLD_SOFT = 'hsl(43 60% 78%)';
const CREAM = 'hsl(30 33% 96%)';
const INK = 'hsl(350 60% 8%)';
const INK_SOFT = 'hsl(350 10% 38%)';
const BORDER = 'hsl(30 20% 85%)';
const SUCCESS = 'hsl(142 50% 35%)';
const GRADIENT_WINE = `linear-gradient(135deg, ${BORDO_DEEP} 0%, ${BORDO} 50%, hsl(350 60% 28%) 100%)`;
const GRADIENT_GOLD = `linear-gradient(135deg, hsl(43 60% 65%) 0%, ${GOLD} 50%, hsl(38 55% 42%) 100%)`;
const FONT_D = "'Space Grotesk', system-ui, sans-serif";
const FONT_S = "'DM Sans', system-ui, sans-serif";
const SHADOW_CARD = '0 1px 3px hsl(350 30% 15% / 0.04), 0 8px 24px -8px hsl(350 30% 15% / 0.08)';
const SHADOW_ELEGANT = '0 20px 60px -20px hsl(350 70% 11% / 0.35)';
const SHADOW_GOLD = '0 10px 40px -10px hsl(43 53% 54% / 0.4)';

/* ====== HELPERS ====== */
const VtLogo = ({ size = 48, light = true }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ flexShrink: 0 }}>
    <circle cx="20" cy="20" r="19" fill={BORDO} stroke={GOLD} strokeWidth="1.2"/>
    <path d="M12 14 L20 28 L28 14" stroke={GOLD} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="22" r="2.2" fill={GOLD}/>
  </svg>
);

const LogoBlock = ({ light = true, size = 'md' }) => {
  const dims = size === 'lg' ? 56 : size === 'sm' ? 32 : 44;
  const fs = size === 'lg' ? 28 : size === 'sm' ? 18 : 22;
  const ts = size === 'lg' ? 11 : size === 'sm' ? 8 : 9;
  const tc = light ? '#fff' : INK;
  const ac = light ? GOLD : BORDO;
  const tg = light ? 'rgba(255,255,255,0.6)' : BORDO;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <VtLogo size={dims} light={light}/>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: FONT_D, fontWeight: 700, fontSize: fs, letterSpacing: '-0.01em', color: tc }}>
          Vin<span style={{ color: ac }}>tech</span>
        </span>
        <span style={{ marginTop: 4, fontSize: ts, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em', color: tg }}>
          Wine Management
        </span>
      </div>
    </div>
  );
};

const Overline = ({ children, gold, style }) => (
  <span style={{ fontFamily: FONT_D, fontSize: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.28em', color: gold ? GOLD : BORDO, ...style }}>{children}</span>
);

const GoldRule = ({ width = 48 }) => (
  <div style={{ width, height: 2, background: GOLD, borderRadius: 1 }}/>
);

const SwipeHint = ({ light = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: light ? 'rgba(255,255,255,0.5)' : INK_SOFT, fontSize: 14, fontFamily: FONT_S, fontWeight: 500 }}>
    Deslize para ver mais
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
  </div>
);

const CtaButton = ({ children, gold = true, style }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 64, padding: '0 36px', borderRadius: 14,
    background: gold ? GRADIENT_GOLD : GRADIENT_WINE,
    color: gold ? BORDO_DEEP : CREAM,
    fontFamily: FONT_S, fontWeight: 600, fontSize: 20,
    boxShadow: gold ? SHADOW_GOLD : SHADOW_ELEGANT,
    ...style,
  }}>{children}</div>
);

const PageDots = ({ total, current, light = true }) => (
  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{
        width: i === current ? 24 : 8, height: 8, borderRadius: 4,
        background: i === current ? GOLD : (light ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)'),
        transition: 'all 300ms',
      }}/>
    ))}
  </div>
);

const IconSquare = ({ children, size = 64 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: GRADIENT_WINE, color: GOLD,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: SHADOW_ELEGANT,
  }}>{children}</div>
);

const CheckIcon = ({ color = GOLD, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
);

/* Lucide icons at 28px */
const WineIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5V3H7v7a5 5 0 0 0 5 5"/></svg>;
const PinIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const CartIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>;
const UsersIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ChartIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
const ShieldIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ZapIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const CalendarIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const GiftIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;

/* ====== SLIDE FRAME ====== */
const SlideFrame = ({ children, bg = BORDO_DEEP, bgImage, overlay, style, padding = '72px 64px' }) => (
  <div style={{
    width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
    background: bg, fontFamily: FONT_S, color: '#fff',
    display: 'flex', flexDirection: 'column',
    ...style,
  }}>
    {bgImage && <img src={bgImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>}
    {overlay && <div style={{ position: 'absolute', inset: 0, background: overlay }}/>}
    <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding, boxSizing: 'border-box' }}>
      {children}
    </div>
  </div>
);

/* ====== Make all available globally ====== */
Object.assign(window, {
  BORDO_DEEP, BORDO, BORDO_GLOW, GOLD, GOLD_SOFT, CREAM, INK, INK_SOFT, BORDER, SUCCESS,
  GRADIENT_WINE, GRADIENT_GOLD, FONT_D, FONT_S, SHADOW_CARD, SHADOW_ELEGANT, SHADOW_GOLD,
  VtLogo, LogoBlock, Overline, GoldRule, SwipeHint, CtaButton, PageDots, IconSquare, CheckIcon,
  WineIcon, PinIcon, CartIcon, UsersIcon, ChartIcon, ShieldIcon, ZapIcon, CalendarIcon, GiftIcon,
  SlideFrame,
});
