# Creator Dashboard — MERN Stack

---

## ✨ Overview

This project is a **Creator Dashboard** web application that allows users (creators) to:

- Manage their profile
- Earn credits based on activities
- View and interact with a personalized content feed (aggregated from Reddit and Twitter)
- Save, share, and report posts
- Real-time updates using **WebSockets**
- Admins can view and update user credit balances and see analytics

---

## ⚙️ Tech Stack

| Part                    | Technology                              |
| ----------------------- | --------------------------------------- |
| Frontend                | React.js, Tailwind CSS                  |
| Backend                 | Node.js, Express.js                     |
| Database                | MongoDB Atlas                           |
| Caching                 | Redis                                   |
| Real-time Communication | Socket.IO                               |
| Deployment              | Google Cloud Run (Dockerized Container) |
| CI/CD                   | GitHub Actions                          |

---

## 🚀 Deployment Links

| Environment                                     | URL                                                                                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Full Application (Deployed on Google Cloud Run) | [creatordashboard-production.up.railway.app](creatordashboard-production.up.railway.app) |

| Repository  | URL                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| GitHub Repo | [https://github.com/manasrajowar66/CreatorDashboard](https://github.com/manasrajowar66/CreatorDashboard) |

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

> **Note:** Due to public API restrictions from Twitter and LinkedIn, Twitter posts are simulated with mock data.

---

## 🛠️ How to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/manasrajowar66/CreatorDashboard.git
   cd CreatorDashboard
   ```

2. Setup environment variables:

   - Check `.env.example` files provided in both `client and server `directories.
   - Create your own `.env` files based on the examples:
     - Backend:
       ```env
       PORT=5000
       MONGO_URI=your_mongodb_uri
       JWT_SECRET=vertxai
       REDIS_URL=redis://localhost:6379
       ```
     - Frontend:
       ```env
       VITE_API_ENDPOINT=http://localhost:5000/api/
       VITE_SOCKET_URL=http://localhost:5000
       ```

3. Start backend:

   ```bash
   cd server
   npm install
   npm run dev
   ```

4. Start frontend:

   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 📦 Deployment

- Full project is **Dockerized**.
- Deployed on **Google Cloud Run** using containerized services.
- Firebase Hosting is not used separately — everything is served from GCP backend.

> **Note:** Cloud Run will automatically pick the `PORT` environment variable for container startup.

---

## 🔄 CI/CD - GitHub Actions

- This project uses **GitHub Actions** for Continuous Deployment.
- On every push to the `main` branch:
  - The application is built into a Docker image.
  - The image is pushed to Google Container Registry.
  - Automatically deployed to Google Cloud Run.

### CI/CD Setup Process

1. Create a GCP Service Account with necessary permissions (`Cloud Run Admin`, `Storage Admin`, `Service Account User`).
2. Generate and download a JSON key for the service account.
3. Add these secrets to your GitHub repository:
   - `GCP_PROJECT_ID`
   - `GCP_SA_KEY`
   - `GCP_REGION`
   - `CLOUD_RUN_SERVICE`
4. Set up a GitHub Actions workflow to build, push, and deploy the app automatically on push to `main`.

---

## 📡 Real-Time Features

- Implemented **Socket.IO** for real-time updates.
- Saved and reported posts trigger real-time notifications.

---

## 📄 Author

- **Name:** Manas Rajowar
- **GitHub:** [@manasrajowar66](https://github.com/manasrajowar66)
- **LinkedIn:** [Manas Rajowar](https://www.linkedin.com/in/manas-rajowar-3b0b981a3/)

---

# ✅ That's it! 🚀
