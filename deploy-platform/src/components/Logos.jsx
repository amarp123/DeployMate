import React from "react";
import "./Logos.css";

export default function Logos() {
  const logos = [
    "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/4/4f/Cib-github.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/96/Sass_Logo_Color.svg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
  ];

  return (
    <section className="logos">
      <h2 className="logos-title">Trusted by teams all over the world</h2>
      <div className="logos-grid">
        {logos.map((src, index) => (
          <img key={index} src={src} alt="Company Logo" className="logo-img" />
        ))}
      </div>
    </section>
  );
}
