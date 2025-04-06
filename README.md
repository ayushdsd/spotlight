# Spotlight - Artist Portfolio Platform

Spotlight is a modern web application that helps artists showcase their work and connect with recruiters. Built with React, TypeScript, Node.js, and MongoDB.

## Features

- User authentication (Artist/Recruiter roles)
- Profile management with portfolio showcase
- Image upload with Cloudinary integration
- Real-time messaging between artists and recruiters
- Search functionality for artists and portfolios
- Responsive design for all devices

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Socket.io for real-time messaging

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ayushdsd/spotlight.git
cd spotlight
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Set up environment variables:
- Create `.env` in the server directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from root directory)
npm run dev
```

5. Open http://localhost:5173 in your browser

## Deployment

The application is deployed using:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Image Storage: Cloudinary

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
