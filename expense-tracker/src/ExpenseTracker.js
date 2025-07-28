import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

function Toast({ message, type = "success", onClose }) {
  const bgClass = type === "success" ? "bg-success" : "bg-danger";

  return (
    <div
      className={`toast show position-fixed bottom-0 end-0 m-3 text-white ${bgClass}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ minWidth: "250px", zIndex: 1050 }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          aria-label="Close"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });

  const presetCategories = [
    "Food",
    "Transport",
    "Utilities",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Rent",
    "Education",
    "Other",
  ];
const [monthlyBudget, setMonthlyBudget] = useState(0);



  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) setExpenses(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
// Load budget from localStorage
useEffect(() => {
  const savedBudget = localStorage.getItem("monthlyBudget");
  if (savedBudget) setMonthlyBudget(savedBudget);
}, []);

useEffect(() => {
  localStorage.setItem("monthlyBudget", monthlyBudget);
}, [monthlyBudget]);
useEffect(() => {
  const savedBudget = parseFloat(localStorage.getItem("budget") || "0");
  setMonthlyBudget(savedBudget);
}, []);


  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

const addOrUpdateExpense = () => {
  let finalCategory = category;


  if (category === "__custom__") {
    if (!customCategory.trim()) {
      showToast("Please enter a valid custom category.", "error");
      return;
    }
    finalCategory = customCategory.trim();
  }

  const amt = parseFloat(amount);
  if (!amt || amt <= 0) {
    showToast("Please enter a valid amount greater than 0.", "error");
    return;
  }
  if (!finalCategory) {
    showToast("Please select or enter a category.", "error");
    return;
  }

  // Calculate current month's total
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyTotal = expenses.reduce((total, exp) => {
    const month = exp.date.slice(0, 7); // YYYY-MM
    return month === currentMonth ? total + exp.amount : total;
  }, 0);

  // Check if new amount would exceed budget
  const isEditing = editingIndex !== null;
  const previousAmount = isEditing ? expenses[editingIndex].amount : 0;
  const newTotal = monthlyTotal - previousAmount + amt;

  if (newTotal > monthlyBudget) {
    showToast("Cannot add expense. Monthly budget exceeded.", "error");
    return;
  }

  const expenseObj = {
    date: new Date().toISOString().split("T")[0],
    amount: amt,
    category: finalCategory,
    note: note.trim(),
  };

  if (isEditing) {
    const updated = [...expenses];
    updated[editingIndex] = expenseObj;
    setExpenses(updated);
    setEditingIndex(null);
    showToast("Expense updated", "success");
  } else {
    setExpenses([...expenses, expenseObj]);
    showToast("Expense added", "success");
  }

  setAmount("");
  setCategory("");
  setCustomCategory("");
  setNote("");
};



  const deleteExpense = (index) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const updated = expenses.filter((_, i) => i !== index);
      setExpenses(updated);
      showToast("Expense deleted", "success");
    }
  };

  const editExpense = (index) => {
    const exp = expenses[index];
    setAmount(exp.amount);
    if (presetCategories.includes(exp.category)) {
      setCategory(exp.category);
      setCustomCategory("");
    } else {
      setCategory("__custom__");
      setCustomCategory(exp.category);
    }
    setNote(exp.note);
    setEditingIndex(index);
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (startDate && exp.date < startDate) return false;
    if (endDate && exp.date > endDate) return false;
    return true;
  });

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = filteredExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  // Monthly totals for Bar chart
  const getMonthKey = (dateStr) => dateStr.slice(0, 7); // YYYY-MM
  const monthlyTotals = filteredExpenses.reduce((acc, exp) => {
    const month = getMonthKey(exp.date);
    acc[month] = (acc[month] || 0) + exp.amount;
    return acc;
  }, {});
const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
const spentThisMonth = monthlyTotals[currentMonth] || 0;
  const sortedMonths = Object.keys(monthlyTotals).sort();
  

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#4dc9f6",
          "#f67019",
          "#f53794",
          "#537bc4",
          "#acc236",
          "#166a8f",
          "#00a950",
          "#58595b",
          "#8549ba",
        ],
      },
    ],
  };

  const barData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Monthly Expenses (₹)",
        data: sortedMonths.map((m) => monthlyTotals[m]),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container my-5" style={{ maxWidth: "900px" }}>
      <h1 className="text-center text-primary mb-4">💸 Expense Tracker</h1>
      {/* Monthly Budget Input and Progress */}
<div className="mb-4 d-flex align-items-center justify-content-center gap-3">
  <label htmlFor="budgetInput" className="fw-semibold mb-0">
    Monthly Budget (₹):
  </label>
 <input
  type="textbox"
  id="budgetInput"
  className="form-control"
  style={{ maxWidth: 150 }}
  placeholder="Set your budget"
  value={monthlyBudget}
  onChange={(e) => {
    const value = parseFloat(e.target.value || "0");
    setMonthlyBudget(value);
    localStorage.setItem("budget", value);
  }}
  min="0"
/>

</div>

{monthlyBudget && (
  <div className="mb-4" style={{ maxWidth: 400, margin: "auto" }}>
    <div className="d-flex justify-content-between mb-1">
      <span>Spent this month: ₹{spentThisMonth.toFixed(2)}</span>
      <span>Budget: ₹{parseFloat(monthlyBudget).toFixed(2)}</span>
    </div>
    <div className="progress" style={{ height: "20px" }}>
      <div
        className={`progress-bar ${
          spentThisMonth > monthlyBudget ? "bg-danger" : "bg-success"
        }`}
        role="progressbar"
        style={{
          width: `${Math.min((spentThisMonth / monthlyBudget) * 100, 100)}%`,
        }}
        aria-valuenow={spentThisMonth}
        aria-valuemin={0}
        aria-valuemax={monthlyBudget}
      />
    </div>
    {spentThisMonth > monthlyBudget && (
      <small className="text-danger fw-semibold">
        You have exceeded your monthly budget!
      </small>
    )}
  </div>
)}

      {/* Input Form */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="textbox"
            className="form-control"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => {
              const val = e.target.value;
              setCategory(val);
              if (val !== "__custom__") setCustomCategory("");
            }}
          >
            <option value="">Select Category</option>
            {presetCategories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__custom__">Other (Custom)</option>
          </select>
        </div>
        {category === "__custom__" && (
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          </div>
        )}
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-primary" onClick={addOrUpdateExpense}>
            {editingIndex !== null ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Expense Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Amount (₹)</th>
              <th>Category</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No expenses found.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp, idx) => (
                <tr key={idx}>
                  <td>{exp.date}</td>
                  <td>₹{exp.amount.toFixed(2)}</td>
                  <td>{exp.category}</td>
                  <td>{exp.note}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => editExpense(idx)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteExpense(idx)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h4 className="text-end text-success mt-4">
        Total: ₹{total.toFixed(2)}
      </h4>

      {/* Expenses by Category Pie Chart */}
      <div className="mt-5">
        <h3 className="mb-3 text-center">Expenses by Category</h3>
        {Object.keys(categoryTotals).length === 0 ? (
          <p className="text-center text-muted">No data to show chart.</p>
        ) : (
          <Pie data={pieData} />
        )}
      </div>

      {/* Monthly Expense Trends Bar Chart */}
      <div className="mt-5">
        <h3 className="mb-3 text-center">Monthly Expense Trends</h3>
        {sortedMonths.length === 0 ? (
          <p className="text-center text-muted">No data to show chart.</p>
        ) : (
          <Bar data={barData} options={barOptions} />
        )}
      </div>

      {/* Toast */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </div>
  );
}
