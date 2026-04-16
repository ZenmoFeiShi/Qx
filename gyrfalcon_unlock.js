/*
//2026/04/17
@Name：GyrfalconVPN 解锁全部 VIP 节点
@Author：怎么肥事

[rewrite_local]
^https://www\.hillnohouse\.com/freev/free_city url script-response-body https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/gyrfalcon_unlock.js


[MITM]
hostname = www.hillnohouse.com
*/

const AES_KEY_B64 = 'MTIzNDQzMjExMjM0NDMyMTEyMzQ0MzIxMTIzNDQzMjE=';
const AES_IV_B64  = 'MTIzNDU2NzgxMjM0NTY3OA==';

function base64ToBytes(b64) {
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

function bytesToBase64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

const SBOX = [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];
const INV_SBOX = new Array(256);
for (let i = 0; i < 256; i++) INV_SBOX[SBOX[i]] = i;

const RCON = [0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];

function xtime(a) { return ((a << 1) ^ (a & 0x80 ? 0x1b : 0)) & 0xff; }
function mul(a, b) {
  let r = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) r ^= a;
    a = xtime(a);
    b >>= 1;
  }
  return r & 0xff;
}

function expandKey256(key) {
  const Nk = 8, Nr = 14, W = new Uint8Array(4 * 4 * (Nr + 1));
  W.set(key.subarray(0, 32));
  for (let i = Nk; i < 4 * (Nr + 1); i++) {
    let t = W.slice((i - 1) * 4, i * 4);
    if (i % Nk === 0) {
      t = new Uint8Array([SBOX[t[1]] ^ RCON[(i / Nk) - 1], SBOX[t[2]], SBOX[t[3]], SBOX[t[0]]]);
    } else if (i % Nk === 4) {
      t = new Uint8Array([SBOX[t[0]], SBOX[t[1]], SBOX[t[2]], SBOX[t[3]]]);
    }
    for (let j = 0; j < 4; j++) W[i * 4 + j] = W[(i - Nk) * 4 + j] ^ t[j];
  }
  return W;
}

function addRoundKey(state, w, round) {
  for (let i = 0; i < 16; i++) state[i] ^= w[round * 16 + i];
}
function subBytes(s) { for (let i = 0; i < 16; i++) s[i] = SBOX[s[i]]; }
function invSubBytes(s) { for (let i = 0; i < 16; i++) s[i] = INV_SBOX[s[i]]; }
function shiftRows(s) {
  let t;
  t = s[1]; s[1] = s[5]; s[5] = s[9]; s[9] = s[13]; s[13] = t;
  t = s[2]; s[2] = s[10]; s[10] = t; t = s[6]; s[6] = s[14]; s[14] = t;
  t = s[15]; s[15] = s[11]; s[11] = s[7]; s[7] = s[3]; s[3] = t;
}
function invShiftRows(s) {
  let t;
  t = s[13]; s[13] = s[9]; s[9] = s[5]; s[5] = s[1]; s[1] = t;
  t = s[2]; s[2] = s[10]; s[10] = t; t = s[6]; s[6] = s[14]; s[14] = t;
  t = s[3]; s[3] = s[7]; s[7] = s[11]; s[11] = s[15]; s[15] = t;
}
function mixColumns(s) {
  for (let c = 0; c < 4; c++) {
    const i = c * 4;
    const a = [s[i], s[i+1], s[i+2], s[i+3]];
    s[i]   = mul(2,a[0]) ^ mul(3,a[1]) ^ a[2] ^ a[3];
    s[i+1] = a[0] ^ mul(2,a[1]) ^ mul(3,a[2]) ^ a[3];
    s[i+2] = a[0] ^ a[1] ^ mul(2,a[2]) ^ mul(3,a[3]);
    s[i+3] = mul(3,a[0]) ^ a[1] ^ a[2] ^ mul(2,a[3]);
  }
}
function invMixColumns(s) {
  for (let c = 0; c < 4; c++) {
    const i = c * 4;
    const a = [s[i], s[i+1], s[i+2], s[i+3]];
    s[i]   = mul(14,a[0]) ^ mul(11,a[1]) ^ mul(13,a[2]) ^ mul(9,a[3]);
    s[i+1] = mul(9,a[0]) ^ mul(14,a[1]) ^ mul(11,a[2]) ^ mul(13,a[3]);
    s[i+2] = mul(13,a[0]) ^ mul(9,a[1]) ^ mul(14,a[2]) ^ mul(11,a[3]);
    s[i+3] = mul(11,a[0]) ^ mul(13,a[1]) ^ mul(9,a[2]) ^ mul(14,a[3]);
  }
}

function aes256DecryptBlock(block, w) {
  const s = new Uint8Array(block);
  addRoundKey(s, w, 14);
  for (let r = 13; r >= 1; r--) {
    invShiftRows(s);
    invSubBytes(s);
    addRoundKey(s, w, r);
    invMixColumns(s);
  }
  invShiftRows(s);
  invSubBytes(s);
  addRoundKey(s, w, 0);
  return s;
}

function aes256EncryptBlock(block, w) {
  const s = new Uint8Array(block);
  addRoundKey(s, w, 0);
  for (let r = 1; r <= 13; r++) {
    subBytes(s);
    shiftRows(s);
    mixColumns(s);
    addRoundKey(s, w, r);
  }
  subBytes(s);
  shiftRows(s);
  addRoundKey(s, w, 14);
  return s;
}

function cbcDecrypt(ciphertext, keyBytes, ivBytes) {
  const w = expandKey256(keyBytes);
  const blocks = ciphertext.length / 16;
  const out = new Uint8Array(ciphertext.length);
  let prev = ivBytes;
  for (let b = 0; b < blocks; b++) {
    const block = ciphertext.slice(b * 16, (b + 1) * 16);
    const dec = aes256DecryptBlock(block, w);
    for (let i = 0; i < 16; i++) out[b * 16 + i] = dec[i] ^ prev[i];
    prev = block;
  }
  const padLen = out[out.length - 1];
  if (padLen > 0 && padLen <= 16) {
    return out.slice(0, out.length - padLen);
  }
  return out;
}

function cbcEncrypt(plaintext, keyBytes, ivBytes) {
  const padLen = 16 - (plaintext.length % 16);
  const padded = new Uint8Array(plaintext.length + padLen);
  padded.set(plaintext);
  for (let i = plaintext.length; i < padded.length; i++) padded[i] = padLen;
  
  const w = expandKey256(keyBytes);
  const blocks = padded.length / 16;
  const out = new Uint8Array(padded.length);
  let prev = ivBytes;
  for (let b = 0; b < blocks; b++) {
    const block = new Uint8Array(16);
    for (let i = 0; i < 16; i++) block[i] = padded[b * 16 + i] ^ prev[i];
    const enc = aes256EncryptBlock(block, w);
    out.set(enc, b * 16);
    prev = enc;
  }
  return out;
}

const body = $response.body;
if (body) {
  try {
    const key1 = base64ToBytes(AES_KEY_B64); 
    const iv1  = base64ToBytes(AES_IV_B64);  
    
    const KEY2 = new Uint8Array([0x42,0x34,0x18,0x35,0x29,0xe5,0xd9,0x3e,0xc1,0x69,0x76,0xa0,0x40,0xad,0x7d,0xbc,0x7c,0x92,0x70,0x8a,0x0f,0xf8,0x5a,0xb7,0x0b,0x83,0x35,0xca,0x7f,0x4d,0x37,0x3d]);
    const IV2  = new Uint8Array([0x6a,0x30,0x6b,0x70,0x7f,0xa9,0x22,0x40,0x0c,0x9d,0x66,0xa2,0xbc,0x6d,0x12,0x64]);
    
    const ciphertext = base64ToBytes(body);
    const plainBytes = cbcDecrypt(ciphertext, KEY2, IV2);
    let plainText = '';
    for (let i = 0; i < plainBytes.length; i++) plainText += String.fromCharCode(plainBytes[i]);
    
    let json = JSON.parse(plainText);
    if (json.data && Array.isArray(json.data)) {
      json.data.forEach(node => {
        node.premium = false;
      });
    }
    
    const modifiedText = JSON.stringify(json);
    const modifiedBytes = new Uint8Array(modifiedText.length);
    for (let i = 0; i < modifiedText.length; i++) modifiedBytes[i] = modifiedText.charCodeAt(i);
    
    const encrypted = cbcEncrypt(modifiedBytes, KEY2, IV2);
    const newBody = bytesToBase64(encrypted);
    
    $done({ body: newBody });
  } catch (e) {
    console.log('GyrfalconVPN unlock error: ' + e.message);
    $done({});
  }
} else {
  $done({});
}
