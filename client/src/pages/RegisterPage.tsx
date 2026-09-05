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
import { UserPlus, GraduationCap, UserCheck, ShieldCheck, Sparkles, CheckCircle, Mail, Lock, User } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden px-4 py-12 selection:bg-blue-500/20 selection:text-blue-900">
      {/* Background Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blob-blue pointer-events-none z-0 opacity-80" />

      <div className="w-full max-w-lg space-y-6 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#2563EB] text-white shadow-md shadow-blue-600/20 mb-1">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] flex items-center justify-center gap-2">
            <span>Create Account</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Join the platform &amp; unlock AI competency gap insights.
          </p>
        </div>

        <Card className="glass-bento shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 font-semibold">Register Account</CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Select your workspace role and enter your details
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && <Alert type="error" message={error} onClose={clearError} />}

            <GoogleLoginButton label="Sign up with Google" />

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-white px-3 text-slate-400">Or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Select Workspace Role
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'student', label: 'Student', icon: GraduationCap },
                    { id: 'employee', label: 'Employee', icon: UserCheck },
                    { id: 'admin', label: 'Admin', icon: ShieldCheck },
                  ].map((roleItem) => {
                    const RoleIcon = roleItem.icon;
                    const isSelected = selectedRole === roleItem.id;
                    return (
                      <button
                        key={roleItem.id}
                        type="button"
                        onClick={() => setValue('role', roleItem.id as any)}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-2xs ring-1 ring-blue-500/50'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600 absolute top-2 right-2" />
                        )}
                        <RoleIcon className={`w-4 h-4 mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        {roleItem.label}
                      </button>
                    );
                  })}
                </div>
                {errors.role && <p className="text-xs text-rose-600 mt-1">{errors.role.message}</p>}
              </div>

              <Input
                label="Full Name"
                type="text"
                icon={<User className="w-4 h-4" />}
                placeholder="Alex Morgan"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                placeholder="alex@company.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                icon={<Lock className="w-4 h-4" />}
                placeholder="Minimum 6 characters"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                icon={<Lock className="w-4 h-4" />}
                placeholder="Re-enter password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" variant="primary" size="lg" className="w-full h-11 mt-2" isLoading={isLoading}>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-200/80 py-4 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
