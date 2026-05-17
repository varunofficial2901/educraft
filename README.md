# 🎓 EduAdmin Panel — Full Stack Setup Guide

A premium dark-themed admin dashboard for your test paper selling platform.

---

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (Community) → https://www.mongodb.com/try/download/community
- **npm** (comes with Node.js)

---

## 🚀 Quick Start (3 Steps)

### Step 1 — Install Dependencies

Open a terminal in the `eduadmin/` folder and run:

```bash
# Install root dependencies (for running both together)
npm install

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

Or just run:
```bash
npm run install:all
```

---

### Step 2 — Start MongoDB

**On Windows:**
```bash
# If installed as a service, it's already running.
# Or start manually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**On macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

---

### Step 3 — Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- ✅ Admin account: `admin@eduplatform.com` / `admin123`
- 📚 5 sample courses
- 📋 25 test papers
- 🎓 10 student enrollments
- ✉️ 4 contact messages

---

### Step 4 — Start the App

Run both backend and frontend together:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 — Backend API (port 5000)
npm run dev:backend

# Terminal 2 — Frontend (port 3000)
npm run dev:frontend
```

Open: **http://localhost:3000**

Login with: `admin@eduplatform.com` / `admin123`

---

## 📁 Project Structure

```
eduadmin/
├── backend/
│   ├── models/
│   │   ├── Admin.js          # Admin user model
│   │   ├── Course.js         # Course model
│   │   ├── Paper.js          # Test paper model
│   │   ├── Enrollment.js     # Enrollment model
│   │   └── Message.js        # Contact message model
│   ├── routes/
│   │   ├── auth.js           # Login, profile, password
│   │   ├── courses.js        # Course CRUD
│   │   ├── papers.js         # Test paper CRUD + file upload
│   │   ├── enrollments.js    # Enrollment management
│   │   ├── students.js       # Student view
│   │   ├── messages.js       # Contact messages
│   │   └── dashboard.js      # Analytics & stats
│   ├── middleware/
│   │   ├── auth.js           # JWT protection middleware
│   │   └── upload.js         # Multer file upload
│   ├── config/
│   │   └── seed.js           # Database seeder
│   ├── uploads/              # Uploaded files (auto-created)
│   │   ├── thumbnails/       # Course thumbnails
│   │   └── papers/           # PDF test papers
│   ├── .env                  # Environment config
│   ├── server.js             # Express app entry
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js      # Axios API service layer
│   │   ├── context/
│   │   │   └── AuthContext.js # JWT auth state
│   │   ├── components/
│   │   │   ├── UI.js         # Reusable UI components
│   │   │   └── Sidebar.js    # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── Dashboard.js  # Analytics dashboard
│   │   │   ├── Courses.js    # Course management
│   │   │   ├── CourseDetail.js # Course + papers
│   │   │   ├── Papers.js     # All papers view
│   │   │   ├── Enrollments.js # Enrollment table
│   │   │   ├── Students.js   # Student panel
│   │   │   ├── Messages.js   # Contact inbox
│   │   │   └── Settings.js   # Profile + Login page
│   │   ├── App.js            # Root layout + routing
│   │   └── index.js          # React entry
│   └── package.json
│
├── package.json              # Root scripts
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → returns JWT |
| GET | `/api/auth/me` | Get current admin (protected) |
| PUT | `/api/auth/update-profile` | Update name/email |
| PUT | `/api/auth/change-password` | Change password |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | All stats + recent data |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/:id` | Course + papers + enrollments |
| POST | `/api/courses` | Create course (multipart) |
| PUT | `/api/courses/:id` | Update course |
| PATCH | `/api/courses/:id/toggle-status` | Toggle active/inactive |
| DELETE | `/api/courses/:id` | Delete course + its papers |

### Papers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/papers?course=<id>` | List papers (optionally by course) |
| POST | `/api/papers` | Add paper (multipart PDF upload) |
| PUT | `/api/papers/:id` | Update paper |
| PATCH | `/api/papers/:id/toggle-visibility` | Show/hide |
| PATCH | `/api/papers/reorder/batch` | Reorder papers |
| DELETE | `/api/papers/:id` | Delete paper |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments` | List with search + filter |
| POST | `/api/enrollments` | Create enrollment (public) |
| PATCH | `/api/enrollments/:id/payment` | Update payment status |
| DELETE | `/api/enrollments/:id` | Remove enrollment |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | All courses with student counts |
| GET | `/api/students/course/:id` | Students for a course |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | List with search |
| POST | `/api/messages` | Submit contact message (public) |
| PATCH | `/api/messages/:id/read` | Mark as read |
| PATCH | `/api/messages/:id/unread` | Mark as unread |
| DELETE | `/api/messages/:id` | Delete message |

---

## ⚙️ Environment Config

Edit `backend/.env` to change settings:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eduadmin
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

---

## 🔗 Integrate with your Website Frontend

To receive contact form submissions from your website:

```javascript
// POST to your admin API from your website
await fetch('http://localhost:5000/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, phone, message })
});
```

To create enrollments after payment confirmation:

```javascript
await fetch('http://localhost:5000/api/enrollments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ studentName, email, phone, course: courseId, paymentStatus: 'paid', paymentId })
});
```

---

## 🛠️ Common Issues

**MongoDB not connecting:**
- Make sure MongoDB is running on port 27017
- Check `MONGO_URI` in `.env`

**Port already in use:**
- Change `PORT` in `.env` for backend
- For frontend: `PORT=3001 npm start` inside `/frontend`

**CORS error:**
- Make sure `FRONTEND_URL` in `.env` matches your React app URL exactly

**File uploads not working:**
- The `uploads/` folder is auto-created inside `/backend`
- Make sure disk has write permissions

---

## 🔒 Security Notes for Production

1. Change `JWT_SECRET` to a strong random string
2. Add HTTPS / SSL
3. Set `NODE_ENV=production`
4. Restrict CORS to your actual domain
5. Add rate limiting (`express-rate-limit`)
6. Use environment variables — never commit `.env`
