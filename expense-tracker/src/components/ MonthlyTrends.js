// src/components/MonthlyTrends.js
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MonthlyTrends() {
  const [monthlyTotals, setMonthlyTotals] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
    const byMonth = stored.reduce((acc, exp) => {
      const month = exp.date.slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {});
    setMonthlyTotals(byMonth);
  }, []);

  const sortedMonths = Object.keys(monthlyTotals).sort();
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
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Monthly Expense Trends</h2>
      {sortedMonths.length === 0 ? (
        <p className="text-muted text-center">No data to show chart.</p>
      ) : (
        <Bar data={barData} options={barOptions} />
      )}
    </div>
  );
}
