# Testing Guide - IoT Lab Inventory Management

## Current Status
✅ All backend APIs are implemented and connected to MongoDB
✅ Frontend is connected to backend APIs
✅ Database starts empty (no components, no borrowings)
✅ All changes are saved to MongoDB

## What's Implemented

### Backend APIs (All saving to MongoDB)

1. **Components API** (`/api/components`)
   - `GET /api/components` - List all components
   - `POST /api/components` - Add new component
   - `PUT /api/components/:id` - Update component
   - `DELETE /api/components/:id` - Delete component

2. **Borrowings API** (`/api/borrowings`)
   - `GET /api/borrowings` - List all borrowings
   - `POST /api/borrowings` - Create new borrowing (updates component availability)
   - `PUT /api/borrowings/:id/return` - Mark as returned (restores component availability)

3. **Users API** (`/api/admin/users`)
   - User management for admins

4. **Auth API** (`/api/auth`)
   - Login/Register

## Testing the Complete Flow

### Step 1: Start the Application
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend/iot-inventory
npm run dev
```

### Step 2: Login
- Open browser to `http://localhost:5173`
- Login with your admin credentials
- If no admin exists, register a new account

### Step 3: Add Components
1. Navigate to "Browse and Manage Components"
2. Click "Add Component" button
3. Fill in the form:
   - Component Name: e.g., "Arduino Uno R3"
   - Category: e.g., "Microcontroller"
   - Total Quantity: e.g., 10
   - Min Threshold: e.g., 5
   - Condition: Select from dropdown
   - Purchase Date: Select date
   - Description: Brief description
   - Datasheet URL: Optional
   - Tags: Add relevant tags

4. Click "Add Component"
5. **Check MongoDB**: Component should now be in the `components` collection

### Step 4: Verify in MongoDB
```bash
# Connect to MongoDB
mongosh

# Use your database
use iot_inventory

# Check components
db.components.find().pretty()

# You should see your newly added component with:
# - name, category, quantity, available (same as quantity initially)
# - threshold, description, datasheet, purchaseDate, condition, tags
```

### Step 5: Create a Borrowing
1. Navigate to "Borrow & Return Management"
2. Click "New Borrowing" button
3. Fill in the form:
   - Student Email: Must match a registered user's email
   - Select components from dropdown
   - Add quantity for each component
   - Set expected return date
   - Add purpose/project description

4. Click "Record Borrowing"
5. **Check MongoDB**: 
   - Borrowing should be in `borrowings` collection
   - Component's `available` count should be reduced

### Step 6: Verify Borrowing in MongoDB
```bash
# Check borrowings
db.borrowings.find().pretty()

# Check component availability was updated
db.components.find({ name: "Arduino Uno R3" }).pretty()
# The 'available' field should be less than 'quantity'
```

### Step 7: Return a Component
1. In "Borrow & Return Management"
2. Find the active borrowing
3. Click "Mark Returned" button
4. **Check MongoDB**:
   - Borrowing status should change to "returned"
   - Component's `available` count should be restored

### Step 8: Verify Return in MongoDB
```bash
# Check borrowing status
db.borrowings.find({ status: "returned" }).pretty()

# Check component availability was restored
db.components.find({ name: "Arduino Uno R3" }).pretty()
# The 'available' field should be back to original quantity
```

## Database Collections

Your MongoDB database (`iot_inventory`) will have these collections:

1. **users** - All registered users (students and admins)
2. **components** - All hardware components
3. **borrowings** - All borrowing records
4. **actionlogs** - Activity logs (if implemented)

## Important Notes

### Component Availability Logic
- When adding a component: `available = quantity`
- When borrowing: `available -= borrowed_quantity`
- When returning: `available += borrowed_quantity`
- Available should never exceed total quantity

### User Requirements
- Users must be registered in the system before they can borrow
- Use the email to identify users when creating borrowings
- If user doesn't exist, you'll get an error

### Data Persistence
- All data is stored in MongoDB
- Nothing is hardcoded anymore
- Database starts empty - you add everything through the UI
- All changes are immediately saved to the database

## Troubleshooting

### "User not found" error when borrowing
- Make sure the email matches a registered user
- Register the user first through the login page

### Components not showing
- Check if backend is running
- Check MongoDB connection
- Check browser console for errors
- Verify token is in sessionStorage

### Changes not saving
- Check backend terminal for errors
- Verify MongoDB is running
- Check network tab in browser DevTools

## Environment Variables Required

Make sure your `backend/.env` file has:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/iot_inventory
JWT_SECRET=your_secret_key_here
```

## Success Indicators

✅ You can add components and see them in the UI immediately
✅ Components appear in MongoDB `components` collection
✅ You can borrow components (if user exists)
✅ Borrowing creates a record in MongoDB `borrowings` collection
✅ Component `available` count decreases when borrowed
✅ Component `available` count increases when returned
✅ All tabs (Active, Overdue, Returned) work correctly
✅ Search and filters work on both pages

---

**Your system is now fully functional with MongoDB persistence!**
Start by adding components, then test the borrowing flow.
