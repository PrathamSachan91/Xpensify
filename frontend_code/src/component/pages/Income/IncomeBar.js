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
import { apiConnectorGet } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import dayjs from "dayjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const IncomeBarChart = () => {
  const { data: income } = useQuery(
    ["get_income"],
    () => apiConnectorGet(endpoint?.get_user_income_graph),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching income data:", err),
    }
  );

  const allData = income?.data?.response || [];

  // Format labels and values
  const labels = allData.map(item =>
    dayjs(item.ldg_datetime).format("MMM D, HH:mm")
  );

  const values = allData.map(item =>
    parseFloat(item.total_cr)
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: values,
        backgroundColor: "#15803d",
        borderRadius: 6,
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

  return (
    <div className="bg-white flex flex-col justify-center items-center dark:bg-slate-800 p-6 rounded shadow w-full" style={{ height: "300px", width: "100%" }}>
      <h3 className="text-lg font-semibold mb-4 self-start">Income Overview :</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default IncomeBarChart;
