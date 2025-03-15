import { Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from 'react';

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/*Заголовок*/}
      <View style={styles.header}>
        <Text style={styles.headerText}>{currentTime}</Text>
      </View>
      {/*кнопка*/}
      <View style={styles.buttonContainer}>
        <Link href="/alarm_creator" asChild>
          <Pressable> 
            <Ionicons name="add-circle-outline" size={50} color="#1A293C"/>
          </Pressable>
        </Link>
      </View>
      {/*Место для будильников*/}
      <ScrollView contentContainerStyle={styles.alarmscontainer}>
        <Text style={styles.text}>Пока вы не добавили ни один будильник</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCE3DE',

  },
  alarmscontainer: {
    flex:1,
    backgroundColor: '#CDE9D8',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  text: {
    color: '#1A293C',
    fontFamily: "Inter",
    fontWeight: "bold"
  },
  header: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 52,
    color: '#1A293C'
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: '#CCE3DE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom:20
  },
});