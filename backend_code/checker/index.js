const isValidate = (args) => {
  for (const key in args) {
    if (!args[key]) {
      return `${key} is missing`;
    }
  }
  return "true";
};
module.exports = isValidate;
