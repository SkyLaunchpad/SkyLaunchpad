import { createServerFn } from "@tanstack/react-start";

const MAX_BYTES = 2_000_000;
const TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

function assertLogo(input: unknown): { data: string; type: string } {
  if (!input || typeof input !== "object") throw new Error("Missing image.");
  const data = (input as { data?: unknown }).data;
  const type = (input as { type?: unknown }).type;
  if (typeof data !== "string" || typeof type !== "string") throw new Error("Missing image.");
  if (!TYPES.has(type)) throw new Error("Use a PNG, JPG, GIF, or WebP.");
  if (data.length < 32 || data.length > 2_800_000) throw new Error("Image must be under 2 MB.");
  return { data, type };
}

function decodeBase64(data: string): Uint8Array {
  try {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    throw new Error("Could not read that image.");
  }
}

function looksLikeImage(bytes: Uint8Array, type: string): boolean {
  if (type === "image/png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/gif") return bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

/** Turn a logo file into a short public https URL. The token contract stores the link, not the bytes. */
export const hostLogo = createServerFn({ method: "POST" })
  .validator(assertLogo)
  .handler(async ({ data }) => {
    const bytes = decodeBase64(data.data);
    if (bytes.length < 16 || bytes.length > MAX_BYTES) throw new Error("Image must be under 2 MB.");
    if (!looksLikeImage(bytes, data.type)) throw new Error("That file is not a valid image.");
    const copy = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(copy).set(bytes);
    const ext = data.type === "image/jpeg" ? "jpg" : data.type.slice("image/".length);
    const form = new FormData();
    form.append("image", new Blob([copy], { type: data.type }), `logo.${ext}`);
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: { Authorization: "Client-ID 546c25a59c58ad7" },
      body: form,
      signal: AbortSignal.timeout(20_000),
    });
    const json: unknown = await response.json().catch(() => null);
    const link =
      json &&
      typeof json === "object" &&
      "data" in json &&
      json.data &&
      typeof json.data === "object" &&
      "link" in json.data &&
      typeof json.data.link === "string"
        ? json.data.link
        : "";
    const url = link.startsWith("http://") ? `https://${link.slice("http://".length)}` : link;
    if (!response.ok || !url.startsWith("https://") || url.length > 160 || /\s/.test(url)) {
      throw new Error("Image host refused the upload. Try a smaller file, or paste an https link.");
    }
    return { url };
  });
