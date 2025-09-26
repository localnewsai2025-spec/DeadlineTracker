import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { requestNotificationPermission, subscribeToPushNotifications } from '../utils/notifications';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { user: _user } = useAuth();

  useEffect(() => {
    // Перевіряємо підтримку сповіщень
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Сповіщення не підтримуються в цьому браузері');
      return false;
    }

    try {
      const granted = await requestNotificationPermission();
      setPermission(Notification.permission);
      
      if (granted) {
        toast.success('Дозвіл на сповіщення надано');
        
        // Підписуємося на push-сповіщення
        const subscription = await subscribeToPushNotifications();
        if (subscription) {
          // Тут можна відправити subscription на сервер
          console.log('Підписка на push-сповіщення:', subscription);
        }
        
        return true;
      } else {
        toast.error('Дозвіл на сповіщення відхилено');
        return false;
      }
    } catch (error) {
      console.error('Помилка запиту дозволу на сповіщення:', error);
      toast.error('Помилка налаштування сповіщень');
      return false;
    }
  };

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      return Notification.permission;
    }
    return 'denied';
  };

  return {
    isSupported,
    permission,
    requestPermission,
    checkPermission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
  };
};
