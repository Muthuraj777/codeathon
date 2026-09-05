import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { User, Globe, X } from 'lucide-react';

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { googleLogin, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const accounts = [
    {
      name: 'Manimaran Ravi',
      email: 'manimaranravi2004@gmail.com',
      avatarColor: 'bg-emerald-600',
      initial: 'M',
    },
    {
      name: 'Kishore Kumar',
      email: 'kishoreananthan1795@gmail.com',
      avatarColor: 'bg-emerald-700',
      initial: 'K',
    },
    {
      name: 'Kishore Kumar',
      email: '2kkishore17@gmail.com',
      avatarColor: 'bg-indigo-600',
      initial: 'K',
    },
  ];

  const handleSelectAccount = async (email: string, name: string) => {
    const base64UrlEncode = (obj: object) => {
      const json = JSON.stringify(obj);
      return btoa(json).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };

    const header = base64UrlEncode({ alg: 'RS256', typ: 'JWT' });
    const payload = base64UrlEncode({
      iss: 'https://accounts.google.com',
      azp: 'google-client-id',
      aud: 'google-client-id',
      sub: `google-oauth-${Math.floor(100000000 + Math.random() * 900000000)}`,
      email,
      email_verified: true,
      name,
      picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const mockToken = `${header}.${payload}.mockSignature`;

    const success = await googleLogin(mockToken);
    if (success) {
      onClose();
      if (onSuccess) onSuccess();
      else navigate('/dashboard');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const email = customEmail.trim().toLowerCase();
    const name = email.split('@')[0];
    handleSelectAccount(email, name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Google Accounts Window Box */}
      <div className="bg-[#121316] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-[440px] overflow-hidden flex flex-col font-sans animate-in zoom-in-95 duration-150">
        {/* Mock Browser Header Bar */}
        <div className="bg-[#1e1f23] px-4 py-2 flex items-center justify-between border-b border-slate-800/80 text-slate-400 text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
            <span className="truncate">accounts.google.com/v3/signin/accountchooser</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span className="text-sm font-semibold text-slate-300">Sign in with Google</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-normal text-white tracking-tight">Choose an account</h2>
              <p className="text-xs text-slate-400">
                to continue to <strong className="text-indigo-400 font-semibold">skill_gap_analyzer</strong>
              </p>
            </div>
          </div>

          {/* Account Chooser List */}
          {!showCustomInput ? (
            <div className="space-y-1 divide-y divide-slate-800/60 rounded-xl overflow-hidden bg-[#181a1f] border border-slate-800">
              {accounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleSelectAccount(acc.email, acc.name)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3.5 p-3.5 hover:bg-[#22252c] transition text-left cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 rounded-full ${acc.avatarColor} text-white font-semibold text-sm flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    {acc.initial}
                  </div>
                  <div className="flex-1 min-w-0 leading-snug">
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                      {acc.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{acc.email}</div>
                  </div>
                </button>
              ))}

              {/* Use Another Account Option */}
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full flex items-center gap-3.5 p-3.5 hover:bg-[#22252c] transition text-left cursor-pointer text-slate-300 hover:text-white"
              >
                <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold">Use another account</div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Enter your Google Email address
                </label>
                <input
                  type="email"
                  placeholder="e.g. manimaranravi2004@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181a1f] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition"
                >
                  Continue
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 bg-[#181a1f] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>English (United States)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:underline cursor-pointer">Help</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
