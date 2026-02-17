import './Login.css';
import { useState } from 'react';
import { login, register, initiateGitHubLogin } from '../api';

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await register({ email, password, displayName });
      } else {
        result = await login({ email, password });
      }

      if (result.access_token) {
        localStorage.setItem('diary_token', result.access_token);
        if (typeof onLogin === 'function') {
          await onLogin(result.access_token);
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-book">
        <div className="book-cover">
          <h1 className="book-title">📖 My Personal Diary</h1>
          <p className="book-subtitle">Your thoughts, your memories, your story</p>

          <div className="login-content">
            <p className="welcome-text">{isSignUp ? 'Create Account' : 'Welcome back!'}</p>

            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
              />
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="oauth-divider">
              <span>or</span>
            </div>

            <button
              className="github-login-btn"
              type="button"
              onClick={initiateGitHubLogin}
            >
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Continue with GitHub
            </button>

            <div className="privacy-note">
              <p>🔒 Your diary is completely private</p>
              <p>Only you can read your entries</p>
            </div>

            <div className="divider">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline'}}
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </button>
            </div>
          </div>
        </div>

        <div className="book-spine"></div>
      </div>
    </div>
  );
}

export default Login;

