
# 📝 Task Management App

A modern, web-based Task Management application that enables users to efficiently create, track, update, and delete tasks through a clean and responsive interface. Built with React and TailwindCSS on the frontend, and Node.js, Express, and MongoDB on the backend for performance and scalability.

## 🚀 Features

- ✅ Add Task (with optional description)
- 📋 View list of tasks with status (Complete / Incomplete)
- 🔁 Mark tasks as Complete or Incomplete
- ❌ Delete tasks
- 🔐 User authentication using JWT

## 🛠️ Tech Stack

- **Frontend:** React.js, TailwindCSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (or in-memory storage as fallback)

## 🔧 Project Setup

### 📦 Clone the Repository

```bash
git clone https://github.com/PremjitDas/Task-Management-App.git
cd YOUR_FOLDER_NAME

```

## 🖥️ Backend (Server)

### 📁 Navigate to Server Directory

```bash
cd Server

```
### 📦 Install Dependencies

```bash
npm install

```
### 🚀 Run in Development Mode

```bash
npm run dev

```
### ⚙️ Environment Configuration

- Create a .env file in the server directory and add the following:

```bash
PORT= your_port
MONGO_URI= your_database_url
JWT_SECRET= your_jwt_secret
```

## 🌐 Frontend (Client)

### 📁 Navigate to Server Directory

```bash
cd Client

```
### 📦 Install Dependencies

```bash
npm install

```
### 🚀 Run in Development Mode


```bash
npm run dev

```

## 📁 Folder Structure

```bash

TODO_PROJECT/
├── client/                   # Frontend - Vite + React
│   ├── node_modules/         # Dependencies
│   ├── public/               # Public assets
│   ├── src/                  # Source files
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   └── store/            # State management
│   └── [config files]        # Various configuration files
│
├── server/                   # Backend - Node.js + Express
│   ├── node_modules/         # Dependencies
│   ├── public/               # Public assets
│   ├── src/                  # Source files
│   │   ├── controllers/      # Route controllers
│   │   ├── db/               # Database configuration
│   │   ├── middlewares/      # Express middlewares
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   └── utils/            # Utility functions
│   └── [config files]        # Various configuration files
│
└── README.md                 # Project documentation

```
