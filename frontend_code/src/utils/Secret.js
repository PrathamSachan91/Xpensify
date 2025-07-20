import CryptoJS from "crypto-js";

export const deCryptData = (data) => {
  const value =
    (data &&
      CryptoJS.AES.decrypt(data, "jkljldfjasoisjfndmf34534534klj5345jkj5hlk5jkjl5h45h3453kl534lk6klj6h34534vbhghfcgfg")?.toString(CryptoJS.enc.Utf8)) ||
    null;
  return value && JSON.parse(value);
};
export const enCryptData = (data) => {
  const value =
    data && CryptoJS.AES.encrypt(JSON.stringify(data), "jkljldfjasoisjfndmf34534534klj5345jkj5hlk5jkjl5h45h3453kl534lk6klj6h34534vbhghfcgfg")?.toString();
  return value;
};
