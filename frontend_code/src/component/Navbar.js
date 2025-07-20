import React, { useContext } from "react";
import {
  FaTachometerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../ThemeContext/theme";
import User from "../images/User.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r h-full border-gray-200 dark:border-gray-800 p-2 pt-5 flex flex-col justify-between  text-gray-800 dark:text-gray-100">
      <div>
        <div className="flex flex-col items-center mb-5">
          <img
            src={User}
            alt="Avatar"
            className="w-20 h-20 rounded-full shadow-md"
          />
          <h2 className="mt-4 font-semibold text-lg">User</h2>
        </div>

        <nav className="space-y-4">
          <button
            className={`flex items-center gap-3 font-semibold px-4 py-3 rounded-md w-full transition
              ${
                isActive("/home")
                  ? "text-white bg-emerald-600 hover:bg-emerald-700"
                  : "hover:bg-emerald-100 dark:hover:bg-emerald-800"
              }`}
            onClick={() => navigate("/home")}
          >
            <FaTachometerAlt size={20} />
            Dashboard
          </button>

          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md w-full transition
              ${
                isActive("/income")
                  ? "text-white bg-emerald-600 hover:bg-emerald-700"
                  : "hover:bg-emerald-100 dark:hover:bg-emerald-800"
              }`}
            onClick={() => navigate("/income")}
          >
            <FaMoneyBillWave size={20} />
            Income
          </button>

          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md w-full transition
              ${
                isActive("/expense")
                  ? "text-white bg-emerald-600 hover:bg-emerald-700"
                  : "hover:bg-emerald-100 dark:hover:bg-emerald-800"
              }`}
            onClick={() => navigate("/expense")}
          >
            <FaCreditCard size={20} />
            Expense
          </button>

 <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md w-full transition
              ${
                isActive("/budget")
                  ? "text-white bg-emerald-600 hover:bg-emerald-700"
                  : "hover:bg-emerald-100 dark:hover:bg-emerald-800"
              }`}
            onClick={() => navigate("/budget")}
          >
            <FaCreditCard size={20} />
            Budget
          </button>
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-md w-full hover:bg-emerald-100 dark:hover:bg-emerald-800 transition"
            onClick={() => navigate("/")}
          >
            <FaSignOutAlt size={20} />
            Logout
          </button>

          {/* Toggle Theme Button */}
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-md w-full hover:bg-emerald-100 dark:hover:bg-emerald-800 transition"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
