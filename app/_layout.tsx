import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useNotificationListeners } from './notifications';

export default function RootLayout() {
  useNotificationListeners();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);


  useEffect(() => {
    checkAuthStatus();
  }, []);


  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  // Показываем Slot во время загрузки или если пользователь не авторизован
  if (isAuthenticated === null || !isAuthenticated) {
    return <Slot />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name="alarm_creator" 
        options={{ presentation: "modal" }} />
      <Stack.Screen name="choose_game" 
        options={{ presentation: "modal" }}/>
      <Stack.Screen name="steps" 
        options={{ presentation: "modal" }} />
    </Stack>
  );
}
