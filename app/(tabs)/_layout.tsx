import { Tabs } from 'expo-router';
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:"#CEE9D7",
        tabBarInactiveTintColor: "#20313B", 
        headerTintColor: "#20313B",
        tabBarStyle:{
            backgroundColor: "#A4C3B2"
        },
        tabBarShowLabel: false,
        }}>
      <Tabs.Screen name='index'
        options={{
            tabBarIcon : ({focused, color}) => 
            <Ionicons 
            name= {focused?'alarm-sharp': "alarm-outline"}
            color={color}
            size ={30} />
        }}/>
      <Tabs.Screen name='analytics'
        options={{
            tabBarIcon : ({focused, color}) => 
            <Ionicons 
            name= {focused?'analytics-sharp': "analytics-outline"}
            color={color}
            size ={30} />
        }}/>
      <Tabs.Screen name='settings'
        options={{
            tabBarIcon : ({focused, color}) => 
            <Ionicons 
            name= {focused?'settings-sharp': "settings-outline"}
            color={color}
            size ={30} />
        }}/>
    </Tabs>
    
  );
}
