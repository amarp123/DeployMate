import React, { useState } from "react";
import "./Hero.css";
import heroIllustration from "../assets/undraw_web-developer_ggt0.svg";
import { useNavigate } from "react-router-dom";

function DeploymentModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deployedUrl, setDeployedUrl] = useState("");

  const handleDeploy = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("❌ You must be logged in to deploy!");
    if (!file || !name) return alert("Enter project name and select a file!");

    setLoading(true);
    setDeployedUrl("");
    setProgress(0);

    // Fake progress animation
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return p;
        }
        return p + 10;
      });
    }, 400);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    try {
      const res = await fetch("http://localhost:8000/deployments/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setDeployedUrl(data.url);
        setProgress(100);
      } else if (data.message) {
        alert(`❌ Deployment failed: ${data.message}`);
      } else {
        alert("❌ Deployment failed: Unknown error");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Deployment failed: Network or server error");
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal interactive">
        <h2>🚀 Deploy Your Project</h2>

        <input
          type="text"
          placeholder="Project Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        {loading ? (
          <div className="deploy-status">
            <p>⏳ Deploying... please wait</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        ) : (
          <>
            <button className="btn primary" onClick={handleDeploy}>
              Deploy
            </button>
            <button className="btn secondary" onClick={onClose}>
              Close
            </button>
          </>
        )}

        {deployedUrl && (
          <div className="deployment-result">
            <p className="success">✅ Deployment Successful!</p>
            <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
              {deployedUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <h1>
            Launch Faster, <span>Scale Smarter</span> 
          </h1>
          <p>
            DeployMate empowers developers to take ideas from code to live in seconds. 
            Build, deploy, and scale your projects effortlessly while impressing your users.
          </p>
          <div className="hero-buttons">
            <button
              className="btn primary"
              onClick={() => navigate("/deploy")}
            >
              Deploy Here
            </button>
            <button
              className="btn secondary"
              onClick={() => alert("Docs page coming soon!")}
            >
              Explore Docs
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroIllustration} alt="DeployMate Illustration" />
        </div>
      </div>

      {showModal && <DeploymentModal onClose={() => setShowModal(false)} />}
    </section>
  );
}
