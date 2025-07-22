import React, { useContext, useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/authSlice';
import ActivityForm from './components/ActivityForm';
import ActivityDetail from './components/ActivityDetail';
import ActivityList from './components/ActivityList';
import './App.css';

const ActivitiesPage = () => (
  <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
    <ActivityForm onActivitiesAdded={() => {}} />
    <ActivityList />
  </Box>
);

// Component to conditionally show logout button
const ConditionalLogout = ({ handleLogout }) => {
  const location = useLocation();
  const isActivityDetailPage = location.pathname.startsWith('/activities/') && location.pathname !== '/activities';

  if (isActivityDetailPage) {
    return null; // Don't show logout button on activity detail pages
  }

  return (
    <Button
      variant="contained"
      sx={{ backgroundColor: 'red', color: 'white', marginTop: '10px' }}
      onClick={handleLogout}
    >
      LOGOUT
    </Button>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(true);

  useEffect(() => {
    if (token && tokenData) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
      setShowLoginPage(false);
    }
  }, [token, tokenData, dispatch]);

  const handleLogin = () => {
    setShowLoginPage(false);
    logIn();
  };

  const handleLogout = () => {
    logOut();
    setShowLoginPage(true);
  };

  // Show login page if not authenticated or if explicitly showing login
  if (!token || showLoginPage) {
    return (
      <Router>
        <div className="login-bg">
          <div className="login-overlay"></div>
          <div className="login-content">
            <div className="login-hero-circle">💪</div>
            <h1 className="login-title">Welcome to FitIQ</h1>
            <p className="login-subtitle">
              Track your progress. Crush your goals. Live healthier.
            </p>
            <Button 
              onClick={handleLogin} 
              className="login-btn" 
              variant="contained"
            >
              Get Started
            </Button>
          </div>
        </div>
      </Router>
    );
  }

  // Show authenticated app
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route
            path="/"
            element={<Navigate to="/activities" replace />}
          />
        </Routes>
        <ConditionalLogout handleLogout={handleLogout} />
      </div>
    </Router>
  );
}

export default App;
