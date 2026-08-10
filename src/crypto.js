const enc = new TextEncoder();
const dec = new TextDecoder();

export async function deriveKey(passphrase, salt) {
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveBits', 'deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt, iterations: 310000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const plaintext = typeof data === 'string' ? enc.encode(data) : new Uint8Array(data);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
  return { ciphertext: btoa(String.fromCharCode.apply(null, combined)), salt: Array.from(salt), iv: Array.from(iv) };
}

export async function decryptData(b64, passphrase) {
  const raw = new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)));
  const salt = raw.slice(0, 16);
  const iv = raw.slice(16, 28);
  const cipher = raw.slice(28);
  const key = await deriveKey(passphrase, salt);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return dec.decode(decrypted);
}

export async function hashPassphrase(passphrase) {
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(passphrase));
  return btoa(String.fromCharCode.apply(null, new Uint8Array(hash)));
}
