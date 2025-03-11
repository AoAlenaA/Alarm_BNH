import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
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
