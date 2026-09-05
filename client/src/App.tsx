import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { create } from 'zustand';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

const queryClient = new QueryClient();

// Zustand State Demo
interface AppState {
  count: number;
  increment: () => void;
}

const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Zod Form Schema Demo
const formSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
});

type FormValues = z.infer<typeof formSchema>;

function MainContent() {
  const { count, increment } = useAppStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className={cn('min-h-screen p-8 bg-slate-50 text-slate-900 font-sans')}>
      <header className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
          TeamTask Client Setup
        </h1>
        <p className="text-slate-600 mt-2">
          React, TypeScript, Tailwind CSS, Zustand, React Query & React Hook Form + Zod
        </p>
      </header>

      <div className="max-w-2xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Zustand Store</h2>
          <p className="mb-4 text-sm text-slate-600">Count: {count}</p>
          <button
            onClick={increment}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Increment Count
          </button>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">React Hook Form + Zod</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('username')}
                placeholder="Enter username"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {errors.username.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition"
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainContent />
    </QueryClientProvider>
  );
}
