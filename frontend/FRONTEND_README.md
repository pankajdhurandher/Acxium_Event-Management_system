# Event Management System - React Frontend

A modern React frontend for the MERN Event Management System with role-based dashboards.

## 📋 Features

- **Role-Based Authentication**: Support for User, Vendor, and Admin roles
- **Responsive Design**: Mobile-friendly UI that works on all devices
- **Protected Routes**: Route protection based on user authentication and role
- **Modern UI**: Clean, professional interface with smooth animations
- **Dashboard Pages**: Separate dashboards for each user role

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components (Login, Signup, Dashboards)
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── UserDashboard.jsx
│   ├── VendorDashboard.jsx
│   └── AdminDashboard.jsx
├── services/         # API services and utilities
├── context/          # React Context for state management
├── styles/           # CSS stylesheets
│   ├── Auth.css      # Authentication pages styles
│   └── Dashboard.css # Dashboard pages styles
├── App.jsx           # Main application component with routing
├── App.css           # Global application styles
├── index.css         # Global index styles
└── main.jsx          # Application entry point
```

## 🛣️ Routes

### Public Routes
- `/` - Login page
- `/signup` - Signup page

### Protected Routes (Require Authentication)
- `/user` - User Dashboard (Role: user)
- `/vendor` - Vendor Dashboard (Role: vendor)
- `/admin` - Admin Dashboard (Role: admin)

## 🔐 Authentication

The authentication system uses:
- **localStorage** to store user information and auth token
- **ProtectedRoute** component to restrict access based on authentication and role
- **Mock authentication** (placeholder - replace with actual API calls)

### Authentication Flow

1. User enters credentials on Login page
2. Form validates input
3. User role is selected (User, Vendor, or Admin)
4. User info and token are stored in localStorage
5. User is redirected to their respective dashboard

### Update API Calls

Replace mock authentication with actual API calls in:
- `src/pages/Login.jsx` (line ~44)
- `src/pages/Signup.jsx` (line ~65)

## 🎨 Styling

The app uses:
- **CSS Modules**: Individual CSS files for different components
- **Responsive Design**: Mobile-first approach using media queries
- **Modern Gradients**: Gradient backgrounds for visual appeal
- **Smooth Animations**: Fade-in and slide-up animations for smooth UX

### Color Palette

- **Primary**: `#667eea` (Purple)
- **Primary Dark**: `#764ba2` (Dark Purple)
- **Secondary**: `#f093fb` (Pink)
- **Background**: `#f5f7fa` (Light Gray)
- **Text**: `#333333` (Dark Gray)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🎯 Next Steps

1. **Connect to Backend API**
   - Replace mock authentication with actual API calls
   - Update API endpoints in `src/services/`

2. **Add State Management**
   - Implement Redux or Context API for global state
   - Create stores in `src/context/`

3. **Create Additional Components**
   - Add reusable components in `src/components/`
   - Build feature-specific pages

4. **Add Protected Features**
   - Implement actual dashboard functionality
   - Add data fetching and display

5. **Error Handling**
   - Add error boundaries
   - Implement user-friendly error messages

## 🛠️ Technologies Used

- **React**: UI library
- **React Router**: Routing and navigation
- **Vite**: Fast build tool and dev server
- **CSS3**: Styling and animations
- **JavaScript ES6+**: Modern JavaScript features

## 📝 Comments and Documentation

All components include:
- File-level documentation explaining purpose
- Inline comments for complex logic
- JSDoc comments for functions and components

## 🐛 Troubleshooting

### Routes Not Working?
- Ensure `BrowserRouter` wraps your route definitions
- Check that `react-router-dom` is installed

### Styles Not Loading?
- Verify CSS import paths are correct
- Check browser dev tools for CSS errors

### LocalStorage Not Persisting?
- Ensure browser allows localStorage
- Check browser privacy settings

## 📄 License

This project is part of the Acxium Event Management System.

## 🤝 Contributing

When adding new features:
1. Create components in `src/components/`
2. Add styles in `src/styles/`
3. Update `src/App.jsx` if adding new routes
4. Add comments explaining the code structure

---

For backend integration details, refer to the main project README.
