import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../validations/authValidation';
import { useAuthStore } from '../stores/useAuthStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { LogIn, GraduationCap, Sparkles, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = async (role: 'student' | 'employee' | 'admin') => {
    const credentialsMap = {
      student: { email: 'student@example.com', password: 'password123' },
      employee: { email: 'employee@example.com', password: 'password123' },
      admin: { email: 'admin@example.com', password: 'password123' },
    };
    const success = await login(credentialsMap[role]);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-in fade-in duration-300">
        {/* Logo & Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-1">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Skill Gap <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Analyzer</span>
          </h1>
          <p className="text-xs text-slate-400 font-light flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Enterprise Talent & Competency Assessment Platform
          </p>
        </div>

        {/* Card Form */}
        <Card className="border-slate-800/80 bg-slate-900/80 backdrop-blur-2xl text-white shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white flex items-center justify-between">
              <span>Sign In</span>
              <span className="text-[10px] font-mono-code bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-normal">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Enterprise Access
              </span>
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Enter your credentials to access the competency platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && <Alert type="error" message={error} onClose={clearError} />}

            {/* Google OAuth Component */}
            <div className="py-1">
              <GoogleLoginButton label="Sign in with Google" />
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-slate-900 px-3 text-slate-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" variant="primary" className="w-full h-11" isLoading={isLoading}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Platform
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-slate-900 px-3 text-slate-500">Or test with demo roles</span>
              </div>
            </div>

            {/* Quick Demo Role Selectors */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="px-3 py-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('employee')}
                className="px-3 py-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                💼 Employee
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="px-3 py-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                ⚡ Admin
              </button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-800/80 pt-4">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline">
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
