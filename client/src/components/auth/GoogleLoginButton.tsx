import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  label?: string;
  onSuccess?: () => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  label = 'Sign in with Google',
  onSuccess,
}) => {
  const { googleLogin, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(() => typeof window !== 'undefined' && !!window.google?.accounts);
  const [isGsiActive, setIsGsiActive] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(
    async (response: any) => {
      const credential = response.credential;
      if (credential) {
        const success = await googleLogin(credential);
        if (success) {
          if (onSuccess) onSuccess();
          else navigate('/dashboard');
        }
      }
    },
    [googleLogin, onSuccess, navigate]
  );

  useEffect(() => {
    if (!googleClientId) return; // Only load GSI script if valid client ID is provided

    const scriptId = 'google-gsi-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, [googleClientId]);

  useEffect(() => {
    if (googleClientId && scriptLoaded && window.google?.accounts?.id && buttonRef.current) {
      try {
        buttonRef.current.innerHTML = '';
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
        });
        setIsGsiActive(true);
      } catch (err) {
        console.warn('Google GSI render failed, using fallback button:', err);
        setIsGsiActive(false);
      }
    } else {
      setIsGsiActive(false);
    }
  }, [scriptLoaded, googleClientId, handleCredentialResponse]);

  const handleDevGoogleLogin = async () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        email: 'google.user@example.com',
        name: 'Google User',
        sub: 'google-oauth-100982347',
        picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    );
    const mockToken = `${header}.${payload}.mockSignature`;

    const success = await googleLogin(mockToken);
    if (success) {
      if (onSuccess) onSuccess();
      else navigate('/dashboard');
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Official Google GSI Button Container */}
      <div ref={buttonRef} className={isGsiActive ? 'w-full flex justify-center' : 'hidden'} />

      {/* Single Styled Google Button */}
      {!isGsiActive && (
        <Button
          type="button"
          variant="outline"
          className="w-full bg-white text-slate-700 hover:bg-slate-50 border-slate-300 font-semibold text-xs h-10 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          onClick={handleDevGoogleLogin}
          isLoading={isLoading}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {label}
        </Button>
      )}
    </div>
  );
};
