import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

// Common components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Layouts
import ArtistLayout from './layouts/ArtistLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Artist Pages (Creators of Performances)
import ArtistDashboard from './pages/artist/ArtistDashboard';
import UploadPerformance from './pages/artist/UploadPerformance';
import PerformancesList from './pages/artist/PerformancesList';
import AIAnalysisStatus from './pages/artist/AIAnalysisStatus';
import ArtistControlStudio from './pages/artist/ArtistControlStudio';
import ArtistAnalytics from './pages/artist/ArtistAnalytics';
import ArtistProfile from './pages/artist/ArtistProfile';
import ArtistSettings from './pages/artist/ArtistSettings';

// Audience Pages (Viewers of Performances)
import AudienceExperience from './pages/audience/AudienceExperience';
import VisualModeView from './pages/audience/VisualModeView';
import AudioModeView from './pages/audience/AudioModeView';
import HapticModeView from './pages/audience/HapticModeView';
import AudienceDashboard from './pages/audience/AudienceDashboard';
import AudienceSaved from './pages/audience/AudienceSaved';
import AudienceHistory from './pages/audience/AudienceHistory';
import AudienceProfile from './pages/audience/AudienceProfile';
import AudienceSettings from './pages/audience/AudienceSettings';

// Global Auth Guard — redirects any unauthenticated user to /login
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-[#07080C] flex items-center justify-center text-xs text-gray-500 font-mono">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Role-Based Access Guards (TWO ROLES ONLY: Artist & Audience)
const ArtistRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-[#07080C] flex items-center justify-center text-xs text-gray-500 font-mono">Loading artist studio...</div>;
  }
  if (!user) {
    return <Navigate to="/login?role=artist" replace />;
  }
  if (user.role !== 'artist') {
    // If audience tries to access artist studio, redirect to audience dashboard
    return <Navigate to="/audience/dashboard" replace />;
  }
  return children;
};

const AudienceRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-[#07080C] flex items-center justify-center text-xs text-gray-500 font-mono">Loading audience console...</div>;
  }
  if (!user) {
    return <Navigate to="/login?role=audience" replace />;
  }
  if (user.role !== 'audience') {
    // If artist tries to access audience private dashboard, redirect to artist dashboard
    return <Navigate to="/artist/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-[#07080C] text-gray-100 selection:bg-primary-500/30 selection:text-white">
            <Routes>
              {/* HOME — public, no login required */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <main className="flex-1"><LandingPage /></main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/how-it-works"
                element={
                  <RequireAuth>
                    <>
                      <Navbar />
                      <main className="flex-1"><HowItWorksPage /></main>
                      <Footer />
                    </>
                  </RequireAuth>
                }
              />
              <Route
                path="/features"
                element={
                  <RequireAuth>
                    <>
                      <Navbar />
                      <main className="flex-1"><FeaturesPage /></main>
                      <Footer />
                    </>
                  </RequireAuth>
                }
              />
              <Route
                path="/about"
                element={
                  <RequireAuth>
                    <>
                      <Navbar />
                      <main className="flex-1"><AboutPage /></main>
                      <Footer />
                    </>
                  </RequireAuth>
                }
              />

              {/* AUTHENTICATION ROUTES (TWO ROLES ONLY: Artist & Audience) */}
              <Route
                path="/login"
                element={
                  <>
                    <Navbar />
                    <main className="flex-1"><LoginPage /></main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/register"
                element={
                  <>
                    <Navbar />
                    <main className="flex-1"><RegisterPage /></main>
                    <Footer />
                  </>
                }
              />

              {/* PUBLIC GUEST AUDIENCE ACCESSIBILITY ROUTES (NO LOGIN REQUIRED FOR QR SCAN) */}
              <Route
                path="/experience/:slug"
                element={
                  <>
                    <Navbar />
                    <main className="flex-1"><AudienceExperience /></main>
                    <Footer />
                  </>
                }
              />
              <Route path="/experience/:slug/visual" element={<VisualModeView />} />
              <Route path="/experience/:slug/audio"  element={<AudioModeView />} />
              <Route path="/experience/:slug/haptic" element={<HapticModeView />} />

              {/* AUTHENTICATED AUDIENCE PRIVATE ROUTES */}
              <Route
                path="/audience/dashboard"
                element={
                  <AudienceRoute>
                    <Navbar />
                    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
                      <AudienceDashboard />
                    </main>
                    <Footer />
                  </AudienceRoute>
                }
              />
              <Route
                path="/audience/saved"
                element={
                  <AudienceRoute>
                    <Navbar />
                    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
                      <AudienceSaved />
                    </main>
                    <Footer />
                  </AudienceRoute>
                }
              />
              <Route
                path="/audience/history"
                element={
                  <AudienceRoute>
                    <Navbar />
                    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
                      <AudienceHistory />
                    </main>
                    <Footer />
                  </AudienceRoute>
                }
              />
              <Route
                path="/audience/profile"
                element={
                  <AudienceRoute>
                    <Navbar />
                    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
                      <AudienceProfile />
                    </main>
                    <Footer />
                  </AudienceRoute>
                }
              />
              <Route
                path="/audience/settings"
                element={
                  <AudienceRoute>
                    <Navbar />
                    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
                      <AudienceSettings />
                    </main>
                    <Footer />
                  </AudienceRoute>
                }
              />

              {/* ARTIST STUDIO WORKSPACE ROUTES (CREATORS OF PERFORMANCES) */}
              <Route
                path="/artist"
                element={
                  <ArtistRoute>
                    <ArtistLayout />
                  </ArtistRoute>
                }
              >
                <Route index element={<Navigate to="/artist/dashboard" replace />} />
                <Route path="dashboard" element={<ArtistDashboard />} />
                <Route path="upload" element={<UploadPerformance />} />
                <Route path="performances" element={<PerformancesList />} />
                <Route path="analysis/:id" element={<AIAnalysisStatus />} />
                <Route path="studio/:id" element={<ArtistControlStudio />} />
                <Route path="analytics" element={<ArtistAnalytics />} />
                <Route path="profile" element={<ArtistProfile />} />
                <Route path="settings" element={<ArtistSettings />} />
              </Route>

              {/* CATCH ALL */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AccessibilityProvider>
    </AuthProvider>
  );
}
