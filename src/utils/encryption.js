
import CryptoJS from 'crypto-js';

export const encryptSecret = (secretPhrase, password) => {
  return CryptoJS.AES.encrypt(secretPhrase, password).toString();
};
export const decryptSecret = (encryptedSecret, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedSecret, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
