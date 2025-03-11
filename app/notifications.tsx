import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router'; // Импорт useRouter

export default function NotificationHandler() {
  const router = useRouter();  // Получаем объект router

  useEffect(() => {
    //  Обработчик нажатия на уведомление
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { notification } = response; // Получаем объект уведомления
      const { data } = notification.request.content; // Извлекаем данные

      if (data && data.screen) {
        // Выполняем навигацию на нужный экран
        router.push('/math_alaram'); //  Навигация на указанный экран
      }
    });

    return () => subscription.remove();  // Очищаем слушателя при размонтировании
  }, []);

  return null; // Этот компонент не отображает ничего визуально
}





Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export function useNotificationListeners() {
    const [notificationListener, setNotificationListener] = useState<Notifications.Subscription | null>(null);
    const [responseListener, setResponseListener] = useState<Notifications.Subscription | null>(null);
  
    useEffect(() => {
      registerForPushNotificationsAsync();
  
      const notificationSub = Notifications.addNotificationReceivedListener(notification => {
        console.log('Уведомление получено:', notification);
      });
      setNotificationListener(notificationSub);
  
      const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Пользователь нажал на уведомление:', response);
      });
      setResponseListener(responseSub);
  
      return () => {
        if (notificationListener) Notifications.removeNotificationSubscription(notificationListener);
        if (responseListener) Notifications.removeNotificationSubscription(responseListener);
      };
    }, []);
  
    return { notificationListener, responseListener };
  }

  
export async function sendNotification(triggerDate: Date) {
    await Notifications.setNotificationChannelAsync('new-emails', {
      name: 'E-mail notifications',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'wake_up',
      bypassDnd: true,
      
    });
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Пора вставать!!!",
            data: { screen: 'math_alarm' },
            vibrate: [0, 250, 250, 250],
            sticky: true,
        },
        trigger: {
            date: triggerDate,
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId:"new-emails"
        },
    });
}


  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      alert('Push-уведомления работают только на реальных устройствах');
      return;
    }
  
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
  
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      alert('Разрешение на отправку уведомлений не предоставлено!');
      return;
    }
  }
  
  