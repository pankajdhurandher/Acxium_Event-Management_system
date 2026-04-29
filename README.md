# Express MongoDB API Server

A basic Node.js Express server with MongoDB connection using Mongoose.

## Project Structure

```
.
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   └── indexController.js # Request handlers
├── routes/
│   └── index.js           # API routes
├── models/                # Database models (add here)
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Installation

1. **Clone/Download the project** and navigate to the directory

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update MongoDB URI if needed

4. **Ensure MongoDB is running**
   ```bash
   # If using local MongoDB
   mongod
   ```

## Running the Server

**Development mode (with auto-reload)**
```bash
npm run dev
```

**Production mode**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Test Routes
- `GET /` - Returns "API Running"
- `GET /health` - Health check endpoint

## Adding Routes

To add new routes:

1. **Create a controller** in `controllers/` (e.g., `userController.js`)
   ```javascript
   export const getUsers = (req, res) => {
     res.json({ users: [] });
   };
   ```

2. **Create a route file** in `routes/` (e.g., `userRoutes.js`)
   ```javascript
   import express from 'express';
   import { getUsers } from '../controllers/userController.js';
   
   const router = express.Router();
   router.get('/', getUsers);
   
   export default router;
   ```

3. **Import and mount in** `server.js`
   ```javascript
   import userRoutes from './routes/userRoutes.js';
   app.use('/api/users', userRoutes);
   ```

## Adding Models

Create Mongoose schemas in `models/` directory:

```javascript
// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment |
| MONGODB_URI | mongodb://localhost:27017/acxium_db | MongoDB connection string |
| CORS_ORIGIN | * | CORS allowed origin |

## Technologies

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variables
- **Nodemon** - Development auto-reload

## License

ISC
