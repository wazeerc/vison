// src/utils/cryptoUtils.ts
// Utility functions for encrypting and decrypting JSON using Web Crypto API (AES-GCM)

export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

export async function importKey(base64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt']);
}

export async function encryptJson(
  json: any,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(json));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptJson<T = any>(
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<T> {
  try {
    const ct = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivBytes }, key, ct);
    return JSON.parse(new TextDecoder().decode(decrypted)) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'OperationError') {
      throw new Error('Decryption failed: Invalid key or corrupted data');
    } else if (error instanceof SyntaxError) {
      throw new Error('Decryption failed: Invalid JSON data');
    }
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}
