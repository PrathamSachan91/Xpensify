const {
  randomStrNumeric,
  enCryptData,
  queryDb,
  deCryptData,
} = require("../helper/utilityHelper");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Make sure you installed with: npm i bcrypt
const { dss, sr, sww, rae, dgs } = require("../msgHelper");
const { apiResponse } = require("../helper/helperResponse");
const sequelize = require("../config/seq.config");
const moment = require("moment");
const { ensureUpload } = require("../utils/HandleFiles");
const Tesseract = require("tesseract.js");
const axios = require("axios");
require("dotenv").config();

exports.employeeRegistration = async (req, res) => {
  const { mobile, name = "N/A", email = "", password } = req.body;
  if (!mobile || !password || !email || !name) {
    return res
      .status(400)
      .json(apiResponse(400, false, false, [], "Please fill all details!"));
  }
  try {
    const isAlreadyExist = await queryDb(
      "SELECT * FROM `users_details` WHERE (`mobile_number` = ? OR email  = ?) LIMIT 1;",
      [mobile, email]
    );

    if (isAlreadyExist?.length > 0) {
      return res
        .status(201)
        .json(apiResponse(201, false, false, [], "User already exists!"));
    }
    const randomId = "EMP" + randomStrNumeric(10);
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
      INSERT INTO users_details
      (user_unique_id, full_name, email, password_hash, mobile_number, gender, date_of_birth, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    await queryDb(insertQuery, [
      randomId,
      name,
      email,
      hashedPassword,
      mobile,
      1,
      null,
      "",
    ]);

    const last_id_result = await queryDb(
      "SELECT LAST_INSERT_ID() AS l_id;",
      []
    );
    const user_id = last_id_result?.[0]?.l_id;

    const payload = {
      user_id: user_id,
      mobile,
      email,
      name,
    };
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiry
        data: payload,
      },
      process.env.JWT_SECRET,
      { algorithm: "HS256" } // Use RS256 only if you're using key pair
    );

    await queryDb("UPDATE users_details SET token = ? WHERE user_id = ?;", [
      token,
      user_id,
    ]);

    return res.status(200).json({
      msg: "Registration Successfully",
      token,
    });
  } catch (e) {
    console.error("Registration Error:", e);
    return res
      .status(500)
      .json(apiResponse(500, true, false, [], "Something went wrong."));
  }
};

exports.employeeLogin = async (req, res) => {
  const { password, username } = req.body;
  if (!password || !username) {
    return res.status(400).json({ msg: "Username and password are required" });
  }
  try {
    const result = await queryDb(
      `SELECT * FROM users_details 
       WHERE (email = ? OR mobile_number = ?) LIMIT 1;`,
      [username, username]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
    const payload = {
      user_id: user.user_id,
      name: user.full_name,
      email: user.email,
      mobile: user.mobile_number,
    };
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiry
        data: payload,
      },
      process.env.JWT_SECRET,
      { algorithm: "HS256" } // Use RS256 only if using key pair
    );
    await queryDb("UPDATE users_details SET token = ? WHERE user_id = ?", [
      token,
      user.user_id,
    ]);

    return res.status(200).json({
      msg: "Login successfully",
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong in login process" });
  }
};
exports.createIncomeSource = async (req, res) => {
  const user_id = req.user_id;
  const { inc_source, inc_amount, date } = req.body;
  const inc_image='/uploads/salary.png';
  if (!inc_source | !inc_amount || !date)
    return res.status(201).json({ msg: "Please fill all details!" });
  try {
    const randomId = randomStrNumeric(15);
    await queryDb(
      "INSERT INTO `ledger_details`(ldg_user_id,`ldg_trans_id`,`ldg_dr_amount`,ldg_cr_amount,`ldg_type`,ldg_source,`ldg_desc`,ldg_datetime,ldg_image) VALUES(?,?,?,?,?,?,?,?,?);",
      [
        user_id,
        randomId,
        0,
        Number(inc_amount),
        1,
        inc_source?.trim(),
        "Income from " + inc_source,
        date,
        inc_image,
      ]
    );
    return res.status(200).json(apiResponse(200, false, true, [], dss));
  } catch (e) {
    return res
      .status(500)
      .json(apiResponse(500, true, false, [], e.message + sr || sww));
  }
};

exports.financeList = async (req, res) => {
  const user_id = req.user_id;

  try {
    const {
      search = "",
      start_date = "",
      end_date = "",
      page = 1,
      count = 10,
      type = "All",
    } = req.query;
    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(count), 1);
    const offset = (pageNumber - 1) * pageSize;

    let countQuery = `SELECT COUNT(*) AS cnt FROM ledger_details WHERE ldg_user_id = ?  `;
    let baseQuery = `SELECT * FROM ledger_details WHERE ldg_user_id = ? `;
    let reP = [Number(user_id)];
    let reB = [Number(user_id)];
    if (type !== "All") {
      countQuery += " AND  ldg_type = ? ";
      baseQuery += " AND  ldg_type = ? ";
      reP.push(type);
      reB.push(type);
    }
    if (start_date && end_date) {
      const start = moment(start_date).format("YYYY-MM-DD");
      const end = moment(end_date).format("YYYY-MM-DD");
      countQuery += " AND DATE(ldg_datetime) BETWEEN ? AND ? ";
      baseQuery += " AND DATE(ldg_datetime) BETWEEN ? AND ? ";
      reP.push(start, end);
      reB.push(start, end);
    }

    if (search) {
      const like = `%${search}%`;
      const searchCond = `
        AND (
          ldg_trans_id LIKE ? OR
          ldg_source LIKE ?
        )`;
      countQuery += searchCond;
      baseQuery += searchCond;
      const values = Array(2).fill(like);
      reP.push(...values);
      reB.push(...values);
    }

    baseQuery += " ORDER BY ldg_createdAt DESC LIMIT ? OFFSET ?";
    reB.push(pageSize, offset);

    const totalRowsResult = await queryDb(countQuery, reP);
    const totalRows = Number(totalRowsResult?.[0]?.cnt) || 0;
    const result = await queryDb(baseQuery, reB);

    return res.status(200).json(
      apiResponse(
        200,
        false,
        true,
        {
          data: result,
          totalPage: Math.ceil(totalRows / pageSize),
          currPage: pageNumber,
        },
        dgs
      )
    );
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json(apiResponse(true, false, [], e.message || `Internal Server Error`));
  }
};
exports.financeListDashboard = async (req, res) => {
  const user_id = req.user_id;

  try {
    const { type = "Cr", day = 30 } = req.query;

    const result = await queryDb(
      "SELECT (`ldg_dr_amount`) AS dr_amount,(`ldg_cr_amount`) AS cr_amount,`ldg_source`,`ldg_createdAt` FROM `ledger_details` WHERE `ldg_user_id` = ? AND `ldg_type` = ? AND DATE(`ldg_createdAt`)>= DATE(NOW()) - INTERVAL ? DAY;",
      [Number(user_id), type, Number(day)]
    );

    return res.status(200).json(apiResponse(200, false, true, result, dgs));
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json(apiResponse(true, false, [], e.message || `Internal Server Error`));
  }
};

exports.graphData = async (req, res) => {
  const user_id = req.user_id;
  const { income_type = "Cr" } = req.query;
  try {
    const result = await queryDb(
      "SELECT SUM(`ldg_cr_amount`) AS total_cr,SUM(`ldg_dr_amount`) AS total_dr,`ldg_datetime` FROM `ledger_details` WHERE `ldg_user_id` = ? AND `ldg_type`  = ? AND DATE(ldg_datetime) >= DATE(NOW()) - INTERVAL 30 DAY GROUP BY `ldg_datetime` ORDER BY `ldg_datetime`",
      [user_id, income_type]
    );

    return res.status(200).json(apiResponse(200, false, true, result, dgs));
  } catch (e) {
    return res
      .status(500)
      .json(apiResponse(true, false, [], e.message || `Internal Server Error`));
  }
};
exports.createExpencWithoutImageSource = async (req, res) => {
  const user_id = req.user_id;
  const { inc_source, inc_amount, date } = req.body;
  const inc_image = "/uploads/defaultSlip.png";
  if (!inc_source | !inc_amount || !date)
    return res.status(201).json({ msg: "Please fill all details!" });

  const t = await sequelize.transaction();
  try {
    const randomId = randomStrNumeric(15);
    await queryDb(
      `INSERT INTO ledger_details
       (ldg_user_id, ldg_trans_id, ldg_dr_amount, ldg_cr_amount, ldg_type, ldg_source, ldg_desc, ldg_datetime, ldg_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        randomId,
        inc_amount,
        0,
        2,
        inc_source?.trim(),
        "Expense: " + inc_source,
        date,
        inc_image
      ]
    );

    await t.commit();
    return res
      .status(200)
      .json(apiResponse(200, false, true, [], "Expense saved successfully"));
  } catch (e) {
    await t.rollback();
    return res
      .status(500)
      .json(
        apiResponse(500, true, false, [], e.message || "Something went wrong")
      );
  }
};

exports.createExpencSource = async (req, res) => {
  const user_id = req.user_id;
  const file = req.files?.file;
  console.log("inside the funciton")
  if (!file) {
    return res.status(400).json({ msg: "No image file uploaded!" });
  }

  const t = await sequelize.transaction();
  try {
    const uploadedPath = await ensureUpload(file);
    console.log("here",`${process.env.BASE_URL}${uploadedPath}`)
    const {
      amount = 0,
      date = moment()?.format("YYYY-MM-DD"),
      source = "N/A",
      text,
    } = await extractExpenseFromImage(`${process.env.BASE_URL}${uploadedPath}`);
    if (!amount) {
      return res.status(422).json({
        msg: "Could not extract required details from image",
        extracted_text: text,
      });
    }

    const randomId = randomStrNumeric(15);

    await queryDb(
      `INSERT INTO ledger_details
       (ldg_user_id, ldg_trans_id, ldg_dr_amount, ldg_cr_amount, ldg_type, ldg_source, ldg_desc, ldg_datetime, ldg_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        randomId,
        amount,
        0,
        2,
        source?.trim(),
        "Expense: " + source,
        date,
        uploadedPath,
      ]
    );

    await t.commit();
    return res
      .status(200)
      .json(
        apiResponse(
          200,
          false,
          true,
          { file_path: uploadedPath, extracted_text: text },
          "Expense saved successfully"
        )
      );
  } catch (e) {
    await t.rollback();
    console.error(e);
    return res
      .status(500)
      .json(
        apiResponse(500, true, false, [], e.message || "Something went wrong")
      );
  }
};

async function extractExpenseFromImage(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

  const imageBuffer = Buffer.from(response.data, "binary");

  const result = await Tesseract.recognize(imageBuffer, "eng");

  const text = result?.data?.text;
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let amount = null;
  let total = null;
  let date = null;
  let source = null;

  const importantLines = [];
  let maxAmountFound = 0;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (
      /net\s*amount/i.test(line) ||
      /total\s*amount/i.test(line) ||
      /total\s*[:\-]?\s*\d/i.test(line) ||
      /gross\s*[:\-]?\s*\d/i.test(line) ||
      /amount\s*payable/i.test(line) ||
      /grand\s*total/i.test(line) ||
      /net payable/i.test(line)
    ) {
      importantLines.push(line);

      // Try to extract amount from these lines
      const match = line.match(/([0-9,]+\.\d{2})/);
      if (match) {
        const val = parseFloat(match[1].replace(/,/g, ""));
        if (val > maxAmountFound) {
          maxAmountFound = val;
        }
      }
    }

    // Extract date
    if (!date) {
      const match = line.match(/(\d{2}-[A-Za-z]{3}-\d{4})/);
      if (match) date = new Date(match[1]);
    }

    // Extract source (agency)
    if (!source && /^[A-Za-z\s]+Agency$/i.test(line)) {
      source = line.trim();
    }
  }

  // Set amount based on largest amount found in important lines
  if (!amount && maxAmountFound > 0) {
    amount = maxAmountFound;
  }

  return {
    amount: amount || null,
    date: date ? date.toISOString().slice(0, 10) : null,
    source: source || "Unknown Source",
    important: importantLines,
    text,
    Total: total || null,
  };
}
exports.dashboardData = async (req, res) => {
  const user_id = req.user_id;
  const t = await sequelize.transaction();
  try {
    const respose = await queryDb(
      `SELECT SUM(IFNULL((IFNULL(ldg_cr_amount,0)-IFNULL(ldg_dr_amount,0)),0)) AS net_amount,
        SUM(IFNULL((IFNULL(ldg_cr_amount,0)-IFNULL(ldg_dr_amount,0)),0))/(DAY(LAST_DAY(CURDATE())) - DAY(CURDATE())) AS budget,
        SUM(IFNULL(ldg_cr_amount,0)) AS total_cr,
        SUM(IFNULL(ldg_dr_amount,0)) AS total_dr,
        SUM(CASE 
         WHEN ldg_type = 'Cr' AND ldg_source = 'Investment' 
         THEN IFNULL(ldg_cr_amount, 0) 
         ELSE 0 END) AS inv_total 
         FROM ledger_details  WHERE ldg_user_id = ?;`,
      [user_id]
    );
    const groupWise = await queryDb(
      `SELECT 
        SUM(IFNULL(ldg_cr_amount,0)) AS total_cr,ldg_source
        FROM ledger_details  WHERE ldg_user_id = ? group by ldg_source;`,
      [user_id]
    );

    await t.commit();
    return res.status(200).json(
      apiResponse(
        200,
        false,
        true,
        [
          {
            data: respose,
            source_wise: groupWise,
          },
        ],
        "Expense saved successfully"
      )
    );
  } catch (e) {
    await t.rollback();
    return res
      .status(500)
      .json(
        apiResponse(500, true, false, [], e.message || "Something went wrong")
      );
  }
};
exports.budgetList = async (req, res) => {
  const user_id = req.user_id;

  try {
    const { start_date = "", end_date = "", page = 1, count = 10 } = req.query;

    const result = await queryDb(
      `
    SELECT 
      DATE(ldg_datetime) AS created_date,
      SUM(ldg_dr_amount) AS total_debit
    FROM ledger_details
    WHERE ldg_user_id = ? AND ldg_type = 'Dr'
    GROUP BY DATE(ldg_datetime)
    ORDER BY DATE(ldg_datetime) DESC
    `,
      [Number(user_id)]
    );

    return res.status(200).json(
      apiResponse(200, false, true, {
        data: result,
        // totalPage: Math.ceil(totalRows / pageSize),
        // currPage: pageNumber,
      })
    );
  } catch (e) {
    console.error("budgetList error:", e);
    return res
      .status(500)
      .json(apiResponse(true, false, [], e.message || "Internal Server Error"));
  }
};
exports.setBudget = async (req, res) => {
  const user_id = req.user_id;
  const { budget = 0 } = req.body;
  if (!budget)
    return res
      .status(201)
      .json(apiResponse(true, false, [], "Amount is Required!"));
  const t = await sequelize.transaction();
  try {
    await queryDb(
      "UPDATE `users_details` SET `curr_budget` = ? WHERE `user_id` = ? LIMIT 1;",
      [Number(budget), user_id]
    );

    await t.commit();
    return res
      .status(200)
      .json(apiResponse(200, false, true, [], "Budget saved successfully"));
  } catch (e) {
    await t.rollback();
    return res
      .status(500)
      .json(
        apiResponse(500, true, false, [], e.message || "Something went wrong")
      );
  }
};
exports.getUserProfile = async (req, res) => {
  const user_id = req.user_id;
  const t = await sequelize.transaction();
  try {
    const response = await queryDb(
      "SELECT `user_unique_id`,`full_name`,`email`,`mobile_number`,`gender`,`date_of_birth`,`curr_budget`,`created_at` FROM `users_details` WHERE `user_id` = ? LIMIT 1;",
      [user_id]
    );

    await t.commit();
    return res
      .status(200)
      .json(
        apiResponse(200, false, true, response, "Budget saved successfully")
      );
  } catch (e) {
    await t.rollback();
    return res
      .status(500)
      .json(
        apiResponse(500, true, false, [], e.message || "Something went wrong")
      );
  }
};
