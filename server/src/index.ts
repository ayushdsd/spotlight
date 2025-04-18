import express, { Request, Response, NextFunction, Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { cloudinaryConfig } from './utils/cloudinary';

// Import routes
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import messageRoutes from './routes/message.routes';
import userRoutes from './routes/user.routes';
import searchRoutes from './routes/search.routes';
import portfolioRoutes from './routes/portfolio.routes';
import jobRoutes from './routes/job.routes';
import feedRoutes from './routes/feed';
// import feedRoutes from './routes/feed.routes';

// Load environment variables
dotenv.config({ path: '.env' });

// Debug environment variables
console.log('Environment variables loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
});

// Create Express app
const app: Application = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://spotlightcast.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary configuration
cloudinaryConfig();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spotlight')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/feed', feedRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Express configuration
app.set('port', process.env.PORT || 5000);

// Start server
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
