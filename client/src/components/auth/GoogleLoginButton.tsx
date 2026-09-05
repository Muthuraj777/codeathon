import React, { useState } from 'react';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface GoogleLoginButtonProps {
  label?: string;
  onSuccess?: () => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  label = 'Sign in with Google',
  onSuccess,
}) => {
  const { googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFirebaseGoogleLogin = async () => {
    setIsFirebaseLoading(true);
    setErrorMsg(null);

    try {
      // 1. Trigger Firebase Google Popup Sign In
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. Obtain Firebase ID Token
      const idToken = await user.getIdToken();

      if (idToken) {
        // 3. Authenticate with backend
        const success = await googleLogin(idToken);
        if (success) {
          if (onSuccess) onSuccess();
          else navigate('/dashboard');
        }
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        console.info('Google sign-in popup closed by user.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        console.info('Google sign-in popup cancelled.');
      } else if (err?.code === 'auth/configuration-not-found') {
        console.error('Firebase Auth Error: Google Sign-in provider is not enabled in Firebase Console.');
        setErrorMsg('Google Sign-In is not enabled under Firebase Console > Authentication > Sign-in method.');
      } else if (err?.code === 'auth/internal-error' || err?.message?.includes('ERR_NAME_NOT_RESOLVED')) {
        console.error('Firebase Auth Error: Unable to resolve apis.google.com network script.');
        setErrorMsg('Unable to connect to Google Auth servers (DNS/AdBlocker restriction). Please use demo login.');
      } else if (err?.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectErr) {
          setErrorMsg('Popup was blocked by browser extension. Please allow popups or use demo login.');
        }
      } else {
        console.error('Firebase Google Auth error:', err);
        setErrorMsg('Google Sign-In error. Ensure Google provider is enabled in Firebase Console.');
      }
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-1">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-white text-slate-700 hover:bg-slate-50 border-slate-300 font-semibold text-xs h-10 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        onClick={handleFirebaseGoogleLogin}
        isLoading={isFirebaseLoading}
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

      {errorMsg && <p className="text-rose-400 text-xs mt-1.5 text-center font-medium">{errorMsg}</p>}
    </div>
  );
};
