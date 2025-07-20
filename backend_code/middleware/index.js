"user strict";
const { queryDb } = require("../helper/utilityHelper");
const { apiResponse } = require("../helper/helperResponse");
require("dotenv").config();

exports.isAuthCheck = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(
        apiResponse(
          401,
          false,
          false,
          [],
          "Authorization header missing or invalid",
          false
        )
      );
  }
  const token = authHeader?.split(" ")?.[1];
  if (!token) {
    return res
      .status(201)
      .json(apiResponse(201, false, false, [], "Missing Token", false));
  }
  const isAvailable = await queryDb(
    "SELECT * FROM `users_details` WHERE `token`  = ? LIMIT 1;",
    [token]
  );
  if (!isAvailable || isAvailable?.length <= 0) {
    return res
      .status(201)
      .json(apiResponse(201, false, false, [], "Invalid Token", false));
  }
  req.user_id = isAvailable?.[0]?.user_id;
  req.user_unique_id = isAvailable?.[0]?.user_unique_id;
  next();
};
