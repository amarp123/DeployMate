import React, { useState } from "react";
import { FaGithub, FaSpinner, FaRocket, FaCheckCircle } from "react-icons/fa";
import "./DeployPage.css";

export default function DeployPage() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);

  const handleDeploy = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("🚫 Please log in to deploy!");
    if (!file || !name) return alert("📝 Enter a project name and select a file!");

    setLoading(true);
    setDeployedUrl("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    // fake progress for fun
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) clearInterval(interval);
    }, 200);

    try {
      const res = await fetch("http://localhost:8000/deployments/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) setDeployedUrl(data.url);
      else if (data.message) alert(`❌ Oops! ${data.message}`);
      else alert("❌ Deployment failed: Unknown error");
    } catch (err) {
      console.error(err);
      alert("❌ Network/server error");
    }

    setLoading(false);
  };

  const fetchGithubRepos = async () => {
    if (!username) return alert("👀 Enter a GitHub username!");
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos`);
      const data = await res.json();
      setRepos(data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch GitHub repos");
    }
  };

  return (
    <div className="deploy-page">
      <header className="deploy-header">
        <h1> Welcome to DeployMate!</h1>
        <p>Launch projects, connect your GitHub, and watch your code come alive ✨</p>
      </header>

      <section className="deploy-section">
        {/* Deploy Project Card */}
        <div className="deploy-card interactive-card">
          <h2>Deploy Your Awesome Project</h2>
          <input
            type="text"
            placeholder="Give your project a fun name!"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button className="btn primary" onClick={handleDeploy}>
            {loading ? <FaSpinner className="spin" /> : <><FaRocket /> Deploy!</>}
          </button>
          {deployedUrl && (
            <div className="success">
              <FaCheckCircle /> Hooray! Your project is live:{" "}
              <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
                {deployedUrl}
              </a>
            </div>
          )}
        </div>

        {/* GitHub Connection Card */}
        <div className="github-card interactive-card">
          <h2>Connect to GitHub <FaGithub /></h2>
          <p>Fetch your repositories and manage them directly!</p>
          <input
            type="text"
            placeholder="Enter your GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn secondary" onClick={fetchGithubRepos}>
            Fetch Repos
          </button>
          <div className="repo-list">
            {repos.map((repo) => (
              <div key={repo.id} className="repo-card">
                <h3>{repo.name}</h3>
                <p>{repo.description || "No description provided 🤷‍♂️"}</p>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  View Repo
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
