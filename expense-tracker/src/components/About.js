// src/components/About.js
import React from "react";

export default function About() {
  return (
        <div className="container mt-5">
            <h2>About This App</h2>
            <p>
                This is a simple React expense tracker app designed to help users manage their personal finances effectively.
                It allows you to track your expenses, set budget limits, and visualize your spending habits through interactive charts.
            </p>

            <div className="row my-4">
                <div className="col-md-6">
                    <img src="https://www.venturasecurities.com/wp-content/uploads/2024/08/What-is-the-total-expense-ratio-in-a-mutual-fund.png " alt="Expense Chart" className="img-fluid rounded shadow" />
                </div>
               
            </div>

            <h4>Key Features</h4>
            <ul>
                <li>Track daily, weekly, and monthly expenses</li>
                <li>Set and monitor budget limits</li>
                <li>Visualize spending with pie and bar charts</li>
                <li>Responsive and user-friendly interface</li>
            </ul>

            <h4>Technologies Used</h4>
            <ul>
                <li>React for building the user interface</li>
                <li>Chart.js for rendering dynamic charts</li>
                <li>Bootstrap for responsive design</li>
                <li>LocalStorage for data persistence</li>
            </ul>

            <h4>Future Improvements</h4>
            <ul>
                <li>Authentication and user accounts</li>
                <li>Cloud-based data storage</li>
                <li>Recurring expense tracking</li>
                <li>Dark mode support</li>
            </ul>

            <p>
                This project is open-source and continuously evolving. Contributions and feedback are welcome!
            </p>
        </div>
    );
}
