import { useEffect, useState } from 'react';

const OAuthCallback = () => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get tokens from URL (backend already exchanged the code)
        const params = new URLSearchParams(window.location.search);
        const access_token = params.get('access_token');
        const id_token = params.get('id_token');
        const refresh_token = params.get('refresh_token');
        const email = params.get('email');
        const name = params.get('name');
        const errorParam = params.get('error');

        if (errorParam) {
          throw new Error(`Google OAuth Error: ${errorParam}`);
        }

        if (!access_token || !id_token) {
          throw new Error('No authentication tokens received from backend');
        }

        // Store tokens and user info in localStorage
        localStorage.setItem('authToken', id_token);
        localStorage.setItem('accessToken', access_token);
        if (refresh_token) {
          localStorage.setItem('refreshToken', refresh_token);
        }
        
        // Store user info
        const user = {
          email: decodeURIComponent(email),
          name: decodeURIComponent(name)
        };
        localStorage.setItem('user', JSON.stringify(user));

        console.log('✅ OAuth Login Successful!', user);

        // Redirect to home page
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } catch (err) {
        console.error('OAuth Callback Error:', err);
        setError(err.message || 'Authentication failed. Please try again.');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Signing you in...</h1>
          <p className="text-gray-600">Please wait while we verify your Google account.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
