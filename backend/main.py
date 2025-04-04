from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
from utils import process_file
from database import init_db, add_file_record

app = FastAPI(title="Offline AI Backend")

# Initialize the database (create tables if needed)
init_db()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    saved_files = []
    for file in files:
        # Generate output filename (convert original extension to .png)
        output_path = UPLOAD_DIR / f"{Path(file.filename).stem}.png"
        try:
            process_file(file, output_path, target_size=1024)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing file {file.filename}: {str(e)}")

        # Save file record in database (if using SQLite)
        relative_path = output_path.name  # Just the filename
        record_id = add_file_record(file.filename, relative_path)
        saved_files.append({"id": record_id, "original": file.filename, "path": relative_path})

    return JSONResponse(content={"files": saved_files})
