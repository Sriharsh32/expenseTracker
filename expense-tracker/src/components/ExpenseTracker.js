import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ExpenseTracker.css";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [note, setNote] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(localStorage.getItem("budget") || "");

  const defaultCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Utilities",
    "Health",
    "Education",
    "Others",
  ];

  const showToast = (msg, type = "info") => {
    if (type === "error") toast.error(msg);
    else if (type === "success") toast.success(msg);
    else toast.info(msg);
  };

  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) setExpenses(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("budget", monthlyBudget);
  }, [monthlyBudget]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const spentThisMonth = expenses
    .filter((e) => e.date.slice(0, 7) === currentMonth)
    .reduce((sum, e) => sum + e.amount, 0);

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

    const newSpent = spentThisMonth + amt;
    const budgetLimit = parseFloat(monthlyBudget);
    if (budgetLimit && newSpent > budgetLimit) {
      showToast("Monthly budget exceeded!", "error");
      return;
    }

    const expenseObj = {
      date: new Date().toISOString().split("T")[0],
      amount: amt,
      category: finalCategory,
      note: note.trim(),
    };

    if (editingIndex !== null) {
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

  const editExpense = (index) => {
    const e = expenses[index];
    setAmount(e.amount);
    setCategory(defaultCategories.includes(e.category) ? e.category : "__custom__");
    setCustomCategory(defaultCategories.includes(e.category) ? "" : e.category);
    setNote(e.note);
    setEditingIndex(index);
  };

  const deleteExpense = (index) => {
    const updated = expenses.filter((_, i) => i !== index);
    setExpenses(updated);
    showToast("Expense deleted", "success");
  };

  const filteredExpenses = expenses.filter(
    (e) =>
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.note.toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="app-background py-4 px-2 px-md-5">
      <div className="container bg-white rounded-4 shadow p-4">
        <h2 className="text-center fw-bold mb-4 gradient-text">💸 Expense Tracker</h2>

        <div className="row gy-3 mb-3 align-items-end">
          <div className="col-md-2">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {defaultCategories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom__">Custom</option>
            </select>
          </div>

          {category === "__custom__" && (
            <div className="col-md-3">
              <label className="form-label">Custom Category</label>
              <input
                type="text"
                className="form-control"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </div>
          )}

          <div className="col-md-4">
            <label className="form-label">Note</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Optional note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button className="btn btn-primary fw-bold" onClick={addOrUpdateExpense}>
                {editingIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by category or note"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <input
              type="number"
              className="form-control"
              placeholder="Set Monthly Budget"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              min="0"
            />
          </div>
        </div>

        <div className="alert alert-light border rounded mb-4">
          <strong>Total:</strong> ₹{total.toFixed(2)} | <strong>This Month:</strong> ₹
          {spentThisMonth.toFixed(2)}{" "}
          {monthlyBudget && (
            <>
              | <strong>Budget:</strong> ₹{monthlyBudget}{" "}
              <span
                className={`fw-bold ${
                  spentThisMonth > monthlyBudget ? "text-danger" : "text-success"
                }`}
              >
                ({spentThisMonth > monthlyBudget ? "Exceeded" : "Within Limit"})
              </span>
            </>
          )}
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Amount (₹)</th>
                <th>Category</th>
                <th>Note</th>
                <th style={{ minWidth: "140px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((e, i) => (
                  <tr key={i}>
                    <td>{e.date}</td>
                    <td>{e.amount.toFixed(2)}</td>
                    <td>{e.category}</td>
                    <td>{e.note}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editExpense(i)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteExpense(i)}
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
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
}

export default ExpenseTracker;
