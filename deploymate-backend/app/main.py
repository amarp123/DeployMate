from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app import models, database
from app.routes import auth
from app.routes import deployments  # new deployment router

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="DeployMate Backend")

# ✅ CORS middleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(deployments.router, prefix="/deployments", tags=["Deployments"])

# Serve static files
app.mount("/sites", StaticFiles(directory="deployed_sites"), name="sites")

@app.get("/")
def home():
    return {"message": "🚀 DeployMate Backend is running!"}
