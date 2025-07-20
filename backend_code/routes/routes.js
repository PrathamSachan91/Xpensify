"user-strict";
const express = require("express");
const {
  employeeRegistration,
  employeeLogin,
  createIncomeSource,
  financeList,
  graphData,
  createExpencSource,
  createExpencWithoutImageSource,
  dashboardData,
  financeListDashboard,
  budgetList,
  setBudget,
  getUserProfile,
} = require("../controller/auth");
const { isAuthCheck } = require("../middleware");

const router = express.Router();
router.post("/user-registration", employeeRegistration);
router.post("/user-login", employeeLogin);
router.post("/create-income-source", isAuthCheck, createIncomeSource);
router.post("/create-expences-source", isAuthCheck, createExpencSource);
router.post(
  "/create-expences-source-wimage",
  isAuthCheck,
  createExpencWithoutImageSource
);
router.get("/finance-list", isAuthCheck, financeList);
router.get("/graph-data", isAuthCheck, graphData);
router.get("/dashboard-data", isAuthCheck, dashboardData);
router.get("/dashboard-finance-data", isAuthCheck, financeListDashboard);
router.get("/budget-list", isAuthCheck, budgetList);
router.post("/set-budget", isAuthCheck, setBudget);
router.get("/get-profile", isAuthCheck, getUserProfile);
module.exports = router;
