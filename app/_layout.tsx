import { Stack } from 'expo-router';
import NotificationHandler from "./notifications"

export default function RootLayout() {
  return (
    <Stack>
      <NotificationHandler/>
      <Stack.Screen name='(tabs)' 
        options={{
          headerShown: false}}/>
      <Stack.Screen name="alarm_creator" 
        options={{ 
          presentation: "modal",
          headerShown: false }} />
      <Stack.Screen name="choose_game" 
        options={{ 
          presentation: "modal",
          headerShown: false }} />
      <Stack.Screen name="alarm_music" 
        options={{ 
          presentation: "modal",
          headerShown: false }} />
      <Stack.Screen name="alarm_vibration" 
        options={{ 
          presentation: "modal",
          headerShown: false }} />
      <Stack.Screen name="notifications" 
        options={{ 
          presentation: "modal",
          headerShown: false }} />
      <Stack.Screen name="math_alarm" 
        options={{ 
          presentation: "modal",
          headerShown: false }} />
    </Stack>
  );
}
