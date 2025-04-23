import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthRoute from './routes/AuthRoute';
import OnboardingPage from './pages/onboarding/OnboardingPage';

// Import auth components
import AuthPage from './pages/auth/AuthPage';

// Import main app components (to be implemented later)
const Dashboard = () => <div>Dashboard (placeholder)</div>;
const OutagesPage = () => <div>Outages (placeholder)</div>;
const LocationsPage = () => <div>Locations (placeholder)</div>;

/**
 * Main application component
 * Sets up routing and context providers
 */
function App() {
  return (
    <OnboardingProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Routes that require authentication */}
            <Route element={<AuthRoute />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/outages" element={<OutagesPage />} />
                <Route path="/locations" element={<LocationsPage />} />
              </Route>
            </Route>
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </OnboardingProvider>
  );
}

export default App;