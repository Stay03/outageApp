import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthRoute from './routes/AuthRoute';
import LocationRoute from './routes/LocationRoute';
import OnboardingPage from './pages/onboarding/OnboardingPage';

// Import auth components
import AuthPage from './pages/auth/AuthPage';

// Import location components
import AddLocationPage from './pages/locations/AddLocationPage';
const LocationsPage = () => <div>Locations (placeholder)</div>;

// Import main app components (to be implemented later)
const Dashboard = () => <div>Dashboard (placeholder)</div>;
const OutagesPage = () => <div>Outages (placeholder)</div>;

/**
 * Main application component
 * Sets up routing and context providers
 */
function App() {
  return (
    <OnboardingProvider>
      <AuthProvider>
        <LocationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Location setup route */}
              <Route path="/locations/add" element={<AddLocationPage />} />
              
              {/* Routes that require authentication */}
              <Route element={<AuthRoute />}>
                {/* Routes that require location */}
                <Route element={<LocationRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/outages" element={<OutagesPage />} />
                  <Route path="/locations" element={<LocationsPage />} />
                </Route>
              </Route>
              
              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/onboarding" replace />} />
            </Routes>
          </BrowserRouter>
        </LocationProvider>
      </AuthProvider>
    </OnboardingProvider>
  );
}

export default App;