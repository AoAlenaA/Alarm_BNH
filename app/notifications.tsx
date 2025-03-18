import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotificationListeners() {
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);
    const processedNotifications = useRef<Set<string>>(new Set()); // Храним обработанные ID уведомлений
    const router = useRouter();

    useEffect(() => {
        // Регистрируем уведомления только один раз
        registerForPushNotificationsAsync();

        // Убедимся, что подписки удаляются перед созданием новых
        if (notificationListener.current) {
            Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
            Notifications.removeNotificationSubscription(responseListener.current);
        }

        // Подписка на получение уведомлений
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Уведомление получено:', notification);
        });

        // Подписка на нажатие уведомлений
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const notificationId = response.notification.request.identifier;

            // Проверяем, обработано ли уже это уведомление
            if (processedNotifications.current.has(notificationId)) {
                console.log('Уведомление уже обработано, пропускаем...');
                return;
            }
            processedNotifications.current.add(notificationId); // Добавляем в обработанные
            console.log('Пользователь нажал на уведомление:', response);

            const { screen, difficulty, exampleCount } = response.notification.request.content.data;

            // Навигация на нужный экран
            switch (screen) {
                case 'Игра':
                    router.push({ pathname: '/game', params: { targetScore: exampleCount } });
                    break;
                case 'Запись текста':
                    router.push({ pathname: '/rewriting', params: { count: exampleCount } });
                    break;
                case 'Решение примеров':
                    router.push({ pathname: '/math', params: { level: difficulty, totalExamples: exampleCount } });
                    break;
                case 'Прохождение шагов':
                    router.push({ pathname: '/steps', params: { stepCount: exampleCount } });
                    break;
                default:
                    router.push({ pathname: '/(tabs)' });
            }
        });

        // Очистка подписок при размонтировании
        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
                notificationListener.current = null;
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
                responseListener.current = null;
            }
        };
    }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится только один раз

    return { notificationListener, responseListener };
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

export async function sendNotification(triggerDate: {hours: number, minutes: number, seconds: number}, screenData: string | string[], difficulty: string | string[], exampleCount: string | string[], melody: string) {
    // Cancel all existing notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Check if a notification with the same identifier already exists
    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const notificationId = `${triggerDate.hours}-${triggerDate.minutes}-${triggerDate.seconds}`;
    if (existingNotifications.some(notification => notification.identifier === notificationId)) {
        console.log('Уведомление с таким идентификатором уже существует, пропускаем...');
        return;
    }

    console.log('Существующие уведомления:', existingNotifications);

    await Notifications.setNotificationChannelAsync('new_emails', {
        name: 'E-mail notifications',
        importance: Notifications.AndroidImportance.MAX,
        sound: melody,
        vibrationPattern: [0, 250, 250, 250], // Опционально: добавьте вибрацию
        enableVibrate: true, // <- for Android 8.0+, see channelId property below
    });

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
        identifier: notificationId,
        content: {
            title: "Пора вставать!",
            body: 'Поскорее выключите будильник',
            sound: melody, // <- for Android below 8.0
            data: { screen: screenData, difficulty, exampleCount },
        },
        trigger: {
            hour: triggerDate.hours,
            minute: triggerDate.minutes,
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            channelId: 'new_emails', // <- for Android 8.0+, see definition above
        },
    });

    console.log(`Будильник установлен на ${triggerDate.hours}:${triggerDate.minutes}:${triggerDate.seconds}`);
}