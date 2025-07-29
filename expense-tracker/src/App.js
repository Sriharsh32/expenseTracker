import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ExpenseTracker from "./components/ExpenseTracker";
import ExpensesByCategory from "./components/ExpensesByCategory";
import MonthlyTrends from "./components/ MonthlyTrends";
import About from "./components/About";
export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">Expense Tracker</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="!nav-link" to="/category">Expenses by Category</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/trends">Monthly Trends</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ExpenseTracker />} />
        <Route path="/category" element={<ExpensesByCategory />} />
        <Route path="/trends" element={<MonthlyTrends />} />
         <Route path="/about" element={<About />} /> {/* ✅ Add this */}
      </Routes>

      <footer className="text-center py-3 mt-5 bg-light text-muted">
        © {new Date().getFullYear()}  All rights reserved by Sriharsh.
      </footer>
    </Router>
  );
}
