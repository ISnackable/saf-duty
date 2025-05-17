import { subtle } from 'uncrypto';

export type CookiePrefixOptions = 'host' | 'secure';

const algorithm = { name: 'HMAC', hash: 'SHA-256' };

export const getCryptoKey = async (secret: string | BufferSource) => {
  const secretBuf =
    typeof secret === 'string' ? new TextEncoder().encode(secret) : secret;
  return await subtle.importKey('raw', secretBuf, algorithm, false, [
    'sign',
    'verify',
  ]);
};

export const verifySignature = async (
  base64Signature: string,
  value: string,
  secret: CryptoKey
): Promise<boolean> => {
  try {
    const signatureBinStr = atob(base64Signature);
    const signature = new Uint8Array(signatureBinStr.length);
    for (let i = 0, len = signatureBinStr.length; i < len; i++) {
      signature[i] = signatureBinStr.charCodeAt(i);
    }
    return await subtle.verify(
      algorithm,
      secret,
      signature,
      new TextEncoder().encode(value)
    );
  } catch (_e) {
    return false;
  }
};

export const getCookieKey = (key: string, prefix?: CookiePrefixOptions) => {
  let finalKey = key;
  if (prefix) {
    if (prefix === 'secure') {
      finalKey = `__Secure-${key}`;
    } else if (prefix === 'host') {
      finalKey = `__Host-${key}`;
    } else {
      return undefined;
    }
  }
  return finalKey;
};

export function parseCookies(cookieHeader: string) {
  const cookies = cookieHeader.split(';');
  const cookieMap = new Map<string, string>();

  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    cookieMap.set(name, decodeURIComponent(value));
  });
  return cookieMap;
}

export function getCookie(
  headers: Headers,
  key: string,
  prefix?: CookiePrefixOptions
) {
  const finalKey = getCookieKey(key, prefix);
  if (!finalKey) {
    return null;
  }
  const requestCookies = headers?.get('cookie');
  const parsedCookies = requestCookies
    ? parseCookies(requestCookies)
    : undefined;

  return parsedCookies?.get(finalKey) || null;
}

export async function getSignedCookie(
  headers: Headers,
  key: string,
  secret: string,
  prefix?: CookiePrefixOptions
) {
  const finalKey = getCookieKey(key, prefix);
  if (!finalKey) {
    return null;
  }
  const requestCookies = headers?.get('cookie');
  const parsedCookies = requestCookies
    ? parseCookies(requestCookies)
    : undefined;

  const value = parsedCookies?.get(finalKey);
  if (!value) {
    return null;
  }
  const signatureStartPos = value.lastIndexOf('.');
  if (signatureStartPos < 1) {
    return null;
  }
  const signedValue = value.substring(0, signatureStartPos);
  const signature = value.substring(signatureStartPos + 1);
  if (signature.length !== 44 || !signature.endsWith('=')) {
    return null;
  }
  const secretKey = await getCryptoKey(secret);
  const isVerified = await verifySignature(signature, signedValue, secretKey);

  return isVerified ? signedValue : false;
}
