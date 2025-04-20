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
const Feed = lazy(() => import('./pages/Feed'));

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
            
            {/* Artist Routes */}
            <Route
              path="/artist/dashboard/*"
              element={
                <RouteGuard allowedRoles={['artist']}>
                  <Dashboard />
                </RouteGuard>
              }
            />
            <Route
              path="/artist/jobs"
              element={
                <RouteGuard allowedRoles={['artist']}>
                  <Jobs />
                </RouteGuard>
              }
            />
            <Route
              path="/artist/profile"
              element={
                <RouteGuard allowedRoles={['artist']}>
                  <Profile />
                </RouteGuard>
              }
            />
            <Route
              path="/artist/messages"
              element={
                <RouteGuard allowedRoles={['artist']}>
                  <Messages />
                </RouteGuard>
              }
            />

            {/* Recruiter Routes */}
            <Route
              path="/recruiter/dashboard/*"
              element={
                <RouteGuard allowedRoles={['recruiter']}>
                  <RecruiterDashboard />
                </RouteGuard>
              }
            />
            <Route
              path="/recruiter/post-job"
              element={
                <RouteGuard allowedRoles={['recruiter']}>
                  <PostJob />
                </RouteGuard>
              }
            />
            <Route
              path="/recruiter/messages"
              element={
                <RouteGuard allowedRoles={['recruiter']}>
                  <Messages />
                </RouteGuard>
              }
            />

            {/* Common Routes */}
            <Route path="/feed" element={<Feed />} />
            <Route path="/gigs" element={<GigListings />} />
            <Route path="/gigs/:id" element={<GigDetail />} />
            <Route path="/artists/:id" element={<ArtistProfile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
