import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '../validations/authValidation';
import { useAuthStore } from '../stores/useAuthStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { UserPlus, GraduationCap, UserCheck, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerUser, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword: _confirmPassword, ...registerPayload } = data;
    const success = await registerUser(registerPayload);
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
          <p className="text-sm text-slate-400">Join the Skill Gap Analyzer Platform</p>
        </div>

        <Card className="border-slate-800 bg-slate-800/80 text-white shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Register</CardTitle>
            <CardDescription className="text-slate-400">Enter your details to create a new user profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <Alert type="error" message={error} onClose={clearError} />}

            {/* Google OAuth Register Feature */}
            <GoogleLoginButton label="Sign up with Google" />

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-slate-400">Or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setValue('role', 'student')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition cursor-pointer ${
                      selectedRole === 'student'
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 mb-1" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('role', 'employee')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition cursor-pointer ${
                      selectedRole === 'employee'
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 mb-1" />
                    Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('role', 'admin')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 mb-1" />
                    Admin
                  </button>
                </div>
                {errors.role && <p className="text-xs text-red-400 mt-1">{errors.role.message}</p>}
              </div>

              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                <UserPlus className="w-4 h-4 mr-2" />
                Register Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-700/50 pt-4">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
