# IoT Lab Inventory Management - Backend API

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management-admin-only)
- [Testing with Postman](#testing-with-postman)
- [Testing with Website](#testing-with-website)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://ia:iotlab@iot-inventory.81la0go.mongodb.net/iot-inventory?retryWrites=true&w=majority
   JWT_SECRET=supersecretkey_iot_inventory_2024
   ALLOWED_EMAIL_DOMAIN=atriauniversity.edu.in
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

   You should see:
   ```
   Server running on port 5000
   MongoDB Connected Successfully
   ```

---

## 🔧 Environment Setup

### MongoDB Atlas Configuration
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Network Access** (Security section)
3. Click **+ ADD IP ADDRESS**
4. Click **ALLOW ACCESS FROM ANYWHERE** (for development)
5. Click **Confirm**

---

## 📡 API Endpoints

Base URL: `http://localhost:5000`

### Authentication

#### 1. Register New User
**Endpoint:** `POST /api/auth/register`  
**Access:** Public  
**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@atriauniversity.edu.in",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "674f1234567890abcdef1234",
    "name": "John Doe",
    "email": "john@atriauniversity.edu.in",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` - Missing fields or user already exists
- `500` - Server error

---

#### 2. Login
**Endpoint:** `POST /api/auth/login`  
**Access:** Public  
**Description:** Login for users and admins

**Request Body:**
```json
{
  "email": "user@atriauniversity.edu.in",
  "password": "yourpassword"
}
```

**Hardcoded Admin Credentials:**
```json
{
  "email": "admin@atriauniversity.edu.in",
  "password": "iotlab"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "674f1234567890abcdef1234",
    "name": "Administrator",
    "email": "admin@atriauniversity.edu.in",
    "role": "admin"
  }
}
```

**Error Responses:**
- `400` - Invalid credentials or missing fields
- `500` - Server error

---

#### 3. Change Password
**Endpoint:** `POST /api/auth/change-password`  
**Access:** Private (requires authentication)  
**Description:** Change user password

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400` - Incorrect current password or missing fields
- `401` - Not authenticated
- `404` - User not found
- `500` - Server error

---

### User Management (Admin Only)

#### 4. Get All Users
**Endpoint:** `GET /api/admin/users`  
**Access:** Admin only  
**Description:** Retrieve list of all users

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Success Response (200):**
```json
[
  {
    "_id": "674f1234567890abcdef1234",
    "name": "John Doe",
    "email": "john@atriauniversity.edu.in",
    "role": "user",
    "createdAt": "2024-12-04T10:30:00.000Z"
  },
  {
    "_id": "674f1234567890abcdef5678",
    "name": "Administrator",
    "email": "admin@atriauniversity.edu.in",
    "role": "admin",
    "createdAt": "2024-12-04T09:00:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Not authenticated
- `403` - Access denied (not admin)
- `500` - Server error

---

#### 5. Add New User
**Endpoint:** `POST /api/admin/users`  
**Access:** Admin only  
**Description:** Create a new user (admin can set role)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@atriauniversity.edu.in",
  "password": "password123",
  "role": "user"
}
```

**Success Response (200):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "674f1234567890abcdef9999",
    "name": "Jane Smith",
    "email": "jane@atriauniversity.edu.in",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` - Missing fields or user already exists
- `401` - Not authenticated
- `403` - Access denied (not admin)
- `500` - Server error

---

#### 6. Update User
**Endpoint:** `PUT /api/admin/users/:id`  
**Access:** Admin only  
**Description:** Update user information

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**URL Parameters:**
- `id` - User ID to update

**Request Body (all fields optional):**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@atriauniversity.edu.in",
  "role": "admin",
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "674f1234567890abcdef9999",
    "name": "Jane Doe",
    "email": "jane.doe@atriauniversity.edu.in",
    "role": "admin"
  }
}
```

**Error Responses:**
- `401` - Not authenticated
- `403` - Access denied (not admin)
- `404` - User not found
- `500` - Server error

---

#### 7. Delete User
**Endpoint:** `DELETE /api/admin/users/:id`  
**Access:** Admin only  
**Description:** Delete a user

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**URL Parameters:**
- `id` - User ID to delete

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400` - Cannot delete your own account
- `401` - Not authenticated
- `403` - Access denied (not admin)
- `404` - User not found
- `500` - Server error

---

## 🧪 Testing with Postman

### 1. Import Collection

Create a new Postman collection with the following requests:

### 2. Setup Environment Variables

Create a Postman environment with:
- `base_url`: `http://localhost:5000`
- `token`: (will be set automatically after login)
- `user_id`: (will be set manually for testing)

### 3. Example Requests

#### A. Register User
```
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@atriauniversity.edu.in",
  "password": "test123"
}
```

#### B. Login as Admin
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "admin@atriauniversity.edu.in",
  "password": "iotlab"
}
```

**After login, copy the token and save it to environment variable `token`**

#### C. Get All Users (Admin)
```
GET {{base_url}}/api/admin/users
Authorization: Bearer {{token}}
```

#### D. Add User (Admin)
```
POST {{base_url}}/api/admin/users
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@atriauniversity.edu.in",
  "password": "password123",
  "role": "user"
}
```

#### E. Update User (Admin)
```
PUT {{base_url}}/api/admin/users/{{user_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "admin"
}
```

#### F. Delete User (Admin)
```
DELETE {{base_url}}/api/admin/users/{{user_id}}
Authorization: Bearer {{token}}
```

---

## 🌐 Testing with Website

### Frontend URL
`http://localhost:3000`

### Test Flow

#### 1. **Register New User**
1. Go to `http://localhost:3000`
2. Click "New User? Create an Account"
3. Fill in:
   - Name: `Your Name`
   - Email: `yourname@atriauniversity.edu.in`
   - Password: `yourpassword`
   - Confirm Password: `yourpassword`
4. Click "Create Account"
5. You should see "Registration successful!"

#### 2. **Login as Regular User**
1. Click "Already have an account? Login"
2. Select "User Login"
3. Enter your email and password
4. Click "Login"
5. You should be redirected to the User Dashboard

#### 3. **Login as Admin**
1. Go to `http://localhost:3000`
2. Select "Administrator Login"
3. Enter:
   - Email: `admin@atriauniversity.edu.in`
   - Password: `iotlab`
4. Click "Login"
5. You should be redirected to the Admin Dashboard

#### 4. **Change Password**
1. After logging in, click on your profile (top right)
2. Scroll to "Change Password" section
3. Enter:
   - Current Password
   - New Password
   - Confirm New Password
4. Click "Change Password"

#### 5. **Logout**
1. Click the "Logout" button in the sidebar
2. You should be redirected to the login page

---

## 🔑 Default Credentials

### Admin Account
- **Email:** `admin@atriauniversity.edu.in`
- **Password:** `iotlab`
- **Role:** `admin`

### Test User (after registration)
- **Email:** `<your-email>@atriauniversity.edu.in`
- **Password:** `<your-password>`
- **Role:** `user`

---

## 📝 Notes

1. **Email Restriction:** Only emails ending with `@atriauniversity.edu.in` are allowed
2. **JWT Token:** Tokens expire after 24 hours
3. **Admin Creation:** The admin account is automatically created on first login
4. **Password Security:** All passwords are hashed using bcrypt before storage
5. **Self-Deletion Prevention:** Admins cannot delete their own account

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error:** `Could not connect to any servers in your MongoDB Atlas cluster`

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add your IP address or use `0.0.0.0/0` for development
3. Wait 1-2 minutes for changes to take effect
4. Restart the server

### Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env file
PORT=5001
```

### Invalid Token
**Error:** `Token is not valid`

**Solution:**
1. Login again to get a new token
2. Make sure you're using `Bearer <token>` format
3. Check if token has expired (24 hours)

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Express.js Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)
- [Postman Documentation](https://learning.postman.com/)

---

## 👨‍💻 Development

### Project Structure
```
backend/
├── models/
│   └── User.js           # User schema
├── routes/
│   ├── auth.js          # Authentication routes
│   └── admin.js         # Admin/user management routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── .env                 # Environment variables
├── server.js            # Main server file
└── README.md           # This file
```

### Adding New Endpoints
1. Create route file in `routes/` directory
2. Import and mount in `server.js`
3. Update this README with new endpoints

---

## 📄 License

This project is part of the IoT Lab Inventory Management System.

---

**Last Updated:** December 4, 2024  
**Version:** 1.0.0
