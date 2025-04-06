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
import paymentRoutes from './routes/payment.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',  // Local development
  'https://spotlightcast.vercel.app', // Production frontend
  'https://spotlight-app.vercel.app', // Alternative production frontend
  process.env.CORS_ORIGIN, // Dynamic origin from environment
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Security headers
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

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
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Spotlight API is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
