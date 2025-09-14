from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app import models, database, oauth2
import os, shutil, zipfile

router = APIRouter()
UPLOAD_DIR = "deployed_sites"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def deploy_project(
    name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    # Create user folder if it doesn't exist
    user_folder = os.path.join(UPLOAD_DIR, str(current_user.id))
    os.makedirs(user_folder, exist_ok=True)
    file_path = os.path.join(user_folder, file.filename)

    # Save uploaded zip file
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Extract zip to project folder and flatten
    extract_path = os.path.join(user_folder, name)
    os.makedirs(extract_path, exist_ok=True)

    try:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            for member in zip_ref.namelist():
                # Skip directories and hidden files
                if member.endswith("/") or member.startswith("__"):
                    continue
                filename = os.path.basename(member)
                if not filename:
                    continue
                source = zip_ref.open(member)
                target_path = os.path.join(extract_path, filename)
                with open(target_path, "wb") as target:
                    shutil.copyfileobj(source, target)
    except zipfile.BadZipFile:
        return {"message": "❌ Deployment failed: Invalid zip file"}

    # Save deployment in database
    deployment = models.Deployment(
        name=name,
        owner_id=current_user.id,
        folder_path=extract_path
    )
    db.add(deployment)
    db.commit()
    db.refresh(deployment)

    # Return full live URL
    return {
        "message": "✅ Deployment successful!",
        "url": f"http://localhost:8000/sites/{current_user.id}/{name}/index.html"
    }
