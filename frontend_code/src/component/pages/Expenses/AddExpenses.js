import React, { useState } from "react";
import { AiOutlineClose, AiOutlinePicture } from "react-icons/ai";
import { apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useFormik } from "formik";

const AddExpense = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadOnly, setUploadOnly] = useState(false);
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
      if (uploadOnly) {
        if (!selectedFile) {
          toast.error("Please upload a receipt image.");
          return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);
        expenseWithImage(formData);
      } else {
        const data = {
          inc_source: fk.values.inc_source,
          inc_amount: fk.values.inc_amount,
          date: fk.values.date,
        };

        // Basic validation (optional)
        if (!data.inc_source || !data.inc_amount || !data.date) {
          toast.error("Please fill all fields.");
          return;
        }
        expenseWithoutImage(data);
      }
    },
  });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  async function expenseWithImage(formData) {
    setLoading(true);
    try {
      const res = await apiConnectorPost(
        endpoint?.add_expense_withimage,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res?.data?.msg);
      fk.resetForm();
      setSelectedFile(null);
      onClose();
      client.refetchQueries("get_expense");
    } catch (e) {
      console.error(e);
      toast.error("Failed to add expense.");
    }
    setLoading(false);
  }

  async function expenseWithoutImage(data) {
    setLoading(true);
    try {
      const res = await apiConnectorPost(
        endpoint?.add_expense_withoutimage,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res?.data?.msg);
      fk.resetForm();
      onClose();
      client.refetchQueries("get_expense");
    } catch (e) {
      console.error(e);
      toast.error("Failed to add expense.");
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 dark:bg-black/70 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[90%] max-w-md relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
        >
          <AiOutlineClose size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-white">
          Add Expense
        </h2>

        {/* Toggle switch */}
        <div className="flex items-center mb-6">
          <span className="mr-3 text-gray-700 dark:text-gray-300">
            Manual Entry
          </span>
          <label
            htmlFor="toggleSwitch"
            className="relative inline-block w-12 h-6"
          >
            <input
              type="checkbox"
              id="toggleSwitch"
              className="opacity-0 w-0 h-0"
              checked={uploadOnly}
              onChange={() => setUploadOnly(!uploadOnly)}
            />
            <span
              className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 rounded-full transition ${
                uploadOnly ? "bg-green-600" : ""
              }`}
            ></span>
            <span
              className={`absolute left-1 top-1 bg-white dark:bg-gray-100 w-4 h-4 rounded-full shadow-md transform transition ${
                uploadOnly ? "translate-x-6" : ""
              }`}
            ></span>
          </label>
          <span className="ml-3 text-gray-700 dark:text-gray-300">
            Upload Receipt Only
          </span>
        </div>

        <form onSubmit={fk.handleSubmit} className="space-y-4">
          {uploadOnly ? (
            <div>
              <label className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-3 rounded cursor-pointer text-sm text-gray-700 dark:text-gray-200">
                <AiOutlinePicture size={18} />
                Upload Receipt
                <input
                  type="file"
                  accept="image/*"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          ) : (
            <>
              <input
                type="text"
                name="inc_source"
                className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Rent, Groceries, etc"
                value={fk.values.inc_source}
                onChange={fk.handleChange}
              />

              <input
                type="number"
                name="inc_amount"
                className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Amount"
                value={fk.values.inc_amount}
                onChange={fk.handleChange}
              />

              <input
                type="date"
                name="date"
                className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={fk.values.date}
                onChange={fk.handleChange}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
