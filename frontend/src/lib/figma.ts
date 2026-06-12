/**
 * Figma "creatives gallery" domain types + helpers shared by client and server.
 *
 * The app mirrors a Figma file: each top-level FRAME (on a page or inside a
 * SECTION) becomes a creative card. Images are rendered on the server via the
 * Figma REST API — the token never reaches the browser.
 */

export type FigmaFrame = { id: string; name: string };

export type FigmaPage = {
  id: string;
  name: string;
  frames: FigmaFrame[];
};

export type FigmaFileIndex = {
  fileName: string;
  lastModified: string;
  fileKey: string;
  pages: FigmaPage[];
};

/** Accepts a raw file key or a full Figma URL and returns the key. */
export function parseFigmaFileKey(input: string): string {
  if (!input) return "";
  const m = input.match(/figma\.com\/(?:design|file|board)\/([A-Za-z0-9]+)/);
  return (m ? m[1] : input).trim();
}
