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
import { Badge } from '../components/ui/Badge';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { LogIn, GraduationCap, Sparkles, ShieldCheck, Lock, Mail, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100 px-4 py-12 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Ambient Glows */}
      <div className="fixed top-1/4 left-1/3 w-[500px] h-[500px] bg-blob-indigo pointer-events-none z-0 opacity-70" />
      <div className="fixed bottom-1/4 right-1/3 w-[450px] h-[450px] bg-blob-purple pointer-events-none z-0 opacity-50" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 animate-fade-in">
        {/* Left Side: Bento Feature Hero (Desktop) */}
        <div className="lg:col-span-6 space-y-6 text-left hidden lg:block">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Competency Intelligence Engine
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Map skills, bridge gaps, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              accelerate career growth.
            </span>
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-md font-normal">
            Real-time competency analytics, AI role benchmark matching, and personalized skill development workflows for modern tech teams.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl glass-bento space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div className="text-sm font-semibold text-white">98% Match Accuracy</div>
              <div className="text-xs text-zinc-400">Algorithmic role score evaluation.</div>
            </div>
            <div className="p-4 rounded-2xl glass-bento space-y-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <div className="text-sm font-semibold text-white">Enterprise Ready</div>
              <div className="text-xs text-zinc-400">Role-based access &amp; real-time metrics.</div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Glass Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          {/* Mobile Header Logo */}
          <div className="text-center space-y-2 mb-6 lg:hidden">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 border border-white/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Skill Gap <span className="bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">Analyzer</span>
            </h1>
          </div>

          <Card className="glass-bento text-zinc-100 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-white flex items-center justify-between">
                <span>Sign In</span>
                <Badge variant="primary" dot className="text-[10px] font-mono">
                  Enterprise
                </Badge>
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Enter credentials to access your talent workspace
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && <Alert type="error" message={error} onClose={clearError} />}

              {/* Google OAuth Button */}
              <div className="py-1">
                <GoogleLoginButton label="Sign in with Google" />
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-wider font-mono">
                  <span className="bg-zinc-900 px-3 text-zinc-500">Or email</span>
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

                <Button type="submit" variant="glow" size="lg" className="w-full h-11" isLoading={isLoading}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Workspace
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-wider font-mono">
                  <span className="bg-zinc-900 px-3 text-zinc-500">Demo Accounts</span>
                </div>
              </div>

              {/* Demo Role Selectors */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('student')}
                  className="px-2.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1"
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('employee')}
                  className="px-2.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1"
                >
                  💼 Employee
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="px-2.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1"
                >
                  ⚡ Admin
                </button>
              </div>
            </CardContent>

            <CardFooter className="justify-center border-t border-zinc-800/80 pt-4">
              <p className="text-xs text-zinc-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
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
