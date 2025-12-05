# IoT Lab Inventory Management - Setup Guide

If you are setting this up on a new device or have just pulled the latest code, follow these steps to get everything running.

## 1. Prerequisites
- Node.js installed (v16 or higher recommended)
- MongoDB installed and running (or a MongoDB Atlas connection string)
- Git installed

## 2. Backend Setup
The backend handles the API and database connection.

1.  Open a terminal and navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies (fixes "module not found" errors):
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder if it doesn't exist, and add your configuration:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
4.  Start the backend server:
    ```bash
    node server.js
    ```
    You should see "Server running on port 5000" and "MongoDB Connected Successfully".

## 3. Frontend Setup
The frontend is the React application.

1.  Open a **new** terminal window (keep the backend running).
2.  Navigate to the `frontend/iot-inventory` folder:
    ```bash
    cd frontend/iot-inventory
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open the link shown in the terminal (usually `http://localhost:5173` or `http://localhost:3000`) in your browser.

## Troubleshooting
-   **Module not found**: Run `npm install` in the folder where the error occurred (backend or frontend).
-   **Port already in use**: If port 5000 or 3000 is busy, kill the existing node processes or allow the app to use a different port (it usually switches automatically).
