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
    await Notifications.setNotificationChannelAsync('new-emails', {
      name: 'E-mail notifications',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default', // Используй стандартный звук, чтобы убедиться, что он существует
      vibrationPattern: [0, 250, 250, 250], // Добавь паттерн вибрации
      bypassDnd: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, // Ensure notification is always visible
    });
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Пора вставать!!!",
            data: { screen: 'math_alarm' }, // Add screen data for navigation
            sticky: true,
            autoDismiss: false, // Ensure notification remains on the screen
        },
        trigger: {
            date: triggerDate,
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: 'new-emails',
        },
    });

    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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