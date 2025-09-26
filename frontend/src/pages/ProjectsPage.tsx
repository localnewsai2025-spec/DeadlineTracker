import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Users, Calendar } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();

  const { data: projects, isLoading: projectsLoading, refetch } = useQuery(
    'projects',
    () => projectService.getProjects({}, { limit: 50, sortBy: 'createdAt', sortOrder: 'desc' }),
    {
      select: (data) => data.data,
    }
  );

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Проєкти</h1>
              <p className="mt-2 text-gray-600">
                Управління вашими проєктами та курсами
              </p>
            </div>
            <Link to="/projects/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Створити проєкт
              </Button>
            </Link>
          </div>
        </div>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Всі проєкти</CardTitle>
            <CardDescription>
              {projects?.length || 0} проєктів знайдено
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-gray-900 text-lg">{project.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Link to={`/projects/${project.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/projects/${project.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {project.description && (
                      <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {project._count.members} учасників
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project._count.tasks} завдань
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {project.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Немає проєктів</p>
                <p className="text-gray-400 mt-2">Створіть перший проєкт, щоб почати</p>
                <Link to="/projects/new">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Створити проєкт
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
