const { queryDb } = require("../helper/utilityHelper");

exports.tableMigration = async () => {
  try {
    await queryDb(
      `CREATE TABLE IF NOT EXISTS ledger_details (
  ldg_id INT NOT NULL AUTO_INCREMENT,
  ldg_user_id INT DEFAULT NULL,
  ldg_trans_id VARCHAR(100) DEFAULT NULL,
  ldg_dr_amount DECIMAL(10,5) DEFAULT '0.00000',
  ldg_cr_amount DECIMAL(10,5) DEFAULT '0.00000',
  ldg_type ENUM('Cr','Dr') DEFAULT NULL,
  ldg_source VARCHAR(255) DEFAULT NULL,
  ldg_desc VARCHAR(255) DEFAULT NULL,
  ldg_image VARCHAR(500) DEFAULT NULL,
  ldg_datetime TIMESTAMP NULL DEFAULT NULL,
  ldg_createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ldg_id)
);`
    );
    await queryDb(
      `CREATE TABLE IF NOT EXISTS  users_details (
  user_id INT NOT NULL AUTO_INCREMENT,
  user_unique_id VARCHAR(50) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(15) DEFAULT NULL,
  gender ENUM('Male','Female','Other') DEFAULT NULL,
  date_of_birth DATE DEFAULT NULL,
  address TEXT,
  is_verified TINYINT(1) DEFAULT '0',
  curr_budget DECIMAL(10,5) DEFAULT '0.00000',
  token LONGTEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY email (email));`
    );
    console.log("Migration Successfully Done");
  } catch (e) {
    console.error("Migration Error:", e);
  }
};
