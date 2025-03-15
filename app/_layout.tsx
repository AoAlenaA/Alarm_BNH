import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';


export default function RootLayout() {
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
      <Stack.Screen name="alarm_music" 
        options={{ presentation: "modal" }} />
      <Stack.Screen name="alarm_vibration" 
        options={{ presentation: "modal" }} />
      <Stack.Screen name="notifications" 
        options={{ presentation: "modal" }} />
      <Stack.Screen name="math_alarm" 
        options={{ presentation: "modal" }} />
      <Stack.Screen name="steps" 
        options={{ presentation: "modal" }} />
    </Stack>
  );
}
