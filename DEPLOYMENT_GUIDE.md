# FixIt Full-Stack Deployment Guide (Render)

This repository is pre-configured for a **single-service full-stack deployment** on Render. The Express backend serves both the production React Single Page Application (SPA) and all RESTful API endpoints with Role-Based Access Control (RBAC).

---

## 🌐 Active Live Deployment

- **Production Application URL:** [https://fixit-sp6y.onrender.com/](https://fixit-sp6y.onrender.com/)
- **RESTful API Endpoint:** [https://fixit-sp6y.onrender.com/api/issues](https://fixit-sp6y.onrender.com/api/issues)
- **Role Permissions & Auth Endpoint:** [https://fixit-sp6y.onrender.com/api/auth/roles](https://fixit-sp6y.onrender.com/api/auth/roles)
- **Hosting Platform:** Render (Free Web Service Tier)
- **Repository:** [https://github.com/Harsh746-bit/Fixit](https://github.com/Harsh746-bit/Fixit)

---

## 🚀 Quick Deploy Steps (Under 3 Minutes)

### Step 1: Push Code to GitHub

1. Create a new repository on [GitHub](https://github.com/new) named **`fixit-campus`**.
2. Run the following commands in your terminal:

```bash
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/fixit-campus.git
git push -u origin main
```

*(Note: Git is already initialized locally and all files are committed).*

---

### Step 2: Create Web Service on Render

1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** &rarr; Select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your `fixit-campus` repository.
4. Fill in the deployment details:

| Configuration Field | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `fixit-campus-app` | Generates `https://fixit-campus-app.onrender.com` |
| **Region** | `Singapore` (or nearest) | Free Tier supported |
| **Branch** | `main` | Production branch |
| **Root Directory** | *(Leave blank)* | Default root |
| **Runtime** | `Node` | Detected automatically |
| **Build Command** | `npm run build` | Builds backend + Vite React frontend |
| **Start Command** | `npm start` | Launches Node.js Express server |
| **Instance Type** | `Free` | $0/month |

5. Under **Environment Variables** (optional, recommended):
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `campus_fixit_secure_key_2026`

6. Click **Deploy Web Service**!

---

## 🔍 What Happens During Build & Deployment

Render executes the pre-configured root scripts:
1. `npm run build`:
   - Installs backend dependencies.
   - Installs frontend dependencies.
   - Compiles Vite React code into `final-app/frontend/dist/`.
2. `npm start`:
   - Express detects the compiled `dist/` directory.
   - Express serves the React SPA on `/`.
   - Express serves REST API routes on `/api/issues` and `/api/auth`.

---

## 🧪 Post-Deployment Verification

Once deployed, your live URL will be:
`https://<your-service-name>.onrender.com`

### 1. Browser Verification
- Open `https://<your-service-name>.onrender.com`
- Test the **Role Switcher** (Student, Staff, Admin).
- Submit a new ticket, verify status updates, and test delete actions.

### 2. Postman API Verification
Import or test the following endpoints:

| Method | Endpoint | Headers | Expected Status |
| :--- | :--- | :--- | :--- |
| `GET` | `https://<your-url>.onrender.com/api/issues` | — | `200 OK` |
| `GET` | `https://<your-url>.onrender.com/api/statistics` | — | `200 OK` |
| `POST` | `https://<your-url>.onrender.com/api/issues` | `Content-Type: application/json` | `201 Created` |
| `PATCH` | `https://<your-url>.onrender.com/api/issues/:id/status` | `x-user-role: student` | `403 Forbidden` |
| `PATCH` | `https://<your-url>.onrender.com/api/issues/:id/status` | `x-user-role: staff` | `200 OK` |
| `DELETE`| `https://<your-url>.onrender.com/api/issues/:id` | `x-user-role: admin` | `200 OK` |
