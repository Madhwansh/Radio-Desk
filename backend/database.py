import sqlite3
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent / "files.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS file_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_filename TEXT,
            relative_path TEXT,
            upload_time TEXT
        )
    """)
    conn.commit()
    conn.close()

def add_file_record(original_filename, relative_path):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    upload_time = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO file_records (original_filename, relative_path, upload_time)
        VALUES (?, ?, ?)
    """, (original_filename, relative_path, upload_time))
    conn.commit()
    record_id = cursor.lastrowid
    conn.close()
    return record_id
