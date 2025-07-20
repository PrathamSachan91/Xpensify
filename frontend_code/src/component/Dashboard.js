import React, { useContext, useState } from "react";
import TopCards from "./graph/TopCards";
import Transactions from "./graph/Transactions";
import FinancialChart from "./graph/Financial";
import Navbar from "./Navbar";
import IncomeChart from "./graph/IncomeChart";
import IncomeList from "./graph/IncomeList";
import ExpenseList from "./graph/ExpenseList";
import ExpenseChart from "./graph/ExpenceChart";
import CalendarCard from "./graph/Calendar"; // <-- new import
import { ThemeContext } from "../ThemeContext/theme";
import logo from "../images/logo_white.png";
import { Menu, X } from "lucide-react";
import { endpoint } from "../utils/APIRoutes";
import toast from "react-hot-toast";
import { apiConnectorGet } from "../utils/APIConnector";
import { useQuery } from "react-query";

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        
        {/* Header */}
        <header className="bg-emerald-600 dark:bg-emerald-700 text-white text-2xl font-bold py-4 px-6 shadow-md tracking-wide flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Xpensify Logo"
              className="h-12 w-auto max-w-[200px] rounded-md shadow-md"
            />
            <span className="text-white text-2xl font-semibold tracking-tight">
              Xpensify Dashboard
            </span>
          </div>

          {/* Hamburger (mobile only) */}
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Layout */}
        <div className="flex flex-1">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex">
            <Navbar />
          </div>

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <div className="fixed z-50 lg:hidden bg-emerald-700 text-white w-64 h-full shadow-lg">
              <Navbar />
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto example h-screen text-gray-800 dark:text-gray-100">
            
            {/* TopCards + CalendarCard side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                <TopCards />
              </div>
              <CalendarCard />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Transactions />
              <FinancialChart />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExpenseChart />
              <ExpenseList />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <IncomeList />
              <IncomeChart />
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
