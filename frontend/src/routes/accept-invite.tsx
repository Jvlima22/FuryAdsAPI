import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, ShieldX } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { isValidCpf, isValidPhone, maskCpf, maskPhone, onlyDigits } from "@/lib/br-validators";

export const Route = createFileRoute("/accept-invite")({
  component: AcceptInvitePage,
});

const schema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    phone: z.string().refine(isValidPhone, "Telefone inválido (DDD + número)"),
    cpf: z.string().refine(isValidCpf, "CPF inválido"),
    password: z.string().min(8, "Mínimo de 8 caracteres"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "As senhas não conferem",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

function AcceptInvitePage() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, isConfigured, acceptInvite } = useAuth();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    const { error } = await acceptInvite({
      name: values.name,
      phone: onlyDigits(values.phone),
      cpf: onlyDigits(values.cpf),
      password: values.password,
    });
    if (error) {
      toast.error("Não foi possível concluir o cadastro", { description: error });
      return;
    }
    toast.success("Cadastro concluído!", { description: "Bem-vindo ao Control Center." });
    navigate({ to: "/dashboard" });
  }

  // Aguardando o link do convite estabelecer a sessão.
  if (isConfigured && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Sem sessão de convite válida (link expirado, já usado ou acesso direto).
  if (isConfigured && !isAuthenticated) {
    return (
      <AuthLayout
        title="Convite inválido"
        subtitle="Este link de convite expirou ou já foi utilizado."
        footer={
          <Link to="/login" className="font-medium text-violet hover:underline">
            Ir para o login
          </Link>
        }
      >
        <div className="flex items-center gap-3 rounded-lg border border-border bg-accent/40 p-4 text-sm text-muted-foreground">
          <ShieldX className="size-5 shrink-0 text-destructive" />
          <p>Peça um novo convite a um administrador para criar sua conta.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Criar sua conta"
      subtitle="Você foi convidado. Complete seu cadastro para acessar."
      footer={
        <span className="text-xs text-muted-foreground">
          Sistema interno · acesso somente por convite.
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" autoComplete="name" placeholder="Seu nome" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={user?.email ?? ""} disabled readOnly />
          <p className="text-[11px] text-muted-foreground">Definido pelo convite — não pode ser alterado.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefone</Label>
            <Controller
              control={control}
              name="phone"
              defaultValue=""
              render={({ field }) => (
                <Input
                  id="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(11) 90000-0000"
                  value={field.value}
                  onChange={(e) => field.onChange(maskPhone(e.target.value))}
                />
              )}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpf">CPF</Label>
            <Controller
              control={control}
              name="cpf"
              defaultValue=""
              render={({ field }) => (
                <Input
                  id="cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={field.value}
                  onChange={(e) => field.onChange(maskCpf(e.target.value))}
                />
              )}
            />
            {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Mínimo de 8 caracteres"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirmar senha</Label>
          <Input
            id="confirm"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            {...register("confirm")}
          />
          {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || !isConfigured}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Concluir cadastro
        </Button>
      </form>
    </AuthLayout>
  );
}
