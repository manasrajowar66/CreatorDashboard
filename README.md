# 📚 Creator Dashboard — MERN Stack Assignment

## ✨ Overview

This project is a **Creator Dashboard** web application that allows users (creators) to:
- Manage their profile
- Earn credits based on activities
- View and interact with a personalized content feed (aggregated from Reddit and Twitter)
- Save, share, and report posts
- Admins can view and update user credit balances and see analytics

---

## ⚙️ Tech Stack

| Part | Technology |
|:---|:---|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Caching | Redis |
| Deployment | Google Cloud Run (Backend), Firebase Hosting (Frontend) |

---

## 🚀 Deployment Links

| Environment | URL |
|:---|:---|
| Frontend (Firebase Hosting) | [https://your-frontend-link.web.app](https://your-frontend-link.web.app) |
| Backend API (Google Cloud Run) | [https://your-backend-link.a.run.app](https://your-backend-link.a.run.app) |

---

## 🔒 Authentication

- **JWT-based authentication** implemented
- **Role-based access control** (User, Admin)

---

## 📈 Credit Points System

Users earn credits by:
- Logging in daily
- Completing their profile
- Interacting with feed posts (save/share)

Admins can:
- View user credit analytics
- Update user credit balances manually

---

## 📰 Feed Aggregator

- Posts are fetched from:
  - **Reddit API** (live)
  - **Twitter mock posts** (simulated, since Twitter API requires elevated access)
- Displayed in an infinite scroll feed
- Users can:
  - Save posts
  - Share post links
  - Report inappropriate content

> **Note:** Due to Twitter and LinkedIn public API limitations, Twitter posts are simulated with mock data.

---

## 📦 Project Structure

```
/backend
  /routes
    authRoutes.js
    feedRoutes.js
    userRoutes.js
  /models
    User.js
  /controllers
    authController.js
    feedController.js
  server.js
  Dockerfile
/frontend
  /src
    /components
    /pages
    /services
    /context
    App.js
    index.js
firebase.json
README.md
```

---

## 🛠️ How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/your-repo/creator-dashboard.git
   cd creator-dashboard
   ```

2. Setup environment variables:
   - Backend:
     ```env
     MONGODB_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_secret
     REDIS_URL=your_redis_url
     ```
   - Frontend:
     ```env
     REACT_APP_API_URL=https://your-backend-link.a.run.app
     ```

3. Start backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. Start frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

---

## 📄 Author

- **Name:** Manas Rajowar
- **Role:** MERN Stack Developer
- **GitHub:** [@manasrajowar66](https://github.com/manasrajowar66)
- **LinkedIn:** [Manas Rajowar](https://www.linkedin.com/in/manas-rajowar-3b0b981a3/)

---

# ✅ That's it!

---

