import React, { useState, useContext, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeContext } from "../../../ThemeContext/theme";
import logo from "../../../images/logo_white.png";
import Navbar from "../../Navbar";
import { useQuery } from "react-query";
import { apiConnectorGet, apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import toast from "react-hot-toast";

const DailyBudget = () => {
  const { theme } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(dailyBudget);
  const [page, setPage] = useState(1);

  const { data, refetch } = useQuery(
    ["get_budget", page],
    () =>
      apiConnectorGet(endpoint?.get_budget_data, {
        page: page,
        count: "5",
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching budget data:", err),
    }
  );

  const allData = data?.data?.response || [];

  const addFn = async () => {
    try {
      const response = await apiConnectorPost(endpoint?.add_budget_data, {
        budget: Number(newBudget),
      });
      toast.success(response?.data?.msg);
      refetch();
    } catch (e) {
      toast.error("Something went wrong while updating budget.");
    }
  };
  const { data: seebudget } = useQuery(
    ["get_budget_data_amakj"],
    () =>
      apiConnectorGet(endpoint?.get_budget_data_amount),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching budget data:", err),
    }
  );

  const budget = seebudget?.data?.response?.[0] || [];
  useEffect(() => {
    Number(budget?.curr_budget) >0 && setDailyBudget(Number(budget?.curr_budget))
  }, [budget])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    await addFn();
    setDailyBudget(Number(newBudget));
    setIsEditing(false);
  };

  const withinBudgetDays = allData?.data?.filter((e) => e.total_debit <= dailyBudget).length || 0;
  const overBudgetDays = allData?.data?.length
    ? allData.data.length - withinBudgetDays
    : 0;

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-red-600 dark:bg-red-700 text-white text-2xl font-bold py-4 px-6 shadow-md tracking-wide flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Xpensify Logo"
              className="h-12 w-auto rounded-md shadow-md"
            />
            <span className="text-white text-2xl font-semibold tracking-tight">
              Xpensify Daily Budget
            </span>
          </div>

          <button className="md:hidden text-white" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Navbar />
          </div>

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <div className="fixed z-50 md:hidden bg-red-700 text-white w-64 h-full shadow-lg">
              <Navbar />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 h-full overflow-y-auto text-gray-800 dark:text-gray-100">
            {/* Top Bar */}
            <div className="flex justify-between items-center p-6">
              <h2 className="text-xl font-bold">Daily Budget</h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                >
                  Edit Budget
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white"
                  />
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Budget Summary */}
            <div className="px-6 pb-6">
              <div className="bg-white dark:bg-slate-800 p-6 border rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Budget Overview</h3>
                <p>Current Daily Budget: ₹{dailyBudget}</p>
                <p>Days Within Budget: {withinBudgetDays}</p>
                <p>Days Out of Budget: {overBudgetDays}</p>
              </div>
              <div className="flex justify-between items-center mt-4 mb-2">
                <h3 className="font-semibold text-lg">Daily Overview :</h3>
              </div>
              {/* Daily Updates Table */}
              <div className="overflow-x-auto border rounded-lg mt-6">
                
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                  <thead className="bg-gray-100 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Amount Spent (₹)
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                    {allData?.data?.map((entry, index) => {
                      const isWithin = entry.total_debit <= dailyBudget;
                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                        >
                          <td className="px-4 py-2 text-sm">{entry.created_date}</td>
                          <td className="px-4 py-2 text-sm">
                            ₹{Number(entry.total_debit).toFixed(2)}
                          </td>
                          <td
                            className={`px-4 py-2 text-sm font-semibold ${isWithin ? "text-green-600" : "text-red-500"
                              }`}
                          >
                            {isWithin ? "Within Budget" : "Over Budget"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination (Uncomment if needed) */}
              {/* <CustomToPagination page={page} setPage={setPage} data={allData} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyBudget;
