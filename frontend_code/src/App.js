import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './authentication/Login';
import Register from './authentication/Registration';
import Dashboard from './component/Dashboard';
import Income from './component/pages/Income/Income';
import ExpensePage from './component/pages/Expenses/Expense';
import { ThemeProvider } from './ThemeContext/theme';
import DailyBudget from './component/pages/DailyBudget/Daily';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<ExpensePage />} />
          <Route path="/budget" element={<DailyBudget />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
