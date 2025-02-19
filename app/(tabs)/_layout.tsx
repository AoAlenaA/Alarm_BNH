import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:"#CEE9D7"
        }}>
      <Tabs.Screen name='index'/>
      <Tabs.Screen name='analytics'/>
      <Tabs.Screen name='settings'/>
    </Tabs>
    
  );
}
