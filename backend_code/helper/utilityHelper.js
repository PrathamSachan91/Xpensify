"user strict";
const sequelize = require("../config/seq.config");
const CryptoJS = require("crypto-js");
require("dotenv").config();
module.exports = {
  deCryptData: (data) => {
    const value =
      (data &&
        CryptoJS.AES.decrypt(data, process.env.JWT_SECRET)?.toString(
          CryptoJS.enc.Utf8
        )) ||
      null;
    return value && JSON.parse(value);
  },
  enCryptData: (data) => {
    const value =
      data &&
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.JWT_SECRET
      )?.toString();
    return value;
  },

  randomStrNumeric: function (len) {
    let ans = "";
    let arr = "1234567890";
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  },
  randomStrAlphabet: function (len) {
    let ans = "";
    let arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  },
  randomStrAlphabetNumeric: function (len) {
    let ans = "";
    let arr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  },

  queryDb: function (query, param) {
    return new Promise((resolve, reject) => {
      sequelize
        .query(query, {
          replacements: param,
        })
        .then((res) => {
          return resolve(res?.[0]);
        })
        .catch((e) => {
          return console.log(e);
        });
    });
  },
};
