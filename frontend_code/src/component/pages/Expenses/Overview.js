import React from "react";
import { useQuery } from "react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { apiConnectorGet } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import moment from "moment";

const ExpenseOverview = () => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { label, amount } = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow px-4 py-2 rounded text-sm text-gray-700 dark:text-gray-200">
          <p className="font-semibold">{label || "Expense"}</p>
          <p>Amount: ₹{amount}</p>
        </div>
      );
    }
    return null;
  };

  const { data: expense } = useQuery(
    ["get_expense"],
    () => apiConnectorGet(`${endpoint?.get_user_income_graph}?income_type=Dr`),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching expense data:", err),
    }
  );

  const allData = expense?.data?.response || [];
  const data = allData?.map((i) => ({
    date: moment(i?.ldg_datetime)?.format("DD-MM-YYYY"),
    amount: i?.total_dr,
  }));

  return (
    <div className="bg-white flex flex-col justify-center dark:bg-gray-900 p-6 rounded shadow w-full text-gray-800 dark:text-gray-200">
      <h3 className="text-lg font-semibold mb-4 self-start">Expense Overview :</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 self-start">
        Track your spending trends over time and gain insights into where your money goes.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={window.matchMedia('(prefers-color-scheme: dark)').matches ? '#444' : '#ccc'} />
          <XAxis dataKey="date" stroke="#2563EB" />
          <YAxis stroke="#2563EB" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#ff0000"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseOverview;
