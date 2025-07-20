import React, { useState } from "react";
import { useQuery } from "react-query";
import { apiConnectorGet } from "../../utils/APIConnector";
import { domain, endpoint } from "../../utils/APIRoutes";
import moment from "moment";
import CustomToPagination from "../../Shared/Pagination";

const Transactions = () => {
  const [page, setPage] = useState(1);
  const { data } = useQuery(
    ["get_all", page],
    () =>
      apiConnectorGet(endpoint?.get_user_income, {
        page: page,
        count: "5",
        type: "All"
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching direct data:", err),
    }
  );

  const allData = data?.data?.response || [];
  return (
  <div className="bg-white flex flex-col justify-between min-h-[548px] dark:bg-slate-800 text-black dark:text-white p-6 rounded-xl shadow-xl transition-colors duration-300">
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg sm:text-xl">Recent Transactions</h3>
      </div>

      <ul className="space-y-5">
        {allData?.data?.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={`${domain}${item.ldg_image}`}
                alt="transaction"
                className="w-10 h-10 object-cover rounded-md"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                  {item.ldg_source}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {moment(item.ldg_createdAt)?.format("DD-MM-YYYY")}
                </p>
              </div>
            </div>
            <div>
              {item?.ldg_type === "Cr" ? (
                <span className="text-green-500 font-semibold text-sm sm:text-base">
                  ₹ {Number(item.ldg_cr_amount)?.toFixed(2)}
                </span>
              ) : (
                <span className="text-red-500 font-semibold text-sm sm:text-base">
                  ₹ {Number(item.ldg_dr_amount)?.toFixed(2)}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="pt-4">
      <CustomToPagination page={page} setPage={setPage} data={allData} />
    </div>
  </div>
);

};

export default Transactions;
