// Утиліти для роботи з push-сповіщеннями в браузері

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Цей браузер не підтримує сповіщення');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.log('Сповіщення заблоковані користувачем');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }
};

export const subscribeToPushNotifications = async (): Promise<string | null> => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push-сповіщення не підтримуються');
    return null;
  }

  try {
    // Реєструємо service worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker зареєстровано:', registration);

    // Підписуємося на push-сповіщення
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
    });

    console.log('Підписка на push-сповіщення:', subscription);

    // Повертаємо endpoint для відправки на сервер
    return JSON.stringify(subscription);
  } catch (error) {
    console.error('Помилка підписки на push-сповіщення:', error);
    return null;
  }
};

export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log('Відписка від push-сповіщень успішна');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Помилка відписки від push-сповіщень:', error);
    return false;
  }
};
