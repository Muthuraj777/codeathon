import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

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
  onSuccess,
}) => {
  const { googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(() => typeof window !== 'undefined' && !!window.google?.accounts);

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
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
        });
      } catch (err) {
        console.warn('Google GSI render failed:', err);
      }
    }
  }, [scriptLoaded, googleClientId, handleCredentialResponse]);

  return (
    <div className="w-full flex justify-center min-h-[40px] overflow-hidden rounded-lg">
      <div ref={buttonRef} className="w-full flex justify-center" />
    </div>
  );
};
