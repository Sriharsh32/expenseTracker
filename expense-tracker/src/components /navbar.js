import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 10, background: "#f0f0f0" }}>
      <Link to="/" style={{ marginRight: 10 }}>Home</Link>
      <Link to="/budget" style={{ marginRight: 10 }}>Budget</Link>
      <Link to="/reports">Reports</Link>
    </nav>
  );
}
