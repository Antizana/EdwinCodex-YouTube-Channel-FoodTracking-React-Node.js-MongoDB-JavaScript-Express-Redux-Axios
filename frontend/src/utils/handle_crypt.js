import { hash as _hash, compare as _compare } from "bcrypt";

export async function encrypt(plainText) {
  const hash = await _hash(plainText, 10);
  return hash;
}

export async function compare(plainPassword, hashPassword) {
  return await _compare(plainPassword, hashPassword);
}
