export const domain = 'http://10.170.191.57:2000';
// export const domain = 'https://buybot.club';
export const frontend = 'http://10.170.191.57:3000';
export const dollar = "₹"

export const endpoint = {
  registration_api: `${domain}/api/v1/user-registration`,
  login_api: `${domain}/api/v1/user-login`,
  add_income: `${domain}/api/v1/create-income-source`,
  get_user_income: `${domain}/api/v1/finance-list`,
  get_user_income_graph: `${domain}/api/v1/graph-data`,
  add_expense_withimage: `${domain}/api/v1/create-expences-source`,
  add_expense_withoutimage: `${domain}/api/v1/create-expences-source-wimage`,
  get_user_expense: `${domain}/api/v1/finance-list-expe`,
  get_user_expense_graph: `${domain}/api/v1/graph-data`,
  get_dashboard: `${domain}/api/v1/dashboard-data`,
  get_dashboard_finance_data: `${domain}/api/v1/dashboard-finance-data`,
  get_budget_data: `${domain}/api/v1/budget-list`,
  add_budget_data: `${domain}/api/v1/set-budget`,
  get_budget_data_amount: `${domain}/api/v1/get-profile`,

};
