# Authentication Implementation Guide

## Overview
This document explains the complete authentication system implementation for the Event Management System, including signup, login, and role-based navigation.

---

## Architecture

### Frontend Components

#### 1. **Login Page** (`src/pages/Login.jsx`)
- **Purpose**: User authentication
- **Form Fields**:
  - Email (required, email format validation)
  - Password (required)
- **Validation**: 
  - Non-empty fields
  - Valid email format
- **Flow**:
  1. User enters email and password
  2. Form validates input
  3. Calls `authService.login()` with credentials
  4. On success: Stores session in localStorage and redirects based on user role
  5. On error: Displays error message
- **Loading State**: Shows "Logging in..." during API call

#### 2. **Signup Page** (`src/pages/Signup.jsx`)
- **Purpose**: User registration
- **Form Fields**:
  - Full Name (required, non-empty)
  - Email (required, email format validation)
  - Password (required, minimum 6 characters)
  - Confirm Password (required, must match)
  - Role Dropdown (user, vendor)
- **Validation**:
  - All fields required
  - Valid email format
  - Password minimum 6 characters
  - Password confirmation match
- **Flow**:
  1. User fills all form fields
  2. Form validates input
  3. Calls `authService.signup()` with user data
  4. On success: Stores session in localStorage and redirects to appropriate dashboard
  5. On error: Displays error message
- **Loading State**: Shows "Creating Account..." during API call

#### 3. **Auth Service** (`src/services/authService.js`)
Complete service module with the following functions:

```javascript
// Signup function
signup(userData) 
  // Input: { name, email, password, role }
  // Returns: { success, user, token, message, error }

// Login function
login(credentials)
  // Input: { email, password }
  // Returns: { success, user, role, token, message, error }

// Session management
saveSession(token, user)        // Stores in localStorage
getSession()                     // Retrieves from localStorage
clearSession()                   // Removes from localStorage
isAuthenticated()                // Checks if user is logged in
getCurrentUser()                 // Gets current user object
```

#### 4. **Protected Routes** (`src/App.jsx`)
- Routes `/user`, `/vendor`, `/admin` are protected
- Redirects to login if user is not authenticated or lacks required role
- Automatically routes users to their dashboard on login:
  - Admin → `/admin`
  - Vendor → `/vendor`
  - User → `/user`

---

## Backend API Endpoints

### POST `/api/auth/signup`
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Error Response (400/500)**:
```json
{
  "success": false,
  "message": "Error description"
}
```

### POST `/api/auth/login`
**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "_id": "user_id",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

---

## localStorage Structure

After successful login/signup, the following is stored:

```javascript
// Token storage
localStorage.setItem('token', 'jwt_token_here');

// User object storage
localStorage.setItem('user', JSON.stringify({
  _id: 'user_id',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
}));
```

---

## File Structure

```
frontend/src/
├── pages/
│   ├── Login.jsx          ← Login page component
│   ├── Signup.jsx         ← Signup page component
│   ├── UserDashboard.jsx  ← User dashboard (protected)
│   ├── VendorDashboard.jsx← Vendor dashboard (protected)
│   └── AdminDashboard.jsx ← Admin dashboard (protected)
├── services/
│   ├── authService.js     ← Authentication API service
│   └── api.js             ← General API service
├── styles/
│   ├── Auth.css           ← Auth pages styling
│   └── Dashboard.css      ← Dashboard styling
├── context/
│   └── AuthContext.jsx    ← Global auth state (optional)
└── App.jsx                ← Main app with routes

controllers/
└── authController.js      ← Backend auth logic

routes/
└── authRoutes.js          ← Backend auth routes

models/
└── User.js                ← User database model
```

---

## Testing the Implementation

### 1. **Test Signup**
1. Navigate to `http://localhost:3000/signup`
2. Fill in all fields:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
   - Role: "User"
3. Click "Sign Up"
4. **Expected**: 
   - Success message appears
   - Redirected to `/user` (user dashboard)
   - Token and user stored in localStorage

### 2. **Test Login**
1. Navigate to `http://localhost:3000/` (Login page)
2. Enter credentials:
   - Email: "john@example.com"
   - Password: "password123"
3. Click "Login"
4. **Expected**:
   - Redirected to appropriate dashboard based on role
   - Token and user stored in localStorage

### 3. **Test Validation**
1. **Empty Fields**: Try submitting without filling fields → Error message
2. **Invalid Email**: Enter "notanemail" → Error: "Please enter a valid email address"
3. **Short Password**: Enter password < 6 chars → Error: "Password must be at least 6 characters"
4. **Password Mismatch**: Confirm password differs → Error: "Passwords do not match"

### 4. **Test Protected Routes**
1. Clear localStorage: `localStorage.clear()` in browser console
2. Navigate to `http://localhost:3000/user`
3. **Expected**: Redirected to login page
4. Login successfully
5. **Expected**: Can access `/user`, `/vendor` (if vendor), `/admin` (if admin)

### 5. **Test Logout**
1. From any dashboard, click "Logout" button
2. **Expected**:
   - localStorage cleared
   - Redirected to login page
   - Cannot access protected routes without logging in again

---

## Environment Configuration

### Frontend (`.env` or in `authService.js`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (`server.js` or `.env`)
```
BACKEND_PORT=5000
DATABASE_URL=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## Error Handling

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Email already exists" | Account with email exists | Use different email |
| "Invalid credentials" | Wrong email or password | Check email/password |
| "Password must be at least 6 characters" | Password too short | Use minimum 6 characters |
| "Please enter a valid email address" | Invalid email format | Use valid format (e.g., user@domain.com) |
| "Connection failed" | Backend not running | Start backend server |

---

## Security Notes

⚠️ **Important Security Reminders**:

1. **Token Expiration**: Consider implementing JWT token expiration
2. **HTTPS**: Use HTTPS in production
3. **Password Hashing**: Backend should hash passwords (bcrypt)
4. **CORS**: Configure CORS properly for production
5. **Input Sanitization**: Sanitize inputs on both frontend and backend
6. **Token Refresh**: Implement token refresh mechanism
7. **XSS Protection**: Ensure React's built-in XSS protection is enabled

---

## Features Implemented

✅ **Signup Page**
- Form with name, email, password, confirm password, role dropdown
- Email format validation
- Password strength validation (minimum 6 characters)
- Password confirmation matching
- Loading state during API call
- Error and success messages
- Link to login page

✅ **Login Page**
- Form with email and password
- Email format validation
- Loading state during API call
- Error messages
- Role-based navigation to dashboards
- Link to signup page

✅ **Auth Service**
- Signup API integration
- Login API integration
- Session management (save, get, clear)
- Authentication checking
- Current user retrieval
- Comprehensive comments and documentation

✅ **Protected Routes**
- Role-based access control
- Automatic redirection to login
- Dashboard-specific protection

✅ **UI/UX**
- Modern, clean design with gradient background
- Responsive layout
- Form validation feedback
- Loading indicators
- Success/error message display
- Smooth animations

---

## Next Steps

Consider implementing:

1. **Password Reset**: Add forgot password functionality
2. **Email Verification**: Verify email before account activation
3. **OAuth Integration**: Add Google/GitHub login
4. **Two-Factor Authentication**: Add 2FA for security
5. **Token Refresh**: Auto-refresh JWT tokens
6. **Rate Limiting**: Prevent brute force attacks
7. **User Profile**: Edit profile functionality
8. **Session Management**: Multiple device login/logout

---

## Support & Debugging

### Debugging Tips

1. **Check Console**: Open browser DevTools → Console for error messages
2. **Network Tab**: Check API requests/responses in Network tab
3. **localStorage**: Inspect stored data: `localStorage.getItem('user')`
4. **Backend Logs**: Check terminal where backend server is running

### Common Issues

| Issue | Debug | Fix |
|-------|-------|-----|
| Blank login page | Check Routes in App.jsx | Verify path="/" |
| API 404 errors | Check console Network tab | Verify backend URL |
| Redirect not working | Check localStorage | Ensure token is saved |
| Always redirects to login | Check user role in localStorage | Verify role in response |

---

Generated: April 2026
Version: 1.0
