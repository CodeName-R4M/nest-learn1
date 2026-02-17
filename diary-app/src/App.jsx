import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { setAuthToken, getMe } from './api';
import Login from './components/Login';
import DiaryApp from './components/DiaryApp';
import AuthCallback from './components/AuthCallback';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('diary_token');
      if (token) {
        setAuthToken(token);
        try {
          const me = await getMe();
          setUser(me);
        } catch (e) {
          setAuthToken(null);
          localStorage.removeItem('diary_token');
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleLogout = async () => {
    setAuthToken(null);
    localStorage.removeItem('diary_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogin = async (token) => {
    if (!token) return;
    try {
      setAuthToken(token);
      const me = await getMe();
      setUser(me);
    } catch (e) {
      setAuthToken(null);
      localStorage.removeItem('diary_token');
      alert('Authentication failed');
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : (
              <DiaryApp user={user} onLogout={handleLogout} />
            )
          }
        />
        <Route
          path="/auth/callback"
          element={<AuthCallback onLogin={handleLogin} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

