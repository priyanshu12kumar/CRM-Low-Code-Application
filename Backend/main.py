import json
import sqlite3
from typing import Any, Dict, List

from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

DB_NAME = "forms.db"


# -------------------------
# DB INIT
# -------------------------
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS forms(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        form_name TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS fields(
        id TEXT PRIMARY KEY,
        form_id INTEGER,
        input_type TEXT,
        label TEXT,
        is_mandatory INTEGER,
        comment TEXT,
        extra_json TEXT,
        FOREIGN KEY(form_id) REFERENCES forms(id)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS options(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field_id TEXT,
        value TEXT,
        meta_json TEXT,
        FOREIGN KEY(field_id) REFERENCES fields(id)
    )
    """)

    conn.commit()
    conn.close()


init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class JsonDataType(BaseModel):
    formDetails: Dict[str, Any]
    formData: List[Dict[str, Any]]



@app.post("/save-form")
def save_form(data: JsonDataType):
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()

    # Insert form
    form_name = data.formDetails["FormName"]

    cur.execute("INSERT INTO forms(form_name) VALUES(?)", (form_name,))
    form_id = cur.lastrowid

    for field in data.formData:
        comp = field["InputComponent"]

        # store unknown fields as JSON
        extra_json = json.dumps(comp)

        cur.execute("""
        INSERT INTO fields(id, form_id, input_type, label, is_mandatory, comment, extra_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            comp["id"],
            form_id,
            comp["type"],
            comp["label"],
            int(comp.get("isMandatory", False)),
            comp.get("comment", ""),
            extra_json
        ))

        # Save options if exist
        if "options" in comp:
            for opt in comp["options"]:
                cur.execute(
                    "INSERT INTO options(field_id, value, meta_json) VALUES (?, ?, ?)",
                    (comp["id"], opt, "{}")
                )

        if "radioOptionList" in comp:
            for opt in comp["radioOptionList"]:
                cur.execute(
                    "INSERT INTO options(field_id, value, meta_json) VALUES (?, ?, ?)",
                    (comp["id"], opt["label"], json.dumps(opt))
                )

    conn.commit()
    conn.close()

    return {"status": "saved", "form_id": form_id}
