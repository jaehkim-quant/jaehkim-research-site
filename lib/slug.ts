export const URL_SAFE_SLUG_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
export const URL_SAFE_SLUG_LENGTH = 12;

export function createRandomUrlSlug(length = URL_SAFE_SLUG_LENGTH): string {
  const bytes = new Uint8Array(length);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(
    bytes,
    (b) => URL_SAFE_SLUG_ALPHABET[b % URL_SAFE_SLUG_ALPHABET.length]
  ).join("");
}

export function normalizeSlug(value: string | undefined): string {
  if (!value || typeof value !== "string") return "";
  return value.normalize("NFC").trim();
}

export function normalizeSlugFromPathParam(value: string | undefined): string {
  if (!value || typeof value !== "string") return "";
  try {
    return normalizeSlug(decodeURIComponent(value));
  } catch {
    return normalizeSlug(value);
  }
}

export function getSlugVariants(value: string | undefined): string[] {
  const normalized = normalizeSlug(value);
  if (!normalized) return [];

  const nfc = normalized.normalize("NFC");
  const nfd = normalized.normalize("NFD");
  return nfc !== nfd ? [nfc, nfd] : [nfc];
}

export function getSlugVariantsFromPathParam(
  value: string | undefined
): string[] {
  const normalized = normalizeSlugFromPathParam(value);
  if (!normalized) return [];

  const nfc = normalized.normalize("NFC");
  const nfd = normalized.normalize("NFD");
  return nfc !== nfd ? [nfc, nfd] : [nfc];
}
