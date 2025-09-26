import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProjectFormData {
  name: string;
  description: string;
  type: 'PROJECT' | 'COURSE' | 'GROUP';
}

export const CreateProjectPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: 'PROJECT',
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      await projectService.createProject(data);
      toast.success('Проєкт створено успішно!');
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Помилка при створенні проєкту');
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
            <Link to="/projects">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Створити проєкт</h1>
              <p className="mt-2 text-gray-600">
                Додайте новий проєкт або курс
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Деталі проєкту</CardTitle>
            <CardDescription>
              Заповніть інформацію про проєкт
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Назва проєкту"
                placeholder="Введіть назву проєкту"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Назва проєкту обов\'язкова',
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
                  placeholder="Введіть опис проєкту"
                  {...register('description')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register('type')}
                >
                  <option value="PROJECT">Проєкт</option>
                  <option value="COURSE">Курс</option>
                  <option value="GROUP">Група</option>
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
                      Створити проєкт
                    </>
                  )}
                </Button>
                <Link to="/projects">
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
