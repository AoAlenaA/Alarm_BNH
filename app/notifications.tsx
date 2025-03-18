import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import difficulty from "./level"
import exampleCount from "./level"


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
    const router = useRouter(); // Initialize router for navigation
    

    useEffect(() => {
      registerForPushNotificationsAsync();

      const notificationSub = Notifications.addNotificationReceivedListener(notification => {
        console.log('Уведомление получено:', notification);
      });
      setNotificationListener(notificationSub);

      const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Пользователь нажал на уведомление:', response);
        if (response.notification.request.content.data.screen === 'Игра') {
          const {exampleCount} = response.notification.request.content.data;
          router.push({
            pathname: '/game',
            params: {targetScore: exampleCount},
          });
        }
        else if (response.notification.request.content.data.screen === 'Запись текста') {
          const {exampleCount} = response.notification.request.content.data;
          router.push({
            pathname: '/rewriting',
            params: {count: exampleCount},
          }); 
        }
        else if (response.notification.request.content.data.screen === 'Решение примеров') {
          const { difficulty, exampleCount } = response.notification.request.content.data;
          router.push({
            pathname: '/math',
            params: { level: difficulty , totalExamples: exampleCount  },
          });
        }
        else if (response.notification.request.content.data.screen === 'Прохождение шагов') {
          const {exampleCount} = response.notification.request.content.data;
          router.push({
            pathname: '/steps',
            params: {stepCount: exampleCount},
          });
        }
        else{
          router.push({
            pathname: '/(tabs)',
          });
        }
        
      });
      setResponseListener(responseSub);

      return () => {
        if (notificationListener) Notifications.removeNotificationSubscription(notificationListener);
        if (responseListener) Notifications.removeNotificationSubscription(responseListener);
      };
    }, []);

    return { notificationListener, responseListener };
}

export async function sendNotification(triggerDate: Date, screenData: string | string[], difficulty: string | string[], exampleCount: string | string[], melody: string) {
    await Notifications.setNotificationChannelAsync('new_emails', {
            name: 'E-mail notifications',
            importance: Notifications.AndroidImportance.MAX,
            sound: melody, 
            vibrationPattern: [0, 250, 250, 250], // Опционально: добавьте вибрацию
            enableVibrate: true,// <- for Android 8.0+, see channelId property below
          });
          
          // Eg. schedule the notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Пора вставать!",
              body: 'Поскорее выключите будильник',
              sound: melody, // <- for Android below 8.0
              data: { screen: screenData, difficulty, exampleCount },
              sticky: true
            },
            
            trigger: {
              hour:triggerDate.getHours(),
              minute: triggerDate.getMinutes(),
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              channelId: 'new_emails', // <- for Android 8.0+, see definition above
            },
          });
    
        console.log(`Будильник установлен на ${triggerDate}`);

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