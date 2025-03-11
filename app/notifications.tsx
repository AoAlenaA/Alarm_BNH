import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
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
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, // Ensure notification is always visible
    });
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Пора вставать!!!",
            data: { screen: 'math_alarm' },
            vibrate: [0, 250, 250, 250],
            sticky: true,
            sound: 'wake_up', // Ensure sound plays continuously
            priority: Notifications.AndroidNotificationPriority.MAX, // Ensure high priority
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

