// src/components/ExpensesByCategory.js
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesByCategory() {
  const [categoryTotals, setCategoryTotals] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
    const totals = stored.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    setCategoryTotals(totals);
  }, []);

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#4dc9f6", "#f67019", "#f53794", "#537bc4", "#acc236",
          "#166a8f", "#00a950", "#58595b", "#8549ba",
        ],
      },
    ],
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Expenses by Category</h2>
      {Object.keys(categoryTotals).length === 0 ? (
        <p className="text-muted text-center">No data to show chart.</p>
      ) : (
        <Pie data={pieData} />
      )}
    </div>
  );
}
