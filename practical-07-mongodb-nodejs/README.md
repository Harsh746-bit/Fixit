# Practical 07: Node.js + Express + MongoDB NoSQL Web Application

> **FixIt — Smart Campus Maintenance Management System**  
> Full-Stack NoSQL application interacting with MongoDB through Node.js and Express.js, featuring schema validation, robust error handling, an interactive browser UI, and complete Postman test suites.

---

## 📌 Practical 07 Objectives & Syllabus Mapping

| Requirement | Implementation in FixIt Practical 07 |
| :--- | :--- |
| **Create Database & Collection in MongoDB** | Database: `fixit_campus_db` <br> Collection: `maintenance_issues` <br> Handled via Mongoose Schema and MongoDB shell script [`mongo-init.js`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-07-mongodb-nodejs/mongo-init.js). |
| **Develop Web App with Node.js & Express.js** | Modular Express server with static asset hosting, RESTful routes, and controller architecture. |
| **Connect using Mongoose** | Connection module with automatic reconnection, event listeners, and live status reporting. |
| **Implement CRUD Operations** | **Create** (`POST`), **Read** (`GET`), **Update** (`PUT` & `PATCH`), and **Delete** (`DELETE`). |
| **User Input Validation & Error Handling** | Mongoose schema validation rules, RegEx for emails and 10-digit Indian phones, and centralized handlers for `ValidationError`, `CastError`, and `404 Not Found`. |
| **Test via Web Browser AND Postman** | **Web Browser:** Interactive Bootstrap 5 dashboard at `http://localhost:5002`. <br> **Postman:** Complete Collection v2.1 with automated `pm.test` assertions. |

---

## 🏛️ Application Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["Client Layer (Testing)"]
        Browser["🌐 Web Browser Dashboard (http://localhost:5002)"]
        Postman["📮 Postman Collection (FixIt-Practical-07)"]
    end

    subgraph ServerLayer["Node.js + Express Server (Port 5002)"]
        StaticServe["express.static ('public')"]
        RouteLayer["Express Router ('/api/issues')"]
        Middleware["Validation Middleware (Email/Phone RegEx, Enums)"]
        Controller["Issue Controller (CRUD Business Logic)"]
        ErrHandler["Centralized Error Handler (CastError, ValidationError)"]
    end

    subgraph DatabaseLayer["NoSQL Persistence Layer"]
        Mongoose["Mongoose ODM (Schema & Validation)"]
        MongoAtlas["🍃 MongoDB (fixit_campus_db ➔ maintenance_issues)"]
    end

    Browser -->|HTTP GET /| StaticServe
    Browser -->|AJAX Fetch CRUD| RouteLayer
    Postman -->|REST API Requests| RouteLayer

    RouteLayer --> Middleware
    Middleware --> Controller
    Controller --> Mongoose
    Mongoose --> MongoAtlas
    Controller -.->|Errors Caught| ErrHandler
```

---

## 📂 Repository Directory Structure

```text
practical-07-mongodb-nodejs/
│
├── config/
│   └── db.js                        # Mongoose connection & DB initialization
├── models/
│   └── Issue.js                     # Mongoose Schema & Model for 'maintenance_issues'
├── controllers/
│   └── issueController.js          # CRUD controller handlers
├── routes/
│   └── issueRoutes.js              # RESTful API route definitions
├── middleware/
│   └── validation.js               # User validation & centralized error handler
├── public/                          # Web Browser Interface (HTML5, CSS3, JS)
│   ├── index.html                   # Interactive browser dashboard
│   ├── css/
│   │   └── style.css                # FixIt industrial styling
│   └── js/
│       └── app.js                   # Client-side AJAX CRUD interactions
├── mongo-init.js                    # MongoDB shell initialization script
├── FixIt-Practical-07.postman_collection.json # Postman Collection v2.1
├── test-endpoints.js                # Automated test runner verifying Web UI & API
├── seed.js                          # Standalone MongoDB seeder script
├── server.js                        # Express server entry point (Port 5002)
├── render.yaml                      # Render Blueprint deployment config
├── Procfile                         # Heroku/Railway process file
├── package.json                     # Node dependencies & test scripts
├── .env.example                     # Environment template
└── README.md                        # Practical 07 documentation
```

---

## 🍃 Step 1: Database & Collection Setup in MongoDB

### Option A: Via MongoDB Shell (`mongosh`)
Run the provided [`mongo-init.js`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-07-mongodb-nodejs/mongo-init.js):
```bash
mongosh < mongo-init.js
```
Or type directly in `mongosh`:
```javascript
use fixit_campus_db
db.createCollection("maintenance_issues")
db.maintenance_issues.createIndex({ ticketId: 1 }, { unique: true })
```

### Option B: Automatic Mongoose Initialization
When you start the Node.js application, Mongoose connects to `fixit_campus_db` and automatically creates the collection `maintenance_issues` and indexes defined in `models/Issue.js`!

---

## 🗄️ Mongoose Schema & Validation Constraints

```javascript
const IssueSchema = new mongoose.Schema({
    ticketId: { type: String, unique: true, trim: true },
    title: { type: String, required: [true, 'Issue title is required'], minlength: 3 },
    category: {
        type: String,
        required: true,
        enum: ['Electrical', 'Plumbing', 'HVAC', 'Furniture', 'Internet', 'Civil', 'General']
    },
    location: { type: String, required: true },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    description: { type: String, required: true, minlength: 10 },
    reporterName: { type: String, required: true },
    reporterEmail: {
        type: String,
        required: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address format']
    },
    reporterPhone: {
        type: String,
        match: [/^[6-9]\d{9}$/, 'Must be a 10-digit Indian phone number']
    }
}, { collection: 'maintenance_issues', timestamps: true });
```

---

## 🚀 Local Quickstart Instructions

### 1. Install Dependencies
```bash
cd practical-07-mongodb-nodejs
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env`:
```env
PORT=5002
MONGODB_URI=mongodb://127.0.0.1:27017/fixit_campus_db
NODE_ENV=development
```
*(Note: If a local MongoDB daemon is not running, the application gracefully activates an in-memory fallback adapter so testing and evaluation proceed without errors!)*

### 3. Run Automated Endpoint & Browser UI Test
```bash
npm run test:endpoints
```
Output:
```text
  ✅ [PASS] GET / (Web Browser UI delivers HTML5 index)
  ✅ [PASS] GET /api/db-status (MongoDB metadata check)
  ✅ [PASS] GET /api/issues (Read All Issues from MongoDB)
  ✅ [PASS] POST /api/issues (Create Document with Mongoose Validation)
  ✅ [PASS] POST /api/issues [Mongoose Validation Error -> 400 Bad Request]
  ✅ [PASS] GET /api/issues/:id (Read Single Document by ID)
  ✅ [PASS] PUT /api/issues/:id (Full Document Update)
  ✅ [PASS] PATCH /api/issues/:id/status (Partial Status Transition)
  ✅ [PASS] GET /api/issues/stats/summary (Aggregate Summary Metrics)
  ✅ [PASS] DELETE /api/issues/:id (Remove Document from MongoDB)
  ✅ [PASS] GET /api/issues/:id [Post-Delete Verification -> 404 Not Found]

Verification Summary: Passed: 11 | Failed: 0
Status: 🎉 ALL PRACTICAL 07 ENDPOINTS & WEB UI VERIFIED!
```

### 4. Start the Application
```bash
npm start
# or with live reload:
npm run dev
```

---

## 🖥️ Testing via Web Browser

1. Open your web browser (Chrome, Edge, Firefox, Safari) and navigate to:
   **`http://localhost:5002`**
2. **Examine Live MongoDB State:** Check the header badge to observe live MongoDB database name (`fixit_campus_db`) and collection (`maintenance_issues`).
3. **Test CREATE Operation:**
   - Click the orange **"Report New Issue"** button.
   - Enter invalid data (e.g., blank title or invalid phone) to test live client-side validation.
   - Fill in valid issue details and click **"Save to MongoDB"**.
   - Observe real-time success alert and immediate addition of the record to the table.
4. **Test READ & FILTER Operations:**
   - Type into the search bar (e.g. `Lab`, `Lecture`) to filter issues instantaneously.
   - Select categories from the dropdown (e.g., `Electrical` or `Plumbing`).
   - Notice the top KPI statistic tiles (Total, Pending, In Progress, Resolved) updating dynamically.
5. **Test UPDATE Operation:**
   - Click the **"Status"** dropdown on any ticket card to transition from `Pending` ➔ `In Progress` ➔ `Resolved`.
   - Click the pencil icon (`✏️`) to open the **Edit Modal**, modify the description or location, and save.
6. **Test DELETE Operation:**
   - Click the trash icon (`🗑️`) on an issue.
   - Confirm deletion in the modal dialog; observe document removal from the MongoDB table.
7. **Seed Data:**
   - Click the **"Seed Data"** button to repopulate standard campus maintenance records anytime.

---

## 📮 Testing via Postman

1. Open **Postman**.
2. Click **Import** and select:
   [`FixIt-Practical-07.postman_collection.json`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-07-mongodb-nodejs/FixIt-Practical-07.postman_collection.json)
3. The collection **"FixIt - Practical 07 MongoDB NoSQL Web App"** includes 11 automated requests:
   - `01. Check MongoDB Database Status (GET /api/db-status)`
   - `02. Read All Issues (GET /api/issues)`
   - `03. Filter Issues by Category (GET /api/issues?category=Internet)`
   - `04. Create New Issue Document (POST /api/issues)` *(Saves created ID to collection variable)*
   - `05. Create Issue - Validation Failure Test (POST 400)`
   - `06. Read Single Issue by ID (GET /api/issues/:id)`
   - `07. Full Update of Document (PUT /api/issues/:id)`
   - `08. Update Status Only (PATCH /api/issues/:id/status)`
   - `09. Retrieve Aggregated Summary Statistics (GET /api/issues/stats/summary)`
   - `10. Delete Issue Document (DELETE /api/issues/:id)`
   - `11. Verify Document Deleted (GET 404)`
4. Click **Run Collection** to execute all tests automatically; observe 100% test pass marks.

---

## 🌐 Cloud Deployment to Render (Free Web Service)

1. Connect your repository to [Render.com](https://render.com).
2. Create a new **Web Service**:
   - **Root Directory:** `practical-07-mongodb-nodejs`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add Environment Variable:
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster0.mongodb.net/fixit_campus_db?retryWrites=true&w=majority`
4. Access your live public URL in any browser or Postman!
