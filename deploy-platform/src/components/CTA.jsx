import React from "react";
import "./CTA.css";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";

export default function CTA() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/deploy");
  };

  return (
    <section className="cta-container">
      {/* Left Side CTA */}
      <div className="cta-left">
        <h2>🚀 Ready to launch your next big idea?</h2>
        <p>
          Join thousands of developers using <strong>DeployMate</strong> to build
          and scale apps faster than ever.
        </p>
        <div className="btn-container">
          <button className="btn primary" onClick={handleClick}>
            Start Free Today
          </button>
        </div>
      </div>

      {/* Right Side Profile Card */}
      <div className="cta-right">
        <div className="profile-card">
          <p className="built-by">✨ Built by</p>
          <img
            src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&q=80&w=200&h=200&fit=crop&auto=format"
            alt="Amar Pujari"
            className="profile-img"
          />
          <h3 className="name gradient-text">Amar Pujari</h3>
          <p className="role">Passionate Website Developer · UI/UX Designer</p>
          <p className="connect">Let’s Connect 🤝</p>
          <div className="social-links">
            <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://github.com/your-username" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a href="https://leetcode.com/your-username" target="_blank" rel="noreferrer">
              <FaCode />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
