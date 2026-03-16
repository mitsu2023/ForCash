import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM = "aes-256-cbc"

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) throw new Error("ENCRYPTION_KEY is not set")
  // Use first 32 bytes of the key string
  return Buffer.from(key.padEnd(32, "0").slice(0, 32), "utf-8")
}

export function encrypt(text: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(text, "utf-8"), cipher.final()])
  return iv.toString("hex") + ":" + encrypted.toString("hex")
}

export function decrypt(data: string): string {
  const [ivHex, encryptedHex] = data.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const encrypted = Buffer.from(encryptedHex, "hex")
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf-8")
}
