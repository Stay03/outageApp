import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import ProtectedRoute from './routes/ProtectedRoute';
import OnboardingPage from './pages/onboarding/OnboardingPage';

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
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          {/* Protected routes - require completed onboarding */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/outages" element={<OutagesPage />} />
            <Route path="/locations" element={<LocationsPage />} />
          </Route>
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </BrowserRouter>
    </OnboardingProvider>
  );
}

export default App;