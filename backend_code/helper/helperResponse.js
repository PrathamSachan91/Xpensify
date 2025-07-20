module.exports.apiResponse = function (
  code,
  error,
  success,
  result,
  msg,
  isValid = true
) {
  return {
    statusCode: code,
    error: error,
    success: success,
    response: result,
    msg: msg,
    isValid: isValid,
  };
};
