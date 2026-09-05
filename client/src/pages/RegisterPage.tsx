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
import { UserPlus, GraduationCap, UserCheck, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden px-4 py-12">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/20 to-violet-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 mb-1">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            Create Account
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Join the Skill Gap Analyzer Platform &amp; unlock AI-driven career trajectory insights.
          </p>
        </div>

        <Card className="border-slate-800/80 bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-indigo-950/40 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-white font-bold">Register Account</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Select your organization role and fill in your account details
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5">
            {error && <Alert type="error" message={error} onClose={clearError} />}

            {/* Google OAuth Register Feature */}
            <GoogleLoginButton label="Sign up with Google" />

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest">
                <span className="bg-slate-900 px-3 text-slate-500 font-bold">Or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-3">
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
                        className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900/60'
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-400 absolute top-2 right-2" />
                        )}
                        <RoleIcon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                        {roleItem.label}
                      </button>
                    );
                  })}
                </div>
                {errors.role && <p className="text-xs text-red-400 mt-1">{errors.role.message}</p>}
              </div>

              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
                <UserPlus className="w-4 h-4 mr-2" />
                Register Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-800/60 py-4 bg-slate-950/30">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

