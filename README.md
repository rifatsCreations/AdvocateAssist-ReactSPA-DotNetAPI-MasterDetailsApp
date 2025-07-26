# 🎯 AdvocateAssist-React-DotNetAPI-MasterDetailsApp

A full-stack **Client & Payment Management System** built with **React** and **ASP.NET Core Web API**, using a clean Master-Details interface and full CRUD functionality.

---

## 📌 Overview

Manages clients and their payments through a responsive master-details UI with full Create, Read, Update, and Delete support.  
Includes live client search by name.

---

## 🛠️ Technologies Used

### 🔹 Backend – API
- ASP.NET Core Web API
- Entity Framework Core (Code First)
- SQL Server

### 🔹 Frontend – React App
- React (with Hooks)
- React Router
- Bootstrap
- Axios

---

## 🚀 Getting Started

### 🧪 Backend Setup

1. Open `AdvocateAssist.API` in Visual Studio.
2. No need to change the database name — just run:
   ```
   update-database
   ```
3. **(Optional)** If you want to change the database name, update the connection string in `appsettings.json`, then run:
   ```
   add-migration YourMigrationName
   update-database
   ```
4. Run the API.

### 💻 Frontend Setup

1. Navigate to the frontend folder:
   ```
   cd client-app
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the React app:
   ```
   npm run dev
   ```

⚠️ Make sure the API is running before starting the frontend app.

---

## ✨ Features

- Master-Details layout: One client with multiple payment entries
- Full CRUD support (Client & Payment)
- Live client search by name
- Responsive UI using Bootstrap
- Clean integration between React and ASP.NET Core Web API

---

## 📄 License

This project is intended for **educational use only**.
