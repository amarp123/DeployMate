import React from "react";
import "./Features.css";
import feature1 from "../assets/undraw_cloud-hosting_tfeh.svg";
import feature2 from "../assets/undraw_cloud-docs_6cpw.svg";
import feature3 from "../assets/undraw_security_0ubl.svg";

export default function Features() {
  return (
    <section className="features">
      <h1 className="features-title">Why DeployMate?</h1>
      <p className="features-subtitle">
        The modern way to deploy your apps — simple, powerful, and built for scale.
      </p>

      <div className="features-container">
        <div className="feature-card">
          <div className="feature-bg-shape"></div>
          <img src={feature1} alt="Instant Deployments" />
          <h2>⚡ Instant Deployments</h2>
          <p>
            Push your code and see it live in seconds. No servers, no configs, just pure speed.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-bg-shape"></div>
          <img src={feature2} alt="Global Scaling" />
          <h2>🌍 Global Scaling</h2>
          <p>
            From one user to millions — DeployMate ensures your app is fast everywhere with global edge servers.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-bg-shape"></div>
          <img src={feature3} alt="Security" />
          <h2>🔒 Security First</h2>
          <p>
            HTTPS, DDoS protection, and rock-solid uptime — we handle the heavy lifting while you focus on building.
          </p>
        </div>
      </div>
    </section>
  );
}
