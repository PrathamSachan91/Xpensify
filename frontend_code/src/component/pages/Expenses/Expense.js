import React, { useState, useContext } from "react";
import ExpenseBarChart from "./Overview";
import ExpenseList from "./ExpensesList";
import Navbar from "../../Navbar";
import AddExpense from "./AddExpenses";
import { Menu, X } from "lucide-react";
import { ThemeContext } from "../../../ThemeContext/theme";
import logo from "../../../images/logo_white.png";

const Expense = () => {
  const { theme } = useContext(ThemeContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">

        {/* Header */}
        <header className="bg-emerald-600 dark:bg-emerald-700 text-white text-2xl font-bold py-4 px-6 shadow-md tracking-wide flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Xpensify Logo" className="h-12 w-auto max-w-[200px] rounded-md shadow-md" />
            <span className="text-white text-2xl font-semibold tracking-tight">Xpensify Expense</span>
          </div>

          {/* Hamburger Button */}
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
          <div className="flex-1  h-[calc(100vh-4rem)] overflow-y-auto example text-gray-800 dark:text-gray-100">
            {/* Top Bar */}
            <div className="flex justify-between items-center p-6">
              <h2 className="text-xl font-bold">Expense</h2>
              <button
                className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                onClick={() => setModalOpen(true)}
              >
                + Add Expense
              </button>
            </div>

            {/* Modal */}
            <AddExpense
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onAddExpense={handleAddExpense}
            />

            {/* Chart */}
            <div className="px-6 pb-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <ExpenseBarChart />
              </div>

              {/* Header with download */}
              <div className="mt-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Expense Summary</h3>
               
              </div>

              {/* List */}
              <ExpenseList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
