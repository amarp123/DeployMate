# 🚀 DeployMate – One-Click Website Deployment Platform

DeployMate is a **static website hosting platform** that allows users to easily upload their website as a `.zip` file and instantly get a **live URL**.  
It provides a **secure authentication system**, integrates with a **PostgreSQL backend**, and offers a **ReactJS frontend** for smooth interaction.  

---

## ✨ Features

- 🔐 **User Authentication**
  - Register with username, email, and password
  - Secure password hashing using `bcrypt`
  - JWT-based authentication for session handling

- 📂 **One-Click Deployment**
  - Upload website as a `.zip` file
  - Automatic extraction of files (HTML, CSS, JS)
  - Instant live static website hosting

- ⚡ **Frontend Integration**
  - ReactJS-based UI
  - React Router for navigation
  - Axios for backend communication

- 🛡 **Security**
  - Passwords stored securely using hashing
  - Tokens prevent unauthorized access to protected routes

---

## 🛠 Tech Stack

### Backend
- **FastAPI** → RESTful API framework  
- **PostgreSQL** → Relational database  
- **SQLAlchemy ORM** → Database communication  
- **Uvicorn** → ASGI server for running FastAPI  
- **JWT (python-jose)** → Token-based authentication  
- **passlib[bcrypt]** → Password hashing  
- **pydantic** → Data validation  
- **python-dotenv** → Secure environment variable management  
- **psycopg2-binary** → PostgreSQL driver  

### Frontend
- **ReactJS** → User interface  
- **React Router** → Page navigation  
- **Axios** → API requests  

---

## 📂 Project Structure

DeployMate/
│── backend/ # FastAPI backend
│ ├── main.py # Entry point
│ ├── models.py # Database models
│ ├── routes/ # API endpoints
│ ├── auth.py # JWT authentication
│ ├── utils.py # Helper functions
│ └── uploads/ # Extracted website files
│
│── frontend/ # ReactJS frontend
│ ├── src/
│ │ ├── App.js
│ │ ├── components/
│ │ ├── pages/
│ │ └── services/
│ └── public/
│
│── .env # Environment variables
│── requirements.txt # Backend dependencies
│── package.json # Frontend dependencies
│── README.md # Documentation




---

## 🔄 Workflow

1. **User Registration**
   - User submits username, email, password  
   - Password is **hashed** and stored in **PostgreSQL**  

2. **Login**
   - User enters email & password  
   - Backend verifies and returns **JWT token**  

3. **Authentication**
   - Protected routes require token → validated by backend  
   - Token contains user identity  

4. **Website Deployment**
   - User uploads a `.zip` file  
   - Backend extracts files and serves them as a **live website**  

---

## 🔑 Authentication Workflow

- **Password Hashing:** Using `bcrypt` before storing in DB  
- **JWT Tokens:** Created with **HS256 algorithm** for authentication  
- **Local Storage:** Tokens stored in frontend for session handling  

---

## 📦 Installation & Setup

### Backend
```bash
# Clone repository
git clone https://github.com/amarp123/DeployMate.git
cd DeployMate/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload

###frontend
cd ../deploy-platform

# Install dependencies
npm install

# Start React server
npm start
