
import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { apiConnectorGet } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExpenseChart = () => {
  const { data: expense } = useQuery(
    ["get_dashboard_finnace"],
    () => apiConnectorGet(`${endpoint?.get_dashboard_finance_data}?type=Dr`),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching income data:", err),
    }
  );

  const allData = expense?.data?.response|| [];

  const data = {
    labels:allData?.map((i)=>i?.ldg_source||"")||["",""],
    datasets: [
      {
        label: "Amount",
        data: allData?.map((i)=>Number(i?.dr_amount||0))||[],
        backgroundColor: "#ff0000",
        borderRadius: 5,
      },
    ],
  };

  const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#2563EB',
      },
    },
    x: {
      ticks: {
        color: '#2563EB',
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
const totalIncome = data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
  return (
    <div className="bg-white flex flex-col justify-center items-center dark:bg-slate-800 p-6 rounded shadow w-full">
      <h3 className="font-semibold text-lg mb-4 dark:text-gray-100">Last 30 Days Expenses</h3>
      <Bar data={data} options={options} />
      <div className="text-center font-bold text-xl mt-4 dark:text-gray-100">
        Total Expense: ₹{totalIncome.toLocaleString()}
      </div>
    </div>
  );
};

export default ExpenseChart;
