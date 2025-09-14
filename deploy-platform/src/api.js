const API_URL = "http://127.0.0.1:8000"; // FastAPI backend

// REGISTER
export async function registerUser(username, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Registration failed: ${msg}`);
  }
  return res.json();
}

// LOGIN
export const loginUser = async (email, password) => {
  const response = await fetch("http://127.0.0.1:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }), // ✅ matches backend schema
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.access_token); // ✅ save token for later
  return data;
};

