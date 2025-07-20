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
import { endpoint } from "../../utils/APIRoutes";
import { apiConnectorGet } from "../../utils/APIConnector";
import { useQuery } from "react-query";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const IncomeChart = () => {
  const { data: expense } = useQuery(
    ["get_dashboard_finance", "Cr"],
    () => apiConnectorGet(`${endpoint?.get_dashboard_finance_data}?type=Cr`),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching income data:", err),
    }
  );

  const allData = expense?.data?.response || [];

  const data = {
    labels: allData.map((i) => i?.ldg_source || ""),
    datasets: [
      {
        label: "Income",
        data: allData.map((i) => Number(i?.cr_amount || 0)),
        backgroundColor: "#00ff00",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed.y || 0;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#2563EB", // for dark mode
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#2563EB",
        },
      },
    },
  };

  const totalIncome = data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="bg-white flex flex-col justify-center items-center dark:bg-slate-800 p-6 rounded shadow w-full">
      <h3 className="font-semibold text-lg mb-4 dark:text-gray-100">
        Last 30 Days Income
      </h3>
      <Bar data={data} options={options} />
      <div className="text-center font-bold text-xl mt-4 dark:text-gray-100">
        Total Income:₹{totalIncome.toLocaleString()}
      </div>
    </div>
  );
};

export default IncomeChart;
