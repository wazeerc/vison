// src/utils/cryptoUtils.ts
/**
 * Asynchronously generates a 256-bit AES-GCM cryptographic key for encryption and decryption.
 *
 * @returns A {@link CryptoKey} object usable with AES-GCM operations.
 */

export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

/**
 * Exports a CryptoKey as a base64-encoded string.
 *
 * Converts the provided AES-GCM key to raw binary format and encodes it for storage or transmission.
 *
 * @returns The base64-encoded representation of the key.
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

/**
 * Imports a base64-encoded AES-GCM key and returns it as a CryptoKey object.
 *
 * @param base64 - The base64-encoded raw key string to import.
 * @returns A Promise that resolves to a CryptoKey usable for AES-GCM encryption and decryption.
 */
export async function importKey(base64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt']);
}

/**
 * Encrypts a JSON-serializable value using AES-GCM and returns base64-encoded ciphertext and IV.
 *
 * @param json - The value to serialize and encrypt.
 * @returns An object containing the base64-encoded ciphertext and initialization vector.
 */
export async function encryptJson(
  json: unknown,
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

/**
 * Decrypts base64-encoded ciphertext and IV using AES-GCM and parses the result as JSON.
 *
 * @param ciphertext - The base64-encoded ciphertext to decrypt.
 * @param iv - The base64-encoded initialization vector used during encryption.
 * @param key - The AES-GCM {@link CryptoKey} for decryption.
 * @returns The decrypted and parsed JSON object.
 *
 * @throws {Error} If the key is invalid or the ciphertext/IV is corrupted.
 * @throws {Error} If the decrypted data is not valid JSON.
 * @throws {Error} If decryption fails for any other reason.
 */
export async function decryptJson<T = unknown>(
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
