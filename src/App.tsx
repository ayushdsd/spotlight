import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import RouteGuard from './components/RouteGuard';
import './App.css'

// Lazy load components for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const Jobs = lazy(() => import('./pages/Jobs'));
const PostJob = lazy(() => import('./pages/PostJob'));
const Profile = lazy(() => import('./pages/Profile'));
const Messages = lazy(() => import('./pages/Messages'));
const GigListings = lazy(() => import('./pages/GigListings'));
const GigDetail = lazy(() => import('./pages/GigDetail'));
const ArtistProfile = lazy(() => import('./pages/ArtistProfile'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Auth = lazy(() => import('./pages/Auth'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">Spotlight</div>
              <div className="mt-2">Loading...</div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/*" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <RouteGuard>
                  {({ user }) => user.role === 'recruiter' ? <RecruiterDashboard /> : <Dashboard />}
                </RouteGuard>
              }
            />
            
            {/* Artist Routes */}
            <Route
              path="/dashboard/jobs"
              element={
                <RouteGuard allowedRoles={['artist']}>
                  <Jobs />
                </RouteGuard>
              }
            />
            
            {/* Recruiter Routes */}
            <Route
              path="/dashboard/post-job"
              element={
                <RouteGuard allowedRoles={['recruiter']}>
                  <PostJob />
                </RouteGuard>
              }
            />
            
            {/* Common Routes */}
            <Route
              path="/dashboard/profile"
              element={
                <RouteGuard>
                  <Profile />
                </RouteGuard>
              }
            />
            <Route
              path="/dashboard/messages"
              element={
                <RouteGuard>
                  <Messages />
                </RouteGuard>
              }
            />
            <Route
              path="/dashboard/listings"
              element={
                <RouteGuard>
                  <GigListings />
                </RouteGuard>
              }
            />
            <Route
              path="/dashboard/listings/:id"
              element={
                <RouteGuard>
                  <GigDetail />
                </RouteGuard>
              }
            />
            <Route
              path="/artists/:id"
              element={
                <RouteGuard>
                  <ArtistProfile />
                </RouteGuard>
              }
            />
            <Route
              path="/pricing"
              element={
                <RouteGuard>
                  <Pricing />
                </RouteGuard>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
