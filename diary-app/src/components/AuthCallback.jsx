import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthCallback({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code) {
        setError('No authorization code received');
        return;
      }
 
      try {
        // Exchange code for token via backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/callback?code=${code}&state=${state}`);
        
        if (!response.ok) {
          throw new Error(`Auth callback failed: ${response.statusText}`);
        }

        const data = await response.json();
        const token = data.access_token;

        if (token) {
          localStorage.setItem('diary_token', token);

          if (typeof onLogin === 'function') {
            await onLogin(token);
          }

          // Redirect to main app
          navigate('/');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate, onLogin]);

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Processing authentication...</h2>
      <p>Please wait while we complete your sign-in.</p>
    </div>
  );
}

export default AuthCallback;
