import React from "react";
import { FaWallet, FaArrowUp, FaArrowDown, FaChartLine, FaCalendarDay } from "react-icons/fa";
import { useQuery } from "react-query";
import { apiConnectorGet } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";

const TopCards = () => {
  // Fetch dashboard data using React Query
  const { data } = useQuery(
    ["get_dashboard"],
    () => apiConnectorGet(endpoint?.get_dashboard),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching income data:", err),
    }
  );

  // Extract the response data safely
  const allData = data?.data?.response?.[0]?.data?.[0] || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg+10:grid-cols-3 gap-4 p-4">

      {/* Total Balance = SUM(Credit - Debit) */}
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 dark:bg-slate-800 hover:shadow-xl transition-shadow cursor-pointer">
        <div className="bg-purple-100 text-purple-600 p-3 rounded-full text-xl">
          <FaWallet />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase">Total Balance</p>
          <p className="text-lg font-bold text-white-900">₹ {Number(allData?.net_amount)?.toFixed(2)}</p>
        </div>
      </div>

      {/* Total Income = SUM(ldg_cr_amount) */}
      <div className="bg-white shadow-md rounded-lg dark:bg-slate-800 p-4 flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
        <div className="bg-green-100 text-green-600 p-3 rounded-full text-xl">
          <FaArrowUp />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase">Total Income</p>
          <p className="text-lg font-bold text-green-600">₹ {Number(allData?.total_cr)?.toFixed(2)}</p>
        </div>
      </div>

      {/* Total Expenses = SUM(ldg_dr_amount) */}
      <div className="bg-white shadow-md rounded-lg p-4 dark:bg-slate-800 flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
        <div className="bg-red-100 text-red-600 p-3 rounded-full text-xl">
          <FaArrowDown />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase">Total Expenses</p>
          <p className="text-lg font-bold text-red-600">₹ {Number(allData?.total_dr)?.toFixed(2)}</p>
        </div>
      </div>

      {/* Investment = SUM(ldg_cr_amount WHERE ldg_desc='Investment' AND ldg_type='Cr') */}
      <div className="bg-white shadow-md rounded-lg dark:bg-slate-800 p-4 flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full text-xl">
          <FaChartLine />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase">Investment</p>
          <p className="text-lg font-bold text-green-600">₹ {Number(allData?.inv_total)?.toFixed(2)}</p>
        </div>
      </div>

      {/* Daily Budget = (Total Balance) / (Days remaining in current month) */}
      <div className="bg-white shadow-md rounded-lg dark:bg-slate-800 p-4 flex items-center gap-4 hover:shadow-xl transition-shadow cursor-pointer">
        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full text-xl">
          <FaCalendarDay />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase">Daily Budget</p>
          <p className="text-lg font-bold text-yellow-600">₹ {Number(allData?.budget)?.toFixed(2)}</p>
        </div>
      </div>

    </div>
  );
};

export default TopCards;
