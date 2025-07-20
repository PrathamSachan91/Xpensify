import React, { useState } from "react";
import { endpoint } from "../../../utils/APIRoutes";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import { apiConnectorPost } from "../../../utils/APIConnector";
import { useFormik } from "formik";

const AddIncome = ({ isOpen, onClose }) => {
  const [loding, setLoading] = useState(false);
  const client = useQueryClient();

  const initialValues = {
    inc_source: "",
    inc_amount: "",
    date: "",
  };

  const fk = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: () => {
      const reqbody = {
        inc_source: fk.values.inc_source,
        inc_amount: fk.values.inc_amount,
        date: fk.values.date,
      };
      IncomeFn(reqbody);
    },
  });

  async function IncomeFn(reqbody) {
    setLoading(true);
    try {
      const res = await apiConnectorPost(endpoint?.add_income, reqbody);
      toast(res?.data?.msg);
      fk.handleReset();
      onClose();
      client.refetchQueries("get_income");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Add Income
        </h2>

        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Income Source */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Income Source
          </label>
          <input
            type="text"
            placeholder="Freelance, Salary, etc"
            className="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-400 outline-none"
            id="inc_source"
            name="inc_source"
            value={fk.values.inc_source}
            onChange={fk.handleChange}
            required
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Amount
          </label>
          <input
            type="number"
            placeholder="Amount"
            className="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-400 outline-none"
            id="inc_amount"
            name="inc_amount"
            value={fk.values.inc_amount}
            onChange={fk.handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Date
          </label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-400 outline-none"
            id="date"
            name="date"
            value={fk.values.date}
            onChange={fk.handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={fk.handleSubmit}
            type="submit"
            className="bg-green-700 text-white px-4 py-2 mt-2 rounded hover:bg-green-800 transition"
            disabled={loding}
          >
            {loding ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIncome;
