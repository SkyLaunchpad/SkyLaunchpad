import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-host-D5dK5S0K.js
var MAX_BYTES = 2e6;
var TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp"
]);
function assertLogo(input) {
	if (!input || typeof input !== "object") throw new Error("Missing image.");
	const data = input.data;
	const type = input.type;
	if (typeof data !== "string" || typeof type !== "string") throw new Error("Missing image.");
	if (!TYPES.has(type)) throw new Error("Use a PNG, JPG, GIF, or WebP.");
	if (data.length < 32 || data.length > 28e5) throw new Error("Image must be under 2 MB.");
	return {
		data,
		type
	};
}
function decodeBase64(data) {
	try {
		const binary = atob(data);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
		return bytes;
	} catch {
		throw new Error("Could not read that image.");
	}
}
function looksLikeImage(bytes, type) {
	if (type === "image/png") return bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
	if (type === "image/jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
	if (type === "image/gif") return bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70;
	return bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80;
}
/** Turn a logo file into a short public https URL. The token contract stores the link, not the bytes. */
var hostLogo_createServerFn_handler = createServerRpc({
	id: "8c5dd71f7e36d5ac2400c8f3e57ecd74befc9ebf5cb7c8c75a2c9b7ab48e2419",
	name: "hostLogo",
	filename: "src/lib/chain/logo-host.ts"
}, (opts) => hostLogo.__executeServer(opts));
var hostLogo = createServerFn({ method: "POST" }).validator(assertLogo).handler(hostLogo_createServerFn_handler, async ({ data }) => {
	const bytes = decodeBase64(data.data);
	if (bytes.length < 16 || bytes.length > MAX_BYTES) throw new Error("Image must be under 2 MB.");
	if (!looksLikeImage(bytes, data.type)) throw new Error("That file is not a valid image.");
	const copy = new ArrayBuffer(bytes.byteLength);
	new Uint8Array(copy).set(bytes);
	const ext = data.type === "image/jpeg" ? "jpg" : data.type.slice(6);
	const form = new FormData();
	form.append("image", new Blob([copy], { type: data.type }), `logo.${ext}`);
	const response = await fetch("https://api.imgur.com/3/image", {
		method: "POST",
		headers: { Authorization: "Client-ID 546c25a59c58ad7" },
		body: form,
		signal: AbortSignal.timeout(2e4)
	});
	const json = await response.json().catch(() => null);
	const link = json && typeof json === "object" && "data" in json && json.data && typeof json.data === "object" && "link" in json.data && typeof json.data.link === "string" ? json.data.link : "";
	const url = link.startsWith("http://") ? `https://${link.slice(7)}` : link;
	if (!response.ok || !url.startsWith("https://") || url.length > 160 || /\s/.test(url)) throw new Error("Image host refused the upload. Try a smaller file, or paste an https link.");
	return { url };
});
//#endregion
export { hostLogo_createServerFn_handler };
