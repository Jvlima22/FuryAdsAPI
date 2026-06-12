import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

/**
 * SSR entry (vite.config.ts → tanstackStart.server.entry = "server").
 *
 * The dev server and Nitro both invoke `default.fetch(request)`, so the entry
 * must export an object with a `fetch` method. We wrap the default Start
 * handler so that when SSR throws — and h3/Nitro has already turned the throw
 * into a generic 500 — we recover the original stack (consumeLastCapturedError)
 * for logging and serve a friendly error page instead of a blank 500.
 */
const handler = createStartHandler(defaultStreamHandler);

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const response = await handler(request);

      if (response.status >= 500) {
        const captured = consumeLastCapturedError();
        if (captured) console.error("[server] SSR responded 500:", captured);
      }
      return response;
    } catch (error) {
      console.error("[server] Unhandled SSR error:", consumeLastCapturedError() ?? error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
