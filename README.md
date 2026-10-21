# SecretSpace

SecretSpace is a full-stack web application starter built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

---

## 📁 Project Structure

```text
SecretSpace/
├── client/                     # Frontend (React 19 + Vite + Tailwind CSS v4)
│   ├── public/                 # Favicons & public static assets
│   ├── src/
│   │   ├── assets/             # Branding graphics & vector assets
│   │   ├── components/
│   │   │   ├── common/         # Reusable widgets (Cards, Modals, Feed items, Icons)
│   │   │   └── layout/         # Navigation bars, Sidebars, Responsive layout wrapper
│   │   ├── context/            # React AppContext (state management & session guards)
│   │   ├── data/               # Mock datasets & categories
│   │   ├── pages/              # Routed pages (Feed, Explore, Polls, Profile, Admin, etc.)
│   │   ├── services/           # Axios/Fetch API client & service endpoints
│   │   ├── App.jsx             # Route definitions & protected route guards
│   │   ├── index.css           # Tailwind CSS v4 theme tokens & Cherry Noir palette
│   │   └── main.jsx            # React root application entry point
│   ├── .env.example            # Client environment variables template
│   ├── index.html              # HTML document template
│   ├── package.json            # Frontend dependencies & build scripts
│   └── vite.config.js          # Vite build & Tailwind CSS plugin configuration
│
├── server/                     # Backend API (Node.js + Express + Mongoose + JWT)
│   ├── src/
│   │   ├── config/             # Database connection & environment configuration
│   │   ├── controllers/        # Route controllers (Auth, Posts, Polls, Reports, Admin)
│   │   ├── middleware/         # JWT verification, Role authorization, Error handlers
│   │   ├── models/             # Mongoose schemas (User, Post, Comment, Poll, Report)
│   │   ├── routes/             # Modular REST API route handlers
│   │   ├── scripts/            # Database seed script (npm run seed)
│   │   └── index.js            # Express application entry point & CORS configuration
│   ├── tests/                  # Automated unit and integration test suite (npm test)
│   ├── .env.example            # Server environment variables template
│   └── package.json            # Backend dependencies & scripts
│
├── reports/                    # Competition evaluation & verified bug bounty reports (.gitignore)
├── .gitignore                  # Git ignore rules for node_modules, .env & private reports
└── README.md                   # Project documentation and quickstart guide
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, JavaScript (ES modules)
- **Backend**: Node.js, Express.js, CORS, Dotenv, JavaScript (ES modules)
- **Database**: MongoDB with Mongoose ODM
- **Development Tools**: Nodemon (automatic backend reloading)

---

## 🚀 Setup Instructions

### 1. Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas connection URI)

---

### 2. Configure Environment Files

Before running the apps, create `.env` files from the provided `.env.example` templates:

#### Backend (`server/.env`):
Create a file named `server/.env` with the following content:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secretspace
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env`):
Create a file named `client/.env` with the following content:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Running the Project (Separate Terminals)

Full-stack applications require the backend and frontend to run concurrently. Open two separate terminal windows in your code editor or shell.

#### Terminal 1: Backend Server (Port 5000)
Navigate to the `server` directory and launch the development server with live reloading:
```bash
cd server
npm run dev
```
> The Express server will start on [http://localhost:5000](http://localhost:5000).  
> You can verify the health route directly in your browser: [http://localhost:5000/api/health](http://localhost:5000/api/health).

#### Terminal 2: Frontend Client (Port 5173)
Navigate to the `client` directory and start the Vite development server:
```bash
cd client
npm run dev
```
> The Vite development server will start on [http://localhost:5173](http://localhost:5173).  
> Open that link in your browser to view the application with Tailwind CSS styling and live API status checks.

---

## 📜 Available Scripts

### In `/client`:
- `npm run dev`: Starts the Vite local development server with hot module replacement (HMR).
- `npm run build`: Compiles and bundles production-ready frontend assets into `/client/dist`.
- `npm run preview`: Locally previews the production build.

### In `/server`:
- `npm run dev`: Starts Express using `nodemon` for automatic restart on file changes.
- `npm start`: Starts Express using standard Node.js runtime.
- `npm run seed`: Seeds the database with sample anonymous posts, polls, comments, and test accounts.
- `npm test`: Runs the automated security, validation, and error-handling test suite.
