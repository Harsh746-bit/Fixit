# FixIt — Smart Campus Maintenance Management System

> A complete, production-quality, academic web application engineered to satisfy **all Web Technology Practicals** as one continuously evolving real-world university facilities platform.

[![Live Deployment](https://img.shields.io/badge/Render-Live%20Demo-brightgreen?style=for-the-badge&logo=render)](https://fixit-sp6y.onrender.com/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Harsh746-bit/Fixit)

- 🌐 **Live Deployed Application (Render):** [https://fixit-sp6y.onrender.com/](https://fixit-sp6y.onrender.com/)
- 📡 **Live Public REST API Endpoint:** [https://fixit-sp6y.onrender.com/api/issues](https://fixit-sp6y.onrender.com/api/issues)
- 🛡️ **Role-Based Access Control (RBAC):** [https://fixit-sp6y.onrender.com/api/auth/roles](https://fixit-sp6y.onrender.com/api/auth/roles)

---

## 🏛️ Project Overview

**FixIt** is a campus facilities reporting and tracking platform designed for university students, faculty, and administrative staff. When problems arise on campus—such as electrical outages, water leaks, Wi-Fi connectivity dips, damaged classroom furniture, or lab equipment malfunctions—users can submit structured tickets, track real-time dispatch progress, and verify resolution.

Instead of five disconnected assignments, **FixIt** is built as a single unified product with a cohesive **University Facilities & Industrial Editorial** design system (Charcoal `#202522`, Warm White `#F7F5EF`, and Safety Orange `#E8752A`), evolving through five core technology milestones:

```text
PRACTICAL 01: HTML5 + CSS3 + Bootstrap 5 (Static Facilities Portal)
     │
     ▼
PRACTICAL 02: Vanilla JavaScript + Arrays + JSON Serialization + Validation + DOM Engine
     │
     ▼
PRACTICAL 03: ReactJS + Modular Components + State Hooks + Client Validation
     │
     ▼
PRACTICAL 04: Native Node.js Server (Pure 'http', 'fs', 'url', 'path' without Express)
     │
     ▼
PRACTICAL 05: Express.js REST API (MVC Architecture, Custom Middleware, Route Params)
     │
     ▼
PRACTICAL 06: Database RESTful API (CRUD, Cloud Hosting Deployment & Postman Automated Tests)
     │
     ▼
PRACTICAL 07: MongoDB NoSQL Web Application (Mongoose, Schema Validation, Web Browser & Postman)
     │
     ▼
FINAL FULL-STACK: React Frontend + Bootstrap 5 + Express REST API + Node.js + JSON Persistence
```

---

## 📋 Practical Demonstration Mapping

| Practical | Technology | Key Demonstrated Features | Folder Path |
| :--- | :--- | :--- | :--- |
| **Practical 01** | HTML5, CSS3, Bootstrap 5 | Semantic HTML5, Bootstrap 5 Grid, Navbar, Cards, Forms, Modal preview, Badges, SLA tables, Responsive layout (375px to 1440px). | [`practical-01-html-css-bootstrap/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-01-html-css-bootstrap) |
| **Practical 02** | Vanilla JavaScript | In-memory `Array`, `JSON.stringify()`, `JSON.parse()`, RegEx validation (email & 10-digit Indian phone), DOM manipulation, dynamic searching, multi-criteria filtering, live stats, delete modal, interactive JSON inspector. | [`practical-02-javascript/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-02-javascript) |
| **Practical 03** | ReactJS (Vite) | Functional components, `useState`, Props drilling, Controlled form inputs, real-time client validation, conditional rendering, dynamic card grid, statistics computation. | [`practical-03-react/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-03-react) |
| **Practical 04** | Node.js (Native) | Native `http.createServer()`, request stream parsing (`req.on('data')`), URL query handling (`url.parse`), JSON headers, status codes (`200`, `201`, `400`, `404`, `405`), async `fs.readFile` & `fs.writeFile`. | [`practical-04-node/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-04-node) |
| **Practical 05** | ExpressJS | Express app, modular `express.Router()`, custom validation middleware, `express.json()`, controller functions, route parameters (`:id`), status codes, centralized error handler. | [`practical-05-express/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-05-express) |
| **Practical 06** | RESTful API & Database | Database-backed RESTful API, full CRUD (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), validation, Render cloud deployment, Postman collection & automated assertions. | [`practical-06-rest-api/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-06-rest-api) |
| **Practical 07** | Node.js + Express + MongoDB | MongoDB NoSQL database (`fixit_campus_db`), collection (`maintenance_issues`), Mongoose ODM, CRUD operations, input validation, interactive Web Browser dashboard & Postman tests. | [`practical-07-mongodb-nodejs/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-07-mongodb-nodejs) |
| **Final App** | Full-Stack Integrated + RBAC | React + Bootstrap frontend connected via `/api` to Express backend with Role-Based Access Control (Student, Staff, Admin). Deployed live on Render. | [🚀 Live App](https://fixit-sp6y.onrender.com/) · [`final-app/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/final-app) |

---

## 📂 Repository Directory Structure

```text
FixIt/
│
├── practical-01-html-css-bootstrap/
│   ├── index.html                     # Semantic HTML5 & Bootstrap 5 layout
│   └── style.css                      # Industrial editorial styling & custom variables
│
├── practical-02-javascript/
│   ├── index.html                     # Interactive DOM container & JSON Inspector
│   ├── style.css                      # Validation & badge styles
│   └── script.js                      # Array, JSON.stringify/parse, validation, filters
│
├── practical-03-react/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Top bar with practical banner
│   │   │   ├── Hero.jsx               # Hero headline & workflow visual
│   │   │   ├── CategorySection.jsx    # 6-category responsive grid
│   │   │   ├── CategoryCard.jsx       # Reusable card component
│   │   │   ├── HowItWorks.jsx         # 3-step lifecycle card section
│   │   │   ├── ReportForm.jsx         # Controlled form with client-side validation
│   │   │   ├── IssueDashboard.jsx     # Master container for search, filter & cards
│   │   │   ├── FilterBar.jsx          # Search box & category/status/priority filters
│   │   │   ├── IssueCard.jsx          # Single ticket card with status dropdown
│   │   │   ├── DeleteModal.jsx        # Confirmation modal dialog
│   │   │   ├── Statistics.jsx         # Dynamic counters (Total, Pending, etc.)
│   │   │   └── Footer.jsx             # Facilities footer
│   │   ├── data/
│   │   │   └── sampleIssues.js        # Initial 6 realistic campus issues
│   │   ├── App.jsx                    # Root state & event handlers
│   │   ├── main.jsx                   # React 18 DOM mount point
│   │   └── index.css                  # Custom styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── practical-04-node/
│   ├── data/
│   │   └── issues.json                # JSON data store
│   ├── server.js                      # Native Node HTTP server (http, fs, url, path)
│   └── package.json
│
├── practical-05-express/
│   ├── data/
│   │   └── issues.json                # JSON data store
│   ├── middleware/
│   │   └── validation.js              # Express validation middleware
│   ├── controllers/
│   │   └── issueController.js         # Business logic & file CRUD
│   ├── routes/
│   │   └── issueRoutes.js             # REST API endpoint definitions
│   ├── server.js                      # Express application server
│   └── package.json
│
├── practical-06-rest-api/
│   ├── config/db.js                   # Mongoose / Database connection & fallback
│   ├── models/Record.js               # Database schema & model
│   ├── controllers/recordController.js # RESTful CRUD handlers & statistics
│   ├── routes/recordRoutes.js         # API routes (GET, POST, PUT, PATCH, DELETE)
│   ├── middleware/validateRecord.js   # Input validation middleware
│   ├── FixIt-Practical-06.postman_collection.json # Postman suite with automated assertions
│   ├── test-endpoints.js              # Automated test runner (11/11 tests pass)
│   ├── render.yaml                    # Cloud hosting deployment config
│   ├── server.js                      # Express server (Port 5001)
│   └── package.json
│
├── practical-07-mongodb-nodejs/
│   ├── config/db.js                   # MongoDB connection & health check
│   ├── models/Issue.js                # Mongoose schema for 'maintenance_issues'
│   ├── controllers/issueController.js # MongoDB CRUD operations
│   ├── routes/issueRoutes.js          # REST routes & status transitions
│   ├── middleware/validation.js       # Input validation & error handler
│   ├── public/                        # Web Browser Dashboard (HTML5, CSS3, JS)
│   │   ├── index.html                 # Interactive browser UI
│   │   ├── css/style.css              # Industrial theme
│   │   └── js/app.js                  # AJAX CRUD operations
│   ├── mongo-init.js                  # MongoDB shell DB & collection setup
│   ├── FixIt-Practical-07.postman_collection.json # Postman collection v2.1
│   ├── test-endpoints.js              # Automated browser & API test runner
│   ├── render.yaml                    # Cloud hosting deployment config
│   ├── server.js                      # Express server (Port 5002)
│   └── package.json
│
├── final-app/
│   ├── backend/                       # Express + Node.js REST API Server
│   │   ├── data/issues.json
│   │   ├── middleware/validation.js
│   │   ├── controllers/issueController.js
│   │   ├── routes/issueRoutes.js
│   │   ├── server.js
│   │   └── package.json
│   │
│   ├── frontend/                      # React + Bootstrap 5 Full-Stack UI
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   │   └── api.js             # fetch() REST API client
│   │   │   ├── App.jsx
│   │   │   ├── main.jsx
│   │   │   └── index.css
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   └── package.json
│
└── README.md                          # Comprehensive documentation & viva manual
```

---

## 🎨 Visual Identity & Design Guidelines

The interface follows a **Modern University Facilities + Industrial Editorial** aesthetic:

* **Deep Charcoal (`#202522`)**: Authoritative base for headers, cards, and text hierarchy.
* **Warm Off-White (`#F7F5EF`)**: Neutral, non-fatiguing backdrop representing campus architecture.
* **Safety Orange (`#E8752A`)**: High-visibility accent for primary actions, dispatch badges, and status cues.
* **Dark Orange (`#C95D1F`)**: Hover states and micro-interactions.
* **Slate (`#5E6663`)**: Body copy, secondary metadata, and borders.
* **Status Accents**:
  * Pending: Amber (`#D99A2B`)
  * In Progress: Safety Orange (`#E8752A`)
  * Resolved: Deep Forest Green (`#3F7D58`)
  * Critical Priority: Crimson Red (`#B94A48`)

---

## 🚀 Running Each Practical Individually

### Practical 01 — HTML5, CSS3 & Bootstrap 5
Open `practical-01-html-css-bootstrap/index.html` directly in any web browser (or use Live Server / VS Code preview).

---

### Practical 02 — Vanilla JavaScript & JSON
Open `practical-02-javascript/index.html` directly in any web browser.
* Try submitting a ticket with invalid inputs to inspect real-time validation.
* Use the search bar or filter dropdowns to verify DOM querying.
* Check the **JSON Inspector** at the bottom of the page to observe `JSON.stringify()` and `JSON.parse()`.

---

### Practical 03 — ReactJS (Vite)
Navigate to the directory and launch the development server:
```bash
cd practical-03-react
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

### Practical 04 — Native Node.js Server
Navigate to the directory and run the pure Node server:
```bash
cd practical-04-node
node server.js
```
The native server listens at `http://localhost:4000`:
* Test in browser / curl: `http://localhost:4000/api/issues`
* Test statistics: `http://localhost:4000/api/statistics`

---

### Practical 05 — Express.js REST API
Navigate to the directory and run the Express API:
```bash
cd practical-05-express
npm install
npm start
```
The Express server listens at `http://localhost:5000`:
* Root Documentation: `http://localhost:5000/`
* Issues Endpoint: `http://localhost:5000/api/issues`
* Statistics Endpoint: `http://localhost:5000/api/statistics`

---

### Final Full-Stack Application (React + Express)
To run the complete integrated full-stack platform:

**1. Start Backend (Terminal 1):**
```bash
cd final-app/backend
npm install
npm start
```
*(Runs at `http://localhost:5000`)*

**2. Start Frontend (Terminal 2):**
```bash
cd final-app/frontend
npm install
npm run dev
```
*(Runs at `http://localhost:3000`)*

---

## 📡 REST API Documentation (ExpressJS)

All API routes are prefixed with `/api`.

### 1. Get All Issues
* **URL:** `GET /api/issues`
* **Query Parameters (Optional):**
  * `search`: Filter by keyword across ID, location, description, or reporter name.
  * `category`: `Electrical` | `Plumbing` | `Internet` | `Furniture` | `Cleaning` | `Equipment`
  * `status`: `Pending` | `In Progress` | `Resolved`
  * `priority`: `Low` | `Medium` | `High` | `Critical`
* **Response (200 OK):**
```json
{
  "success": true,
  "total": 6,
  "count": 6,
  "data": [
    {
      "id": "FIX-1001",
      "name": "Rahul Sharma",
      "email": "rahul.sharma@campus.edu",
      "category": "Electrical",
      "location": "Block A - Room 204",
      "priority": "High",
      "description": "Ceiling fan is making loud grinding noise and not rotating at full speed during lectures.",
      "status": "Pending",
      "date": "2026-09-28",
      "contact": "9876543210"
    }
  ]
}
```

### 2. Get Issue By ID
* **URL:** `GET /api/issues/:id`
* **Response (200 OK):**
```json
{
  "success": true,
  "data": { "id": "FIX-1001", "location": "Block A - Room 204", "status": "Pending", ... }
}
```
* **Error (404 Not Found):**
```json
{ "success": false, "message": "Ticket with ID 'FIX-9999' not found." }
```

### 3. Create New Issue
* **URL:** `POST /api/issues`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@campus.edu",
  "category": "Electrical",
  "priority": "High",
  "location": "Block A - Room 204",
  "description": "Ceiling fan is making loud grinding noise and not rotating at full speed during lectures.",
  "contact": "9876543210"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Issue reported successfully.",
  "referenceId": "FIX-1007",
  "data": { ... }
}
```

### 4. Update Status
* **URL:** `PATCH /api/issues/:id/status`
* **Request Body:**
```json
{
  "status": "In Progress"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket 'FIX-1001' status updated to 'In Progress'.",
  "data": { ... }
}
```

### 5. Delete Issue
* **URL:** `DELETE /api/issues/:id`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket 'FIX-1001' deleted successfully."
}
```

### 6. Get Dynamic Statistics
* **URL:** `GET /api/statistics`
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 6,
    "pending": 1,
    "inProgress": 2,
    "resolved": 3
  }
}
```

---

## 🎓 Viva & Faculty Evaluation Guide

### Practical 01 (HTML, CSS, Bootstrap)
* **What to demonstrate:** Show semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`). Explain Bootstrap 5 grid breakpoint mechanics (`col-12 col-md-6 col-lg-4`) and responsive collapse behavior at 375px mobile viewport.
* **Code location:** [`practical-01-html-css-bootstrap/index.html`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-01-html-css-bootstrap/index.html) and [`style.css`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-01-html-css-bootstrap/style.css).

### Practical 02 (Vanilla JavaScript)
* **What to demonstrate:** 
  1. Trigger form validation with blank / invalid inputs.
  2. Show `JSON.stringify(issues)` and `JSON.parse(jsonData)` updating live inside the **JSON Inspector** section.
  3. Filter cards by priority ("Critical") and search for "Block A".
  4. Change status using the dropdown; verify live counter pill updates.
  5. Delete a ticket via the confirmation modal.
* **Code location:** [`practical-02-javascript/script.js`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-02-javascript/script.js).

### Practical 03 (ReactJS)
* **What to demonstrate:** Explain how state flows from `App.jsx` down to `ReportForm.jsx`, `IssueDashboard.jsx`, and `Statistics.jsx` via Props. Show controlled inputs with `useState` and live RegEx errors rendered conditionally before state update.
* **Code location:** [`practical-03-react/src/App.jsx`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-03-react/src/App.jsx) and [`ReportForm.jsx`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-03-react/src/components/ReportForm.jsx).

### Practical 04 (Native Node.js)
* **What to demonstrate:** Open [`practical-04-node/server.js`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-04-node/server.js). Explain how incoming request streams are buffered using `req.on('data')` and parsed in `req.on('end')` without Express. Show file persistence with `fs.readFile` and `fs.writeFile`.

### Practical 05 (Express.js)
* **What to demonstrate:** Explain middleware chaining: `Request` ➔ `validateIssueCreation` middleware ➔ `issueController.createIssue` ➔ `issues.json` ➔ `201 JSON Response`. Show route parameter handling with `req.params.id`.
* **Code location:** [`practical-05-express/middleware/validation.js`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-05-express/middleware/validation.js) and [`issueController.js`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-05-express/controllers/issueController.js).

### Practical 06 (Database RESTful API & Cloud Deployment)
* **What to demonstrate:**
  1. Show full CRUD operations on database records: `GET /api/records`, `POST /api/records`, `PUT /api/records/:id`, `PATCH /api/records/:id`, `DELETE /api/records/:id`.
  2. Run `npm run test:endpoints` to show 11/11 automated tests passing.
  3. Import [`FixIt-Practical-06.postman_collection.json`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-06-rest-api/FixIt-Practical-06.postman_collection.json) in Postman and execute the Collection Runner with test assertions.
  4. Explain deployment configuration ([`render.yaml`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-06-rest-api/render.yaml)) and demonstrate public cloud endpoint verification.
* **Code location:** [`practical-06-rest-api/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-06-rest-api).

### Practical 07 (Node.js + Express + MongoDB NoSQL Web Application)
* **What to demonstrate:**
  1. Show MongoDB database (`fixit_campus_db`) and collection (`maintenance_issues`) creation via Mongoose Schema and [`mongo-init.js`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-07-mongodb-nodejs/mongo-init.js).
  2. Open the **Web Browser Dashboard** at `http://localhost:5002`. Show live MongoDB connection status badge, create a new issue, search & filter, update status via dropdown, and delete with modal confirmation.
  3. Open Postman and run [`FixIt-Practical-07.postman_collection.json`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-07-mongodb-nodejs/FixIt-Practical-07.postman_collection.json) to verify all REST endpoints and Mongoose validation error handlers.
  4. Run `npm run test:endpoints` to demonstrate automated verification of both the web delivery and API layers.
* **Code location:** [`practical-07-mongodb-nodejs/`](file:///c:/College/3rd%20Year/Web%20technology/Fixit/practical-07-mongodb-nodejs).

---

## 🛠️ Verification & Quality Assurance

* ✅ **Responsive Breakpoints:** Tested for 375px (Mobile), 768px (Tablet), 1024px (Laptop), and 1440px (Desktop).
* ✅ **Zero Horizontal Overflow:** Clean box-sizing and responsive gutters.
* ✅ **Validation Defense:** Email and 10-digit Indian phone validation enforced across JavaScript, React, and Backend middleware.
* ✅ **Accessibility:** High contrast ratios, aria labels, and keyboard-navigable controls.
* ✅ **Modular Separation:** No monolithic files or duplicated logic.

---

*FixIt — Engineered for Academic and Operational Excellence.*
