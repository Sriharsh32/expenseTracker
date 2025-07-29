import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ExpenseTracker.css"; // External styles for modern look

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
    <div className="app-background">
      <div className="container p-4 bg-white rounded shadow-lg mt-5">
        <h2 className="text-center fw-bold mb-4 gradient-text">💸 Expense Tracker</h2>

        <div className="row g-3 mb-3">
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>

          <div className="col-md-2">
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
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Custom Category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </div>
          )}

          <div className="col-md-4 d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button className="btn btn-dark fw-bold" onClick={addOrUpdateExpense}>
              {editingIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-between mb-3 gap-3">
          <input
            type="text"
            className="form-control flex-grow-1"
            placeholder="Search by category or note"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: "250px" }}
          />
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: "200px" }}
            placeholder="Set Monthly Budget"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
            min="0"
          />
        </div>

        <div className="bg-light p-3 rounded shadow-sm mb-3">
          <h5 className="mb-0">
            Total: <span className="fw-bold">₹{total.toFixed(2)}</span> | This Month:{" "}
            <span className="fw-bold">₹{spentThisMonth.toFixed(2)}</span>{" "}
            {monthlyBudget && (
              <>
                | Budget: <span className="fw-bold">₹{monthlyBudget}</span>{" "}
                <span
                  className={
                    spentThisMonth > monthlyBudget ? "text-danger" : "text-success"
                  }
                >
                  ({spentThisMonth > monthlyBudget ? "Exceeded" : "Within Limit"})
                </span>
              </>
            )}
          </h5>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover rounded shadow-sm bg-white">
            <thead className="table-dark text-white">
              <tr>
                <th>Date</th>
                <th>Amount (₹)</th>
                <th>Category</th>
                <th>Note</th>
                <th style={{ minWidth: "130px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No expenses to show.
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
