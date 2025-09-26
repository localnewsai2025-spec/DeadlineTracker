import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
// import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: 'admin@example.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('📝 Form submitted with:', data);
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      console.log('🎉 Login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('💥 Login failed:', error);
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">DeadlineTracker</h1>
          <p className="mt-2 text-sm text-gray-600">
            Увійдіть в свій обліковий запис
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Вхід в систему</CardTitle>
            <CardDescription>
              Введіть свої облікові дані для входу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email обов\'язковий',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Невірний формат email',
                  },
                })}
              />

              <Input
                label="Пароль"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Пароль обов\'язковий',
                  minLength: {
                    value: 6,
                    message: 'Пароль повинен містити мінімум 6 символів',
                  },
                })}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                onClick={() => console.log('🔘 Button clicked!')}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Вхід...
                  </>
                ) : (
                  'Увійти'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Немає облікового запису?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Зареєструватися
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Тестові облікові записи:
          </p>
          <div className="mt-2 space-y-1 text-xs text-gray-500">
            <p>👑 Адмін: admin@example.com / password123</p>
            <p>👨‍💼 Менеджер: manager@example.com / password123</p>
            <p>👨‍🏫 Керівник: lead@example.com / password123</p>
            <p>👨‍🎓 Студент: student1@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
