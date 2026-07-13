/**
 * 「暗号传输柜」前端端到端加解密核心工具库
 * 基于浏览器原生 Web Crypto API 实现，零外部依赖，确保完全在本地处理加解密。
 */

// --- 基础工具函数：字节数组与 Base64 互转 ---

/**
 * 将 Uint8Array 转换为 Base64 字符串
 */
export function bytesToBase64(bytes: Uint8Array): string {
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binString);
}

/**
 * 将 Base64 字符串转换为 Uint8Array
 */
export function base64ToBytes(base64: string): Uint8Array {
  const binString = atob(base64);
  return Uint8Array.from(binString, (char) => char.charCodeAt(0));
}

// --- 核心加密算法 ---

/**
 * 辅助函数：通过密码和盐值派生 AES-GCM 256 位密钥
 * 使用 PBKDF2 算法，迭代 100,000 次，哈希算法为 SHA-256
 */
async function deriveAesKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  // 1. 导入原始密码为 PBKDF2 基础密钥
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBytes as any,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // 2. 派生 AES-GCM 对称密钥
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * 辅助函数：计算密码验证器哈希 SHA-256(password + verifierSalt)
 * 用于在不暴露密码的前提下，供服务器安全地校验密码正确性
 */
export async function computeVerifier(password: string, verifierSaltBase64: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const verifierSaltBytes = base64ToBytes(verifierSaltBase64);

  // 拼接密码字节和验证盐字节
  const combinedBytes = new Uint8Array(passwordBytes.length + verifierSaltBytes.length);
  combinedBytes.set(passwordBytes, 0);
  combinedBytes.set(verifierSaltBytes, passwordBytes.length);

  // 计算 SHA-256 哈希
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", combinedBytes as any);
  return bytesToBase64(new Uint8Array(hashBuffer));
}

/**
 * 加密明文字符串 (端到端加密)
 * 返回密文及加解密/验证所需的所有随机盐与向量
 */
export async function encryptData(
  plaintext: string,
  password: string
): Promise<{
  ciphertext: string;
  iv: string;
  salt: string;
  verifier: string;
  verifierSalt: string;
}> {
  // 1. 生成加密随机盐 S1 (16字节) 和 IV (12字节)
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 2. 派生 AES 密钥并加密数据
  const key = await deriveAesKey(password, salt);
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(plaintext);

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as any,
    },
    key,
    plaintextBytes as any
  );

  // 3. 生成密码验证盐 S2 (16字节) 并计算验证器
  const verifierSalt = window.crypto.getRandomValues(new Uint8Array(16));
  const verifierSaltBase64 = bytesToBase64(verifierSalt);
  const verifier = await computeVerifier(password, verifierSaltBase64);

  return {
    ciphertext: bytesToBase64(new Uint8Array(ciphertextBuffer)),
    iv: bytesToBase64(iv),
    salt: bytesToBase64(salt),
    verifier,
    verifierSalt: verifierSaltBase64,
  };
}

/**
 * 解密数据 (端到端解密)
 * 如果密码错误或数据被篡改，AES-GCM 解密会抛出异常
 */
export async function decryptData(
  ciphertextBase64: string,
  ivBase64: string,
  saltBase64: string,
  password: string
): Promise<string> {
  const ciphertextBytes = base64ToBytes(ciphertextBase64);
  const ivBytes = base64ToBytes(ivBase64);
  const saltBytes = base64ToBytes(saltBase64);

  // 1. 派生 AES 密钥
  const key = await deriveAesKey(password, saltBytes);

  // 2. 解密密文
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBytes as any,
    },
    key,
    ciphertextBytes as any
  );

  // 3. 解码为字符串
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

// --- 文件封装与解析工具 ---

export interface FilePayload {
  filename: string;
  filetype: string;
  content: string; // 文件内容的 Base64 编码
}

/**
 * 将文件读取并打包为加密专用的明文 JSON 字符串
 */
export function packFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(reader.result);
        const base64Content = bytesToBase64(bytes);
        const payload: FilePayload = {
          filename: file.name,
          filetype: file.type || "application/octet-stream",
          content: base64Content,
        };
        resolve(JSON.stringify(payload));
      } else {
        reject(new Error("文件读取失败"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 解密后还原文件并触发浏览器下载
 */
export function unpackAndDownloadFile(decryptedJson: string): void {
  try {
    const payload = JSON.parse(decryptedJson) as FilePayload;
    if (!payload.filename || !payload.content) {
      throw new Error("无效的文件数据格式");
    }

    const fileBytes = base64ToBytes(payload.content);
    const blob = new Blob([fileBytes as any], { type: payload.filetype });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = payload.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    throw new Error("还原并下载文件失败，可能是解密数据损坏");
  }
}
