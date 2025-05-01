# test formatter 
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import yaml
import xml.etree.ElementTree as ET
import markdown
import json
from pydantic import BaseModel
from fastapi import FastAPI
from pydantic import BaseModel
import uuid
import random
from datetime import datetime
from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
import string, random, hashlib, pyotp, qrcode
import cloudinary
import cloudinary.uploader
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import string, random, hashlib, pyotp, qrcode
import cloudinary
import cloudinary.uploader
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from tkinter import Tk, filedialog
import jsbeautifier
from bs4 import BeautifulSoup
import black
import tinycss2
from py_mini_racer import py_mini_racer
import re
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def fix_newlines(input_str: str) -> str:
    return input_str.replace("\\n", "\n")



# Mood-to-personality mapping
MOOD_MAP = {
    "😊": {"range": (70, 100), "vibe": "cheerful", "color": "Sunbeam Yellow"},
    "😡": {"range": (40, 90), "vibe": "fierce", "color": "Crimson Red"},
    "😴": {"range": (1, 30), "vibe": "dreamy", "color": "Pillow Purple"},
    "🤓": {"range": (50, 80), "vibe": "brainy", "color": "Nerdy Blue"},
    "🥳": {"range": (80, 100), "vibe": "wild", "color": "Party Pink"},
    "😎": {"range": (60, 90), "vibe": "cool", "color": "Midnight Black"},
}

class MoodRequest(BaseModel):
    mood_emoji: str


# Load environment variables
load_dotenv()

# Cloudinary configuration
cloudinary.config(
    cloud_name="dtbqeatjn",
    api_key="842327917571689",
    api_secret="EwUB3969hII_xENpLuTBdeAx1WU"
)

# MongoDB configuration
mongo_client = MongoClient(os.getenv("MONGO_URI"))  # Store full URI in .env as MONGO_URI
db = mongo_client["database"]
collection = db["password"]


# List of common passwords
common_passwords = ['123456', 'password', 'qwerty', '111111', 'abc123']

# Utility functions
def calculate_entropy(password):
    pool_size = 0
    if any(c.islower() for c in password): pool_size += 26
    if any(c.isupper() for c in password): pool_size += 26
    if any(c.isdigit() for c in password): pool_size += 10
    if any(c in string.punctuation for c in password): pool_size += len(string.punctuation)
    return len(password) * (pool_size.bit_length())

def strength_label(entropy):
    if entropy < 40: return "Weak"
    elif entropy < 60: return "Medium"
    elif entropy < 80: return "Strong"
    else: return "Very Strong"

def is_common_password(password):
    return password.lower() in common_passwords

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_password(length, use_upper, use_lower, use_digits, use_symbols):
    characters = ''
    if use_lower: characters += string.ascii_lowercase
    if use_upper: characters += string.ascii_uppercase
    if use_digits: characters += string.digits
    if use_symbols: characters += string.punctuation
    if not characters: return None
    return ''.join(random.choice(characters) for _ in range(length))

def generate_2fa_qr(secret, username="user", issuer="HackathonApp"):
    uri = pyotp.totp.TOTP(secret).provisioning_uri(name=username, issuer_name=issuer)
    filename = "2fa_qr.png"
    qr = qrcode.make(uri)
    qr.save(filename)

    # Upload to Cloudinary
    result = cloudinary.uploader.upload(
        filename,
        folder="2fa_qrs"  # optional folder in Cloudinary
    )

    qr_url = result["secure_url"]
    return uri, qr_url

@app.get("/")
def home():
    return {"message": "🎉 FastAPI server is up and running!"}

@app.post("/generate-number/")
def generate_identity(data: MoodRequest):
    emoji = data.mood_emoji
    mood = MOOD_MAP.get(emoji, {"range": (0, 100), "vibe": "mystery", "color": "Void Grey"})

    number = random.randint(*mood["range"])
    unique_id = str(uuid.uuid4())
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lore = f"This ID was born at {now}, glowing with {mood['color']} energy. It channels a {mood['vibe']} spirit."

    return {
        "emoji": emoji,
        "uuid": unique_id,
        "number": number,
        "mood_color": mood["color"],
        "vibe": mood["vibe"],
        "lore": lore
    }

@app.post("/generate-2fa")
async def generate(
    length: int = Form(...),
    use_upper: bool = Form(...),
    use_lower: bool = Form(...),
    use_digits: bool = Form(...),
    use_symbols: bool = Form(...),
    enable_2fa: bool = Form(False)
):
    password = generate_password(length, use_upper, use_lower, use_digits, use_symbols)
    if not password:
        return JSONResponse(content={"error": "Character set cannot be empty!"}, status_code=400)

    entropy = calculate_entropy(password)
    strength = strength_label(entropy)
    common = is_common_password(password)
    hashed = hash_password(password)

    response = {
        "password": password,
        "entropy": entropy,
        "strength": strength,
        "is_common": common,
        "hash": hashed
    }

    # 2FA handling
    if enable_2fa:
        secret = pyotp.random_base32()
        uri, qr_url = generate_2fa_qr(secret)
        response.update({
            "2fa_secret": secret,
            "2fa_uri": uri,
            "qr_code_url": qr_url
        })

    # Save response in MongoDB
    result = collection.insert_one(response)
    response["_id"] = str(result.inserted_id)  # Convert ObjectId to string before returning
    return JSONResponse(content=response)

@app.post("/validate-json")
def validate_json(json_str: str = Form(...)):
    try:
        formatted = fix_newlines(json_str)
        json.loads(formatted)
        return {"valid": True}
    except json.JSONDecodeError as e:
        return {"valid": False, "error": str(e)}

@app.post("/validate-yaml")
def validate_yaml(yaml_str: str = Form(...)):
    try:
        formatted = fix_newlines(yaml_str)
        yaml.safe_load(formatted)
        return {"valid": True}
    except yaml.YAMLError as e:
        return {"valid": False, "error": str(e)}

@app.post("/validate-xml")
def validate_xml(xml_str: str = Form(...)):
    try:
        formatted = fix_newlines(xml_str)
        ET.fromstring(formatted)
        return {"valid": True}
    except ET.ParseError as e:
        return {"valid": False, "error": str(e)}

@app.post("/validate-markdown")
def validate_markdown(md_str: str = Form(...)):
    try:
        formatted = fix_newlines(md_str)
        html_output = markdown.markdown(formatted)

        # Check if meaningful tags exist in rendered HTML
        is_valid = (
            "<p>" in html_output or
            "<h" in html_output or
            "<ul>" in html_output or
            "<ol>" in html_output or
            "<strong>" in html_output or
            "<em>" in html_output
        )

        if not is_valid:
            return {"valid": False, "error": "Malformed Markdown or missing formatting."}

        return {"valid": True, "rendered_html": html_output}
    except Exception as e:
        return {"valid": False, "error": str(e)}


def beautify_html(html_code: str) -> str:
    soup = BeautifulSoup(html_code, "html.parser")
    return soup.prettify()

def validate_html(html_code: str) -> bool:
    try:
        BeautifulSoup(html_code, "html5lib")
        return True
    except Exception as e:
        print(f"HTML validation error: {e}")
        return False

import re

def fix_common_css_issues(css: str) -> str:
    # Normalize line breaks and strip leading/trailing spaces
    lines = css.splitlines()
    cleaned_lines = []

    for line in lines:
        original_line = line.strip()

        # Ignore empty lines
        if not original_line:
            cleaned_lines.append('')
            continue

        # Fix common spacing issues
        # e.g., "font - family" -> "font-family"
        line = re.sub(r'(\w)\s*-\s*(\w)', r'\1-\2', original_line)

        # Fix spacing around colon
        line = re.sub(r'\s*:\s*', ': ', line)

        # Fix spacing before semicolon
        line = re.sub(r'\s*;\s*', ';', line)

        # Ensure spacing between properties
        line = re.sub(r';(?!$)', '; ', line)

        # Fix unit spacing: 10 px -> 10px
        line = re.sub(r'(\d+)\s+(px|em|rem|%)', r'\1\2', line)

        # Normalize var() spacing: var (--x) => var(--x)
        line = re.sub(r'var\s*\(\s*--', 'var(--', line)
        line = re.sub(r'--\s*([a-zA-Z0-9-_]+)\s*\)', r'--\1)', line)

        cleaned_lines.append(line)

    return '\n'.join(cleaned_lines)

def beautify_js_css(code: str) -> str:
    # Pre-clean CSS/JS to fix malformed syntax
    cleaned_code = fix_common_css_issues(code)
    opts = jsbeautifier.default_options()
    opts.indent_size = 2
    return jsbeautifier.beautify(cleaned_code, opts)

def validate_css(css_code: str) -> bool:
    try:
        rules = tinycss2.parse_stylesheet(css_code, skip_whitespace=True)
        valid = all(rule.type in ['qualified-rule', 'at-rule'] for rule in rules)
        if not valid:
            print("❌ CSS syntax structure is invalid.")
        return valid
    except Exception as e:
        print(f"CSS validation error: {e}")
        return False


def validate_js(js_code: str) -> bool:
    try:
        ctx = py_mini_racer.MiniRacer()
        ctx.eval(f"(function(){{ {js_code} }})()")
        return True
    except py_mini_racer.JSEvalException as e:
        print(f"JavaScript syntax error:\n{e}")
        return False

def beautify_python(code: str) -> str:
    try:
        return black.format_str(code, mode=black.FileMode())
    except Exception as e:
        return f"Error formatting Python code: {e}"

def validate_python(code: str) -> bool:
    try:
        compile(code, "<string>", "exec")
        return True
    except SyntaxError as e:
        print(f"Python syntax error: {e}")
        return False

def beautify_and_validate_code(code: str, filetype: str) -> tuple[str, bool]:
    filetype = filetype.lower()
    if filetype.endswith((".html", ".htm")):
        return beautify_html(code), validate_html(code)
    elif filetype.endswith(".css"):
        return beautify_js_css(code), validate_css(code)
    elif filetype.endswith(".js"):
        return beautify_js_css(code), validate_js(code)
    elif filetype.endswith(".py"):
        return beautify_python(code), validate_python(code)
    else:
        raise ValueError("Unsupported file type.")




@app.post("/beautify-code/")
async def beautify_code(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        code = contents.decode("utf-8")
        beautified_code, is_valid = beautify_and_validate_code(code, file.filename)
        response = {
            "valid": is_valid,
            "message": "Code syntax looks good!" if is_valid else "Syntax issues found.",
            "beautified_code": beautified_code,
            "filename": file.filename,
            "beautified_filename": f"beautified_{file.filename}",
        }
        return JSONResponse(content=response)
    except Exception as e:
        return JSONResponse(
            content={"valid": False, "message": f"Error: {str(e)}"},
            status_code=500
        )
