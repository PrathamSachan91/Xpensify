import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { apiConnectorGet } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import { useQuery } from "react-query";

ChartJS.register(ArcElement, Tooltip, Legend);

const FinancialChart = () => {
  const { data: graph } = useQuery(
    ["get_dashboard"],
    () => apiConnectorGet(endpoint?.get_dashboard),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching financial data:", err),
    }
  );

  const allData = graph?.data?.response?.[0]?.data?.[0] || {};

  const totalBalance = parseFloat(allData?.net_amount || 0);
  const totalIncome = parseFloat(allData?.total_cr || 0);
  const totalExpense = parseFloat(allData?.total_dr || 0);

  const data = {
    labels: ["Total Balance", "Total Income", "Total Expenses"],
    datasets: [
      {
        label: "Financial Data",
        data: [
          totalBalance.toFixed(2),
          totalIncome.toFixed(2),
          totalExpense.toFixed(2),
        ],
        backgroundColor: ["#6A5ACD", "#2ECC71", "#E74C3C"],
        hoverOffset: 20,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
          color:"#2563EB",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-md mx-auto dark:bg-slate-800">
      <h3 className="font-semibold text-lg mb-4 dark:text-gray-100">
        Financial Overview
      </h3>
      <Pie data={data} options={options} />
      <div className="text-center font-bold text-lg mt-4 dark:text-gray-100">
        Net Balance: ₹ {totalBalance.toLocaleString()}
      </div>
    </div>
  );
};

export default FinancialChart;
