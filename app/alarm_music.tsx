import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";




Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
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
  const targetDate = new Date('2024-03-10T00:01:00'); 
  const sendNotification = async () => {
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Привет! 📬",
        body: "Это тестовое уведомление из Expo!",
        sound: true,
      },
      trigger:null
      //trigger: { date: targetDate } as const, 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Expo Push Notifications</Text>
      <Button title="Отправить уведомление" onPress={sendNotification} />
    </View>
  );
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
