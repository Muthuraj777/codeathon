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
import { LogIn, GraduationCap, ShieldCheck, Lock, Mail, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0F172A] px-4 py-12 relative overflow-hidden selection:bg-blue-500/20 selection:text-blue-900">
      {/* Soft Ambient Radial Glows */}
      <div className="fixed top-1/4 left-1/3 w-[500px] h-[500px] bg-blob-blue pointer-events-none z-0 opacity-80" />
      <div className="fixed bottom-1/4 right-1/3 w-[450px] h-[450px] bg-blob-indigo pointer-events-none z-0 opacity-60" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 animate-fade-in">
        {/* Left Side: Bento Feature Hero (Desktop) */}
        <div className="lg:col-span-6 space-y-6 text-left hidden lg:block">
         

          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            Map skills, bridge gaps, <br />
            <span className="text-[#2563EB]">
              accelerate career growth.
            </span>
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md font-normal">
            Real-time competency analytics, AI role benchmark matching, and personalized skill development workflows for modern tech teams.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl glass-bento space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div className="text-sm font-semibold text-slate-900">98% Match Accuracy</div>
              <div className="text-xs text-slate-500">Algorithmic role score evaluation.</div>
            </div>
            <div className="p-4 rounded-2xl glass-bento space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
              <div className="text-sm font-semibold text-slate-900">Enterprise Ready</div>
              <div className="text-xs text-slate-500">Role-based access &amp; real-time metrics.</div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Glass Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          {/* Mobile Header Logo */}
          <div className="text-center space-y-2 mb-6 lg:hidden">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2563EB] text-white shadow-md shadow-blue-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Skill Gap <span className="text-[#2563EB]">Analyzer</span>
            </h1>
          </div>

          <Card className="glass-bento text-[#0F172A] shadow-xl text-center">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-slate-900 flex items-center justify-between">
                <span>Sign In</span>
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs text-center">
                Enter credentials to access your talent workspace
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && <Alert type="error" message={error} onClose={clearError} />}

              <div className="py-1">
                <GoogleLoginButton label="Sign in with Google" />
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-wider font-mono">
                  <span className="bg-white px-3 text-slate-400">Or email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="name@company.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  label="Password"
                  type="password"
                  icon={<Lock className="w-4 h-4" />}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />

                <Button type="submit" variant="primary" size="lg" className="w-full h-11" isLoading={isLoading}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Workspace
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-wider font-mono">
                  <span className="bg-white px-3 text-slate-400">Demo Accounts</span>
                </div>
              </div>

              {/* Demo Role Selectors */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('student')}
                  className="px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('employee')}
                  className="px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                >
                  💼 Employee
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                >
                  ⚡ Admin
                </button>
              </div>
            </CardContent>

            <CardFooter className="justify-center border-t border-slate-200/80 pt-4">
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-[#2563EB] hover:underline">
                  Create Account
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
