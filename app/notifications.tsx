import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

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
        if (response.notification.request.content.data.screen === 'math_alarm') {
          router.push('/math_alarm'); // Navigate to math_alarm screen
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

export async function sendNotification(triggerDate: Date) {
    await Notifications.setNotificationChannelAsync('new_emails', {
            name: 'E-mail notifications',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'wake_up.wav', // <- for Android 8.0+, see channelId property below
          });
          
          // Eg. schedule the notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "You've got mail! 📬",
              body: 'Open the notification to read them all',
              sound: 'wake_up.wav', // <- for Android below 8.0
              data: { screen: 'math_alarm' }
            },
            trigger: {
              date: triggerDate,
              type: Notifications.SchedulableTriggerInputTypes.DATE,
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