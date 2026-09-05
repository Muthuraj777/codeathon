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
import { LogIn, GraduationCap } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Skill Gap Analyzer</h1>
          <p className="text-sm text-slate-400">Employee & Student Competency Assessment Platform</p>
        </div>

        <Card className="border-slate-800 bg-slate-800/80 text-white shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-400">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <Alert type="error" message={error} onClose={clearError} />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-slate-400">Or continue with demo roles</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition cursor-pointer"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('employee')}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition cursor-pointer"
              >
                💼 Employee
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition cursor-pointer"
              >
                ⚡ Admin
              </button>
            </div>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-700/50 pt-4">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
