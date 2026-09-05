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
          prompt: (notification?: any) => void;
        };
      };
    };
  }
}

const DEFAULT_GOOGLE_CLIENT_ID = '1037970145497-fs1i7gvdm8gl6iffa2161ed2dnmsrp54.apps.googleusercontent.com';

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
  const [gsiRendered, setGsiRendered] = useState(false);

  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const googleClientId = (rawClientId ? String(rawClientId).replace(/^["']|["']$/g, '').trim() : '') || DEFAULT_GOOGLE_CLIENT_ID;

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

  // Check URL hash for real Google OAuth redirect response (#id_token=...)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('id_token=')) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const idToken = params.get('id_token');
      if (idToken) {
        if (window.opener) {
          try {
            window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', idToken }, window.location.origin);
          } catch (e) {
            console.warn('Failed to postMessage to opener:', e);
          }
          window.close();
          return;
        }

        googleLogin(idToken).then((success) => {
          if (success) {
            window.history.replaceState(null, '', window.location.pathname);
            if (onSuccess) onSuccess();
            else navigate('/dashboard');
          }
        });
      }
    }
  }, [googleLogin, navigate, onSuccess]);

  // Listen for real Google OAuth postMessage from popup window
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.idToken) {
        const success = await googleLogin(event.data.idToken);
        if (success) {
          if (onSuccess) onSuccess();
          else navigate('/dashboard');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [googleLogin, navigate, onSuccess]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (googleClientId && scriptLoaded && window.google?.accounts?.id && buttonRef.current) {
      try {
        buttonRef.current.innerHTML = '';
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '280',
          text: 'continue_with',
          shape: 'rectangular',
        });
        setGsiRendered(true);
      } catch (err) {
        console.warn('Google GSI render failed:', err);
        setGsiRendered(false);
      }
    }
  }, [scriptLoaded, googleClientId, handleCredentialResponse]);

  const handleRealGoogleOAuth = () => {
    if (window.google?.accounts?.id && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.prompt();
        return;
      } catch (e) {
        console.warn('Google GSI prompt failed:', e);
      }
    }

    // Launch Real Google OAuth 2.0 Account Selector Popup Window
    if (googleClientId) {
      const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      const params = new URLSearchParams({
        client_id: googleClientId,
        redirect_uri: window.location.origin + '/login',
        response_type: 'id_token',
        scope: 'openid email profile',
        nonce: Math.random().toString(36).substring(2),
      });

      window.open(
        `${oauth2Endpoint}?${params.toString()}`,
        'GoogleOAuthPopup',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
      );
    }
  };

  return (
    <div className="w-full flex justify-center relative min-h-[40px] my-1">
      {/* Official Google GSI Button Container */}
      <div ref={buttonRef} className={`w-full flex justify-center ${gsiRendered ? 'block' : 'hidden'}`} />

      {/* Styled Real Google Button (Shown if GSI script is loading) */}
      {!gsiRendered && (
        <Button
          type="button"
          variant="outline"
          className="w-full bg-white text-slate-700 hover:bg-slate-50 border-slate-300 font-semibold text-xs h-10 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          onClick={handleRealGoogleOAuth}
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
