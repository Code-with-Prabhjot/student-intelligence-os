# 🎓 RVCE Student Intelligence & Academic Lifecycle Management System

A production-grade, full-stack **MERN** application engineered for autonomous student tracking, academic lifecycle analytics, and proactive risk detection at **R.V. College of Engineering (RVCE)**.

---

## 🏛️ System Architecture & Tech Stack

```
/Skill_lab_project
  ├── backend/
  │   ├── config/db.js                  # Resilient Mongoose connection + Compass logger
  │   ├── models/Student.js             # Schema with RVCE USN regex, virtuals & indexes
  │   ├── controllers/studentController.js # Aggregations, CRUD, Bulk Ingest & Soft Recovery
  │   ├── routes/studentRoutes.js       # Express REST endpoints
  │   ├── seed/seedData.js              # 15 realistic RVCE profiles seeder
  │   ├── server.js                     # Express API entry point with health probes
  │   └── package.json
  └── frontend/
      ├── src/
      │   ├── components/
      │   │   ├── Navbar.jsx            # Search, Ctrl+K Palette trigger, Compass status
      │   │   ├── BentoStats.jsx        # Aggregation bento cards & skill telemetry
      │   │   ├── StudentTable.jsx      # Sortable columns, multi-select, pagination
      │   │   ├── StudentCard.jsx       # Grid view with micro-interactions & badges
      │   │   ├── StudentDrawer.jsx     # Slide-over Add/Edit form with live preview
      │   │   ├── StudentDetailModal.jsx# Comprehensive student lifecycle inspect view
      │   │   ├── DeleteModal.jsx       # Confirmation modal with soft recovery
      │   │   ├── CommandPalette.jsx    # Quick commands & Ctrl+K spotlight
      │   │   ├── ExportTools.jsx       # CSV spreadsheet, JSON dump, Bulk Ingestion
      │   │   └── Toast.jsx             # Interactive feedback with undo capability
      │   ├── context/StudentContext.jsx# Centralized reactive state store
      │   ├── App.jsx                   # Main layout & multi-filter ribbon
      │   └── index.css                 # Custom glassmorphism & dark-mode tokens
      ├── vite.config.js
      ├── tailwind.config.js
      └── package.json
```

### Backend:
- **Node.js & Express.js**: REST API with Morgan request telemetry and CORS.
- **Mongoose**: Strict schema validation, compound indexes (`usn`, `branch`, `semester`, `cgpa`), and virtuals (`attendanceTier`, `performanceTier`).
- **MongoDB**: Ready for MongoDB Compass at `mongodb://127.0.0.1:27017/rvce_student_db`.
- **High-Resilience Dual-Mode Architecture**: Pure MongoDB pipelines when connected, plus an in-memory hub for zero-friction evaluation.

### Frontend:
- **React (Vite)**: Modern fast-refresh build.
- **Tailwind CSS**: Zinc/Slate dark theme, glassmorphic blur effects (`backdrop-blur-xl`), custom glowing borders, and rounded-2xl cards.
- **Lucide React**: Engineering icons.
- **Axios**: Network client with reactive polling & health verification.

---

## 🧭 MongoDB Compass Connection Guide

The backend server is explicitly configured for **MongoDB Compass**.

1. Open **MongoDB Compass**.
2. In the connection string input, enter:
   ```
   mongodb://127.0.0.1:27017/rvce_student_db
   ```
3. Click **Connect**.
4. Navigate to database **`rvce_student_db`** and collection **`students`** to inspect the documents, compound indexes, and schemas.

---

## 🚀 Quickstart Guide

### 1. Configure MongoDB

Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` to either your local MongoDB instance or Atlas connection string. The repository ignores `.env`, so credentials are never committed. For Atlas, ensure the cluster's Network Access rules allow your current IP address.

### 2. Seed the Database (100 realistic RVCE profiles)
From the project root:
```bash
npm run seed
```
*(Or navigate to `/backend` and run `npm run seed`)*

This creates 100 authentic RVCE student records across **CSE, AIML, ISE, ECE, EEE, MECH, CIVIL, BIOTECH, AEROSPACE, and CHEMICAL**.

### 3. Start the Backend API Server
```bash
npm run backend
```
*(Or `cd backend && npm start`)*
- Server runs at: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

### 4. Start the Frontend Application
In a separate terminal:
```bash
npm run frontend
```
*(Or `cd frontend && npm run dev`)*
- Open your browser at: `http://localhost:5173`

---

## ⚡ Key Capabilities & Features

### 1. Complete Academic CRUD
- **USN Format Validation**: Enforces standard RVCE syntax (`^1RV\d{2}[A-Z]{2,3}\d{3}$`, e.g. `1RV23CS001`).
- **Real-Time Debounced Search**: Multi-field matching across USN, Name, Branch, Email, and Technical Skills.
- **Multi-Dimensional Filters**: Department (CSE, ISE, AIML, etc.), Semester (1-8), CGPA Range (min/max), and Attendance Cutoff (<75%).
- **Slide-over Drawer**: Smooth Add/Edit interface with real-time reactive card preview.
- **Soft Recovery & Trash**: Deleted students are moved to the trash and can be restored with a single click via the interactive **Undo Toast** or the **Trash filter**. Permanent purge option is also provided.

### 2. Dashboard Intelligence & Aggregations
- **MongoDB Aggregation Pipelines** calculate:
  - Total enrolled students.
  - Institutional average CGPA.
  - Institutional average attendance percentage.
  - Critical attendance risk cohort (<75% cutoff).
  - Department performance matrix (student count and average CGPA per branch).
  - High-impact technical skills distribution across all students.
  - Performance tier classification (Distinction ≥9.0, First Class 7.5–8.99, Second Class, Pass).

### 3. Productivity & Power-User Tools
- **Keyboard Shortcut (`Ctrl + K`)**: Command palette with quick actions, instant search, and one-click filtering.
- **View Modes**: One-click toggle between **Sortable Table View** and **Grid Cards View**.
- **Data Portability**: Instant one-click **Export to CSV Spreadsheet** or **Export to JSON Dump**.
- **Bulk Ingestion Portal**: Ingest or batch update student profiles via JSON schema.
- **Multi-Select Bulk Operations**: Select multiple students to bulk delete or export.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System uptime & MongoDB Compass connection probe |
| `GET` | `/api/students` | Get students with search, filters, sort & pagination |
| `GET` | `/api/students/stats/analytics` | MongoDB Aggregation Pipeline dashboard metrics |
| `GET` | `/api/students/:id` | Fetch single student by ObjectId or USN |
| `POST` | `/api/students` | Register a new student with USN format validation |
| `PUT` | `/api/students/:id` | Update an existing student record |
| `DELETE` | `/api/students/:id` | Soft delete (`?permanent=true` for hard purge) |
| `PATCH` | `/api/students/:id/restore` | Restore soft-deleted student to active roster |
| `POST` | `/api/students/bulk-delete` | Batch soft delete or purge |
| `POST` | `/api/students/bulk-restore` | Batch restore soft-deleted records |
| `GET` | `/api/students/export/all` | Export all active records for CSV/JSON |
| `POST` | `/api/students/bulk-import` | Batch upsert student records from JSON array |

---

## 🛡️ License
Built for RVCE Academic Excellence. Released under the MIT License.
