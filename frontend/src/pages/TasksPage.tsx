import React from 'react';
import { useQuery } from 'react-query';
// import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatSmartDate, formatTaskStatus, formatTaskPriority, getStatusColor, getPriorityColor } from '../utils/format';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export const TasksPage: React.FC = () => {
  // const { user } = useAuth();

  const { data: tasks, isLoading: tasksLoading } = useQuery(
    'tasks',
    () => taskService.getTasks({}, { limit: 50, sortBy: 'deadline', sortOrder: 'asc' }),
    {
      select: (data) => data.data,
    }
  );

  if (tasksLoading) {
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
              <h1 className="text-3xl font-bold text-gray-900">Завдання</h1>
              <p className="mt-2 text-gray-600">
                Управління вашими завданнями та дедлайнами
              </p>
            </div>
            <Link to="/tasks/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Створити завдання
              </Button>
            </Link>
          </div>
        </div>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>Всі завдання</CardTitle>
            <CardDescription>
              {tasks?.length || 0} завдань знайдено
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <Badge className={getStatusColor(task.status)}>
                          {formatTaskStatus(task.status)}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {formatTaskPriority(task.priority)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Дедлайн: {formatSmartDate(task.deadline)}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link to={`/tasks/${task.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/tasks/${task.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Немає завдань</p>
                <p className="text-gray-400 mt-2">Створіть перше завдання, щоб почати</p>
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
      </div>
    </div>
  );
};
