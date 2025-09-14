import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left"> DeployMate</div>
        <ul className="navbar-links">
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div className="navbar-right">
  <Link to="/signin" className="btn nav-btn1">
    Log in
  </Link>
  <Link to="/signup" className="btn nav-btn">
    Sign up
  </Link>
</div>

      </div>
    </nav>
  );
}
