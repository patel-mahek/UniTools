#  UniTools

**UniTools** is a unified platform offering a suite of essential online tools for developers, students, and professionals. From code formatting to QR generation, UniTools consolidates multiple productivity utilities into one seamless interface.

▶️ **[Watch Demo](https://youtu.be/2dj5alDL5NQ)**
---

##  Features

- ** Text Formatter**
  - Format and validate JSON, YAML, XML, and Markdown.

- ** Random Generator**
  - Generate random numbers, strings, IDs with custom options.

- ** Code Formatter**
  - Beautify and validate HTML, CSS, JavaScript, and Python code.

- ** CSV & Excel Utilities**
  - Convert CSV ↔ JSON ↔ Excel, with live preview and editing.

- ** Password Generator**
  - Create secure passwords with strength and entropy check.

- ** QR Code Generator**
  - Generate custom QR codes for URLs, contact info, and text.

###  Premium Tools
- ** SQL Formatter**
- ** Cron Builder**
- ** Token Generator (JWT/API keys)**

---

##  Tech Stack

| Layer        | Technology        |
|--------------|------------------|
| Frontend     | [Next.js](https://nextjs.org)          |
| Backend      | [FastAPI](https://fastapi.tiangolo.com) |
| Database     | [MongoDB](https://www.mongodb.com)      |
| Media Storage| [Cloudinary](https://cloudinary.com)    |

---
## 🛠️ Local Development

To run the UniTools platform locally, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/unitools.git
cd unitools
```
### 2. Start the Frontend (Next.js)
```bash
cd app  # navigate to the frontend folder
npm install
npm run dev
```
By default, the frontend will be available at: http://localhost:3000
### 3. Start the Backend API (FastAPI)
Open a new terminal window:
```bash
cd api  # Navigate to the backend folder
pip install -r requirements.txt
uvicorn app:app --reload
```
```bash
By default, the backednAPi will run at: http://localhost:8000
Mkae sure you add the .env file credentials
```
---
Made with 💻 by the UniTools Team
