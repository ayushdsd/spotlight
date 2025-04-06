import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import userRoutes from './routes/user.routes';
import messageRoutes from './routes/message.routes';
import portfolioRoutes from './routes/portfolio.routes';
import searchRoutes from './routes/search.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app: Application = express();
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',  // Local development
  'https://spotlight-app.vercel.app', // Production frontend
  process.env.CORS_ORIGIN, // Dynamic origin from environment
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spotlight')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
