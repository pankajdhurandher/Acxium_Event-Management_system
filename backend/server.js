import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

/**
 * MIDDLEWARE SETUP
 */

// Parse incoming JSON requests
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default, restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

// Parse URL-encoded bodies (optional, for form data)
app.use(express.urlencoded({ extended: true }));

/**
 * ROUTES
 * Mount all application routes
 * Add more route imports here as your API grows
 */
app.use('/', routes);

// Authentication routes
app.use('/api/auth', authRoutes);

// Product routes
app.use('/api/products', productRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Request routes
app.use('/api/requests', requestRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

/**
 * ERROR HANDLING MIDDLEWARE
 * Add more middleware and error handlers here as needed
 */

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

/**
 * START SERVER
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║                                        ║
  ║  🚀 Server running on port ${PORT}      ║
  ║  📦 Environment: ${process.env.NODE_ENV || 'development'}    ║
  ║                                        ║
  ╚════════════════════════════════════════╝
  `);
});

export default app;
