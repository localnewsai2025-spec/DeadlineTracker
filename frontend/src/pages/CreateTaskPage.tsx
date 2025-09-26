import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';
import { TaskPriority } from '../types';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface TaskFormData {
  title: string;
  description: string;
  deadline: string;
  priority: TaskPriority;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export const CreateTaskPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      deadline: '',
      priority: TaskPriority.MEDIUM,
      status: 'PENDING',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      await taskService.createTask({
        ...data,
        deadline: new Date(data.deadline).toISOString(),
      });
      toast.success('Завдання створено успішно!');
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Помилка при створенні завдання');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/tasks">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Створити завдання</h1>
              <p className="mt-2 text-gray-600">
                Додайте нове завдання до вашого списку
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Деталі завдання</CardTitle>
            <CardDescription>
              Заповніть інформацію про завдання
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Назва завдання"
                placeholder="Введіть назву завдання"
                error={errors.title?.message}
                {...register('title', {
                  required: 'Назва завдання обов\'язкова',
                  minLength: {
                    value: 3,
                    message: 'Назва повинна містити мінімум 3 символи',
                  },
                })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Опис
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Введіть опис завдання"
                  {...register('description')}
                />
              </div>

              <Input
                label="Дедлайн"
                type="datetime-local"
                error={errors.deadline?.message}
                {...register('deadline', {
                  required: 'Дедлайн обов\'язковий',
                })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пріоритет
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register('priority')}
                >
                  <option value={TaskPriority.LOW}>Низький</option>
                  <option value={TaskPriority.MEDIUM}>Середній</option>
                  <option value={TaskPriority.HIGH}>Високий</option>
                  <option value={TaskPriority.URGENT}>Терміновий</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register('status')}
                >
                  <option value="PENDING">Очікує</option>
                  <option value="IN_PROGRESS">В процесі</option>
                  <option value="COMPLETED">Виконано</option>
                  <option value="CANCELLED">Скасовано</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Створення...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Створити завдання
                    </>
                  )}
                </Button>
                <Link to="/tasks">
                  <Button type="button" variant="outline">
                    Скасувати
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
