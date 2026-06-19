import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Cadastro aberto foi removido — o sistema é fechado, contas só por convite
 * (ver /accept-invite). Mantemos a rota apenas para redirecionar links antigos.
 */
export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});
