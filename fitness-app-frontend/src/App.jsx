import { Button, Box, AccordionDetails } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/authSlice';
import ActivityForm from './components/ActivityForm';
import ActivityDetail from './components/ActivityDetail';
import ActivityList from './components/ActivityList';

const ActivitiesPage = () => {
  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      <ActivityForm onActivitiesAdded={() => {/* Do nothing or show success message */}} />
      <ActivityList />
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token && tokenData) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  const handleLogin = () => {
    logIn();
  };

  const handleLogout = () => {
    logOut();
  };

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        {!token ? (
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white' }}
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        ) : (
          <div>
            <div>
              {/* <pre> */}
                {/* {JSON.stringify(tokenData, null, 2)} */}
              {/* </pre> */}
              <Routes>
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/activities/:id" element={<ActivityDetail/>} />
                <Route path="/" element={token ? <Navigate to="/activities" replace/> : <div>Welcome! please login</div>} />
              </Routes>
            </div>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'red', color: 'white', marginTop: '10px' }}
              onClick={handleLogout}
            >
              LOGOUT
            </Button>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;