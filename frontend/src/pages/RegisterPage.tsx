import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    console.log('📝 Form data:', data);
    console.log('🔍 Form errors:', errors);
    setIsLoading(true);
    try {
      await registerUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Registration error:', error);
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
            Створіть новий обліковий запис
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Реєстрація</CardTitle>
            <CardDescription>
              Заповніть форму для створення облікового запису
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit, (errors) => {
              console.log('❌ Form validation errors:', errors);
            })} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ім'я"
                  placeholder="Іван"
                  error={errors.firstName?.message}
                  {...register('firstName', {
                    required: 'Ім\'я обов\'язкове',
                    minLength: {
                      value: 2,
                      message: 'Ім\'я повинно містити мінімум 2 символи',
                    },
                  })}
                />

                <Input
                  label="Прізвище"
                  placeholder="Іванов"
                  error={errors.lastName?.message}
                  {...register('lastName', {
                    required: 'Прізвище обов\'язкове',
                    minLength: {
                      value: 2,
                      message: 'Прізвище повинно містити мінімум 2 символи',
                    },
                  })}
                />
              </div>

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

              <Input
                label="Підтвердження пароля"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Підтвердження пароля обов\'язкове',
                  validate: (value) =>
                    value === password || 'Паролі не співпадають',
                })}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Реєстрація...
                  </>
                ) : (
                  'Зареєструватися'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Вже маєте обліковий запис?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Увійти
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
