import type { ReactNode } from "react";
import { ShieldCheck, BarChart3, Megaphone } from "lucide-react";

/**
 * Moldura split-screen das telas de autenticação: formulário à esquerda, painel
 * de marca com gradiente violet/cyan à direita (escondido no mobile). Mantém o
 * visual glassmorphism do restante do Metrik.
 */
const HIGHLIGHTS = [
  { icon: BarChart3, label: "Métricas em tempo real", desc: "Campanhas Google & Meta num só painel." },
  { icon: ShieldCheck, label: "Takedown automático", desc: "Violações viram jobs com retry e auditoria." },
  { icon: Megaphone, label: "Gestão de criativos", desc: "Do Figma ao ar, sem sair do Control Center." },
];

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <img src="/logo-METRIK.png" alt="Metrik" className="h-8 w-auto object-contain" />
          <h1 className="mt-8 text-2xl font-semibold font-display tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-violet via-violet to-cyan" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(40rem 40rem at 80% -10%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(30rem 30rem at -10% 110%, rgba(6,182,212,0.5), transparent 55%)",
          }}
        />
        <div className="relative">
          <img
            src="/logo-METRIK-white.png"
            alt="Metrik"
            className="h-8 w-auto object-contain"
          />
          <p className="mt-2 text-sm text-white/70">Control Center</p>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-semibold font-display leading-snug max-w-sm">
            Monitore campanhas e violações em um só lugar.
          </h2>
          <ul className="space-y-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <h.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{h.label}</p>
                  <p className="text-sm text-white/70">{h.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} Metrik · Fury Ads API
        </p>
      </div>
    </div>
  );
}
