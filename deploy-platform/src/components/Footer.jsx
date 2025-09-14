import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">🚀 DeployMate</div>
        <ul className="footer-links">
          <li><a href="#">Docs</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Community</a></li>
          <li><a href="#">Support</a></li>
        </ul>
        <p className="footer-copy">
          © {new Date().getFullYear()} DeployMate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
