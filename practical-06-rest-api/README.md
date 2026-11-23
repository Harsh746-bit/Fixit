# Practical 06: RESTful API for Managing Records in a Database

> **FixIt — Smart Campus Maintenance Management System**  
> RESTful API engineered for database persistence, complete CRUD operations, automated validation, Postman test suites, and live cloud deployment.

---

## 📌 Practical 06 Objectives & Syllabus Mapping

| Requirement | Implementation in FixIt |
| :--- | :--- |
| **Develop a RESTful API** | Express.js REST application with semantic HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`). |
| **Database Connection & CRUD** | MongoDB / Mongoose schema (`records` collection) with Create, Read, Update, Delete, and query filtering. |
| **Input Validation & Error Handling** | Express middleware and Mongoose schema constraints for email regex, 10-digit Indian phone regex, and enums. |
| **Postman Verification** | Comprehensive Postman Collection v2.1 with dynamic variables and automated test assertions (`pm.test`). |
| **Web Hosting Deployment** | Deployed on Render / Railway / Vercel with public URL verification via Postman. |

---

## 🏛️ Architecture & Folder Structure

```text
practical-06-rest-api/
│
├── config/
│   └── db.js                        # Database connection & fallback adapter
├── models/
│   └── Record.js                    # Database Schema & Model for maintenance records
├── controllers/
│   └── recordController.js          # CRUD controller handlers
├── routes/
│   └── recordRoutes.js              # RESTful API route definitions
├── middleware/
│   └── validateRecord.js            # Input validation & schema validation middleware
├── FixIt-Practical-06.postman_collection.json # Complete Postman Collection v2.1
├── test-endpoints.js                # Automated test runner verifying all 11 endpoints
├── seed.js                          # Standalone script to populate sample campus records
├── server.js                        # Express server entry point (Port 5001)
├── render.yaml                      # Render Blueprint deployment config
├── Procfile                         # Heroku/Railway process file
├── vercel.json                      # Vercel serverless deployment config
├── package.json                     # Node dependencies & test scripts
├── .env.example                     # Environment template
└── README.md                        # Practical 06 documentation
```

---

## 🗄️ Database Record Schema

| Field | Type | Required | Constraints / Validation |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto | MongoDB unique primary key |
| `ticketId` | String | Auto | e.g. `REC-1001`, `REC-1002` |
| `title` | String | Yes | Minimum 3 characters, trimmed |
| `category` | String | Yes | `Electrical`, `Plumbing`, `HVAC`, `Furniture`, `Internet`, `Civil`, `General` |
| `location` | String | Yes | Specific campus building & room (e.g., `Block A - Room 204`) |
| `priority` | String | No | `Low`, `Medium`, `High`, `Critical` (Default: `Medium`) |
| `status` | String | No | `Pending`, `In Progress`, `Resolved` (Default: `Pending`) |
| `description` | String | Yes | Detailed description of the maintenance issue |
| `reporterName`| String | Yes | Full name of faculty/student |
| `reporterEmail`| String | Yes | Standard Email format (`^[^\s@]+@[^\s@]+\.[^\s@]+$`) |
| `reporterPhone`| String | No | 10-digit Indian Mobile (`^[6-9]\d{9}$`) |
| `estimatedCost`| Number | No | Non-negative repair cost in INR |
| `createdAt` | Date | Auto | ISO Timestamp |
| `updatedAt` | Date | Auto | ISO Timestamp |

---

## 🚀 Local Quickstart Instructions

### 1. Install Dependencies
```bash
cd practical-06-rest-api
npm install
```

### 2. Configure Environment Variables
Copy the template `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` contents:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/fixit_records_db
NODE_ENV=development
```
*(Note: If a local MongoDB daemon is not running, the application automatically engages a resilient in-memory storage adapter, enabling immediate execution and zero-configuration testing!)*

### 3. Run the Automated Endpoint Verification Test
```bash
npm run test:endpoints
```
Output:
```text
  ✅ [PASS] GET / (Server Health & API Metadata)
  ✅ [PASS] GET /api/records (Read All Records)
  ✅ [PASS] GET /api/records?category=Electrical (Filtered Query)
  ✅ [PASS] POST /api/records (Create New Record)
  ✅ [PASS] POST /api/records [Validation Failure -> 400 Bad Request]
  ✅ [PASS] GET /api/records/:id (Read Single Record by ID)
  ✅ [PASS] PUT /api/records/:id (Full Record Update)
  ✅ [PASS] PATCH /api/records/:id (Partial Status Transition)
  ✅ [PASS] GET /api/records/stats/summary (Aggregate Metrics)
  ✅ [PASS] DELETE /api/records/:id (Delete Record from Database)
  ✅ [PASS] GET /api/records/:id [Post-Delete Check -> 404 Not Found]

Verification Summary: Passed: 11 | Failed: 0
Status: 🎉 ALL PRACTICAL 06 ENDPOINTS VERIFIED!
```

### 4. Start the Express API Server
```bash
npm start
# or for live auto-reload during development:
npm run dev
```
The server will be live at: **`http://localhost:5001`**.

---

## 🌐 Free Cloud Database & Hosting Deployment Guide

### Step 1: Create a Free MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a **Free Shared Cluster (M0)**.
3. Under **Security ➔ Database Access**, create a user (e.g., `fixit_admin` with a password).
4. Under **Security ➔ Network Access**, click **Add IP Address** ➔ Choose **Allow Access from Anywhere (`0.0.0.0/0`)** so your cloud hosting platform can connect.
5. In your cluster dashboard, click **Connect** ➔ **Drivers (Node.js)** ➔ Copy the connection string:
   ```text
   mongodb+srv://fixit_admin:<password>@cluster0.abcde.mongodb.net/fixit_records_db?retryWrites=true&w=majority
   ```

### Step 2: Deploy to Render.com (Free Web Service)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New ➔ Web Service**.
3. Connect your GitHub repository.
4. Set the configuration:
   - **Root Directory:** `practical-06-rest-api`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `<Your MongoDB Atlas Connection String>`
6. Click **Deploy Web Service**.
7. Once deployed, Render will provide a public URL:
   `https://fixit-practical-06-api.onrender.com`

---

## 📮 Postman Verification Guide

### 1. Import Postman Collection
1. Launch **Postman**.
2. Click the **Import** button in the top left corner.
3. Select the file:
   [`FixIt-Practical-06.postman_collection.json`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-06-rest-api/FixIt-Practical-06.postman_collection.json)
4. The collection **"FixIt - Practical 06 RESTful API"** will appear in your left sidebar with 11 pre-built requests.

### 2. Verify Local API
By default, the collection variable `baseUrl` is set to `http://localhost:5001`.
- Click on the collection name ➔ Click **Run Collection**.
- Click **Run FixIt - Practical 06**.
- All tests will execute sequentially and display **100% Passed**.

### 3. Verify Deployed Public URL
- In Postman, click on the **FixIt - Practical 06** collection.
- Navigate to the **Variables** tab.
- Change the `baseUrl` value from `http://localhost:5001` to your public URL (e.g. `https://fixit-practical-06-api.onrender.com`).
- Click **Save**, then re-run the collection to verify the cloud deployment!

---

## 📡 API Reference & cURL Samples

### 1. Health Check & API Directory
* **Method:** `GET /`
* **Response (200 OK):**
```json
{
  "project": "FixIt — Smart Campus Maintenance Management System",
  "practical": "Practical 06 — RESTful API for Managing Records in a Database",
  "database": {
    "isConnected": true,
    "provider": "MongoDB",
    "timestamp": "2026-11-22T06:25:37.128Z"
  },
  "endpoints": { ... }
}
```

### 2. Read All Records
* **Method:** `GET /api/records`
* **Query Parameters (Optional):**
  - `category=Electrical`
  - `status=Pending`
  - `priority=High`
  - `search=projector`
* **cURL:**
```bash
curl -X GET "http://localhost:5001/api/records?category=Electrical"
```

### 3. Create a New Record
* **Method:** `POST /api/records`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "title": "Smart Projector HDMI Cable Short Circuit",
  "category": "Electrical",
  "location": "Seminar Hall B - Podium",
  "priority": "High",
  "status": "Pending",
  "description": "HDMI cable has physical tear and sparks occasionally when connected.",
  "reporterName": "Dr. Ananya Roy",
  "reporterEmail": "ananya.roy@campus.edu",
  "reporterPhone": "9876543210",
  "estimatedCost": 950
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Record 'REC-1005' successfully created in database.",
  "data": {
    "_id": "673f4b1234567890abcdef01",
    "ticketId": "REC-1005",
    "title": "Smart Projector HDMI Cable Short Circuit",
    "category": "Electrical",
    "location": "Seminar Hall B - Podium",
    "priority": "High",
    "status": "Pending",
    "estimatedCost": 950,
    "createdAt": "2026-11-22T06:25:37.174Z"
  }
}
```

### 4. Read Single Record by ID
* **Method:** `GET /api/records/:id`
* **cURL:**
```bash
curl -X GET "http://localhost:5001/api/records/673f4b1234567890abcdef01"
```

### 5. Full Update (PUT)
* **Method:** `PUT /api/records/:id`
* **Request Body:** Full updated record object
* **Response (200 OK):** Updated record with `updatedAt` refreshed.

### 6. Partial Status Update (PATCH)
* **Method:** `PATCH /api/records/:id`
* **Request Body:**
```json
{
  "status": "Resolved"
}
```

### 7. Delete Record
* **Method:** `DELETE /api/records/:id`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Record 'REC-1005' successfully removed from database.",
  "deletedData": { ... }
}
```

### 8. Dynamic Aggregate Statistics
* **Method:** `GET /api/records/stats/summary`
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "pending": 2,
    "inProgress": 1,
    "resolved": 2,
    "totalEstimatedCost": 3750,
    "categoryBreakdown": {
      "Electrical": 2,
      "Plumbing": 1,
      "Internet": 1,
      "Furniture": 1
    }
  }
}
```
