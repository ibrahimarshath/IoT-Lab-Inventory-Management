# IoT Lab Inventory Management System

## Overview
The IoT Lab Inventory Management System is a web application designed to digitize and streamline the management of hardware components in an IoT laboratory. The system replaces manual record-keeping with a structured digital workflow that allows users to view available components, track borrowing activity, generate procurement lists, and receive project-based hardware recommendations. A supplementary IoT feature provides remote control of smart devices such as lights and fans.

This project is built using the MERN stack. The frontend is developed using React (with Vite) and focuses on creating a clean, responsive, and functional interface for inventory management. The backend is built using Node.js, Express, and MongoDB, providing RESTful APIs and database operations.

## Features

### 1. Hardware Component Management
*   Add, edit, and delete components.
*   Store detailed information such as:
    *   Name
    *   Category
    *   Quantity
    *   Description
    *   Datasheet link
    *   Purchase date
    *   Condition
    *   Tags (e.g., drone, robot, IoT, automation)
*   Search and filter components through the frontend interface.

### 2. Borrow and Return Tracking
*   Log which user borrowed a component, quantity taken, borrow date, and expected return date.
*   View borrowing history for both users and components.
*   Track overdue items and low-stock conditions.

### 3. Stock Monitoring and Procurement
*   Automatic monitoring of available quantities.
*   Threshold alerts for low stock.
*   Auto-generated procurement list with required quantity and priority.

### 4. Tag-Based Recommendation Engine
*   Filter and recommend components based on tags.
*   Supports multi-tag searches for specific project requirements.

### 5. Smart Lab Control (Optional Extension)
*   Control lights and fans through the web interface.
*   Shows real-time on/off status.
*   Can be expanded with scheduling or automation features.

## Frontend Architecture

### Technology
*   React (Vite)
*   TypeScript / JavaScript
*   Axios for API communication
*   Context API or state management (as implemented)
*   Modular and reusable component structure
*   Clean folder separation (components, pages, services)

### Frontend Functions
*   User interface for managing hardware data
*   Dynamic forms for adding and editing components
*   Interactive tables and filterable lists
*   Borrow and return UI workflows
*   Project-type search with multi-tag filtering
*   Dashboard views for stock, activity logs, and procurement insights
*   Optional IoT device toggling and status display

## Backend Architecture

### Technology
*   Node.js
*   Express.js
*   MongoDB with Mongoose
*   Environment variable management using `.env`
*   Modular route and controller structure

### Modules
*   **components API** for CRUD operations
*   **borrow and return APIs** for activity logging
*   **procurement API** for low-stock tracking
*   **tags API** for recommendations
*   **Optional:** smart device control API if IoT integration is used

Backend follows a RESTful structure and interacts with the frontend via JSON responses.

## Folder Structure (Simplified)

```
project/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/iot-inventory/
    ├── src/
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    └── package-lock.json
```

## Installation and Setup

### Prerequisites
*   Node.js
*   MongoDB Atlas or local MongoDB
*   Git

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file with the following variables:
    ```env
    MONGO_URI=your_database_uri
    PORT=5000
    JWT_SECRET=any_secret_key (if authentication is used)
    ```
4.  Start the server:
    ```bash
    npm start
    # or while developing:
    npm run dev
    ```

### Frontend Setup
1.  Navigate to the frontend folder:
    ```bash
    cd frontend/iot-inventory
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## API Endpoints (Summary)

| Module | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| Components | `/api/components` | GET/POST | Retrieve or add components |
| Components | `/api/components/:id` | PUT/DELETE | Update or delete a component |
| Borrow | `/api/borrow` | POST | Borrow a component |
| Return | `/api/return` | POST | Return a component |
| Procurement | `/api/procurement` | GET | View low-stock items |
| Tags | `/api/tags` | GET | Tag-based suggestions |
| Smart Devices (Optional) | `/api/smart` | GET/POST | Control lights and fans |

## Deliverables
*   Fully functional MERN application
*   Hardware management dashboard
*   Borrow and return module
*   Stock monitoring and procurement list
*   Tag-based suggestion engine
*   Smart device control panel (optional extension)
*   Documentation and demo video for evaluation

## Conclusion
This project demonstrates the implementation of a structured MERN application with a focus on frontend usability and backend reliability. It offers a complete digital solution for managing laboratory inventory, tracking hardware usage, recommending components for projects, and optionally integrating IoT device control within the interface.
