import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatSmartDate, formatTaskStatus, formatTaskPriority, getStatusColor, getPriorityColor } from '../utils/format';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, AlertTriangle, Plus, Eye } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: tasks, isLoading: tasksLoading } = useQuery(
    'tasks',
    () => taskService.getTasks({}, { limit: 10, sortBy: 'deadline', sortOrder: 'asc' }),
    {
      select: (data) => data.data,
    }
  );

  const { data: projects, isLoading: projectsLoading } = useQuery(
    'projects',
    () => projectService.getProjects({}, { limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
    {
      select: (data) => data.data,
    }
  );

  const { data: overdueTasks, isLoading: overdueLoading } = useQuery(
    'overdueTasks',
    () => taskService.getOverdueTasks(),
    {
      select: (data) => data,
    }
  );

  const { data: upcomingTasks, isLoading: upcomingLoading } = useQuery(
    'upcomingTasks',
    () => taskService.getUpcomingTasks(7),
    {
      select: (data) => data,
    }
  );

  if (tasksLoading || projectsLoading || overdueLoading || upcomingLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">
            Привіт, {user?.firstName}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Ось огляд ваших завдань та проєктів
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Всього завдань</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Виконано</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks?.filter(task => task.status === 'COMPLETED').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Прострочено</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueTasks?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Майбутні</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingTasks?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Останні завдання</CardTitle>
                  <CardDescription>
                    Ваші нещодавні завдання
                  </CardDescription>
                </div>
                <Link to="/tasks">
                  <Button size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Всі завдання
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {tasks && tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-500">
                          {formatSmartDate(task.deadline)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(task.status)}>
                          {formatTaskStatus(task.status)}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {formatTaskPriority(task.priority)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Немає завдань</p>
                  <Link to="/tasks/new">
                    <Button className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Створити завдання
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Проєкти</CardTitle>
                  <CardDescription>
                    Ваші проєкти та курси
                  </CardDescription>
                </div>
                <Link to="/projects">
                  <Button size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Всі проєкти
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="secondary">
                          {project._count.tasks} завдань
                        </Badge>
                        <Badge variant="outline">
                          {project._count.members} учасників
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Немає проєктів</p>
                  <Button asChild className="mt-4">
                    <Link to="/projects/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Створити проєкт
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Overdue Tasks Alert */}
        {overdueTasks && overdueTasks.length > 0 && (
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">⚠️ Прострочені завдання</CardTitle>
              <CardDescription className="text-red-600">
                У вас є {overdueTasks.length} прострочених завдань
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-500">
                        Прострочено: {formatSmartDate(task.deadline)}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/tasks/${task.id}`}>
                        Переглянути
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
