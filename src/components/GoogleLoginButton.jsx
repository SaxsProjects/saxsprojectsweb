import React, { useState } from 'react';
import { ChromeIcon } from 'lucide-react';

const GOOGLE_CLIENT_ID = '424074914089-b6s5s0qdstmkrmh0l177qs8r60eiutia.apps.googleusercontent.com';

// Determine redirect URI based on environment
const getRedirectUri = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5173/callback';
  }
  return 'https://saxsprojects.co.za/callback';
};

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);

    const redirectUri = getRedirectUri();
    const scope = 'openid profile email';
    const responseType = 'code';

    // Construct Google OAuth URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope,
      access_type: 'offline',
      prompt: 'consent'
    }).toString()}`;

    // Redirect to Google OAuth
    window.location.href = googleAuthUrl;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ChromeIcon size={20} />
      <span className="font-medium text-gray-800">
        {isLoading ? 'Redirecting...' : 'Sign in with Google'}
      </span>
    </button>
  );
};

export default GoogleLoginButton;
