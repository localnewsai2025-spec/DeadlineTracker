import * as admin from 'firebase-admin';
import { config } from './index';

// Ініціалізація Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail,
      }),
    });
  } catch (error) {
    console.error('Помилка ініціалізації Firebase:', error);
  }
}

export const firebaseAdmin = admin;

// Функція для відправки push-сповіщення
export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high' as const,
        notification: {
          sound: 'default',
          priority: 'high' as const,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('Push-сповіщення відправлено:', response);
    return response;
  } catch (error) {
    console.error('Помилка відправки push-сповіщення:', error);
    throw error;
  }
};

// Функція для відправки сповіщень кільком користувачам
export const sendPushNotificationToMultiple = async (
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  try {
    const message = {
      tokens,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high' as const,
        notification: {
          sound: 'default',
          priority: 'high' as const,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log('Push-сповіщення відправлено:', response);
    return response;
  } catch (error) {
    console.error('Помилка відправки push-сповіщень:', error);
    throw error;
  }
};
