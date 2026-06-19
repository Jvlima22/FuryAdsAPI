/**
 * Claude Design source for the creatives gallery.
 *
 * Unlike Figma (which the app fetches live via API), Claude Design content is
 * pulled by the agent through the authorized DesignSync channel and written as
 * self-contained static files under `public/claude-designs/<project>/`. The app
 * just renders each renderable HTML in a same-origin <iframe> — so it bypasses
 * the X-Frame-Options / Cloudflare gating of the original claude.ai/design link.
 *
 * This lists ALL synced Claude Design projects (not scoped to one account).
 * Refreshing / adding a project = re-running the agent sync.
 */

import type { BrandKey } from "./accounts";

export type ClaudeDesign = {
  id: string;
  title: string;
  group: string;
  /** URL of the renderable HTML served from /public. */
  path: string;
  tone?: "wine" | "neutral";
};

export type ClaudeDesignProject = {
  projectId: string;
  name: string;
  /** Marca/conta dona deste projeto — usado para escopar os criativos por conta. */
  brandKey?: BrandKey;
  /** Data de criação/sync do board (ISO). Exibida no detalhe de cada peça. */
  createdAt?: string;
  designs: ClaudeDesign[];
};

export const claudeDesignProjects: ClaudeDesignProject[] = [
  {
    projectId: "514627cc-a1e1-4f38-8249-06abe1dd9667",
    name: "Vintech Design System",
    brandKey: "vintech",
    createdAt: "2026-02-20",
    designs: [
      {
        id: "carousels",
        title: "Carrosséis Instagram",
        group: "5 carrosséis · 28 slides",
        path: "/claude-designs/vintech/carousels/carrosseis-vintech.html",
        tone: "wine",
      },
    ],
  },
  {
    projectId: "e4fb29b0-c934-414f-84aa-6a89b851b72b",
    name: "Instagram Vintech",
    brandKey: "vintech",
    createdAt: "2026-02-20",
    designs: [
      {
        id: "board",
        title: "Conteúdo Instagram",
        group: "5 warmup · 3 posts · carrossel · 2 reels",
        path: "/claude-designs/vintech-instagram/index.html",
        tone: "wine",
      },
    ],
  },
  {
    projectId: "8094ee90-4608-4bf2-8a57-e7de44e72610",
    name: "TGL Posts Instagram",
    brandKey: "tgl",
    createdAt: "2026-02-20",
    designs: [
      {
        id: "board",
        title: "Conteúdo Instagram",
        group: "apresentação · posts · 6 carrosséis · reels · stories",
        path: "/claude-designs/tgl-posts/index.html",
        tone: "neutral",
      },
    ],
  },
];
