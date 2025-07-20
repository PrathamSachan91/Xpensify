import { useFormik } from "formik";
import { useState } from "react";
import { FiTrendingDown } from "react-icons/fi";
import { useQuery, useQueryClient } from "react-query";
import { apiConnectorGet } from "../../../utils/APIConnector";
import { domain, endpoint } from "../../../utils/APIRoutes";
import CustomToPagination from "../../../Shared/Pagination";
import moment from "moment";

const AllExpenses = () => {
  const [page, setPage] = useState(1);
  const client = useQueryClient();

  const initialValues = {
    type: "",
    search: "",
    count: 10,
    start_date: "",
    end_date: "",
  };

  const fk = useFormik({
    initialValues,
    enableReinitialize: true,
  });

  const { data } = useQuery(
    [
      "get_expense",
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      page,
    ],
    () =>
      apiConnectorGet(endpoint?.get_user_income, {
        search: fk.values.search,
        start_date: fk.values.start_date,
        end_date: fk.values.end_date,
        page: page,
        count: "10",
        type: "Dr",
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
    <>
      {/* Filter Inputs */}
      <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
          <input
            type="date"
            name="start_date"
            id="start_date"
            value={fk.values.start_date}
            onChange={fk.handleChange}
            className="text-black border border-gray-600 dark:text-white dark:bg-gray-900 rounded-md py-2 px-4 focus:outline-none w-50 md:w-full text-sm"
          />
          <input
            type="date"
            name="end_date"
            id="end_date"
            value={fk.values.end_date}
            onChange={fk.handleChange}
            className="text-black border border-gray-600 dark:text-white dark:bg-gray-900 rounded-md py-2 px-4 focus:outline-none w-50 md:w-full text-sm"
          />
          <input
            type="text"
            name="search"
            id="search"
            value={fk.values.search}
            onChange={fk.handleChange}
            placeholder="Search"
            className="text-black border border-gray-600 dark:text-white dark:bg-gray-900 rounded-md placeholder-black dark:placeholder-white py-2 px-4 w-50 md:w-full text-sm"
          />
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                setPage(1);
                client.invalidateQueries({ queryKey: ["get_income"] });
              }}
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md w-full md:w-auto text-sm transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => {
                fk.handleReset();
                setPage(1);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md w-full md:w-auto text-sm transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Expense Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allData?.data?.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md dark:shadow-slate-700 flex justify-between items-center transition-colors duration-300"
          >
            <div className="flex gap-3 items-center">
              <img
                src={`${domain}${item.ldg_image}`}
                alt="expense"
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {item.ldg_source}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-400">
                  {moment(item.ldg_createdAt)?.format("DD-MM-YYYY")}
                </p>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <div className="text-red-500 font-semibold flex items-center gap-2">
                ₹{Number(item.ldg_dr_amount)?.toFixed(2)}
                <FiTrendingDown />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-400">
                {moment(item.ldg_datetime)?.format("DD-MM-YYYY")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <CustomToPagination page={page} setPage={setPage} data={allData} />
      </div>
    </>
  );
};

export default AllExpenses;
