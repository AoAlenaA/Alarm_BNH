
import { Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons} from "@expo/vector-icons";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      {/*Заголовок*/}
      <View style={styles.header}>
        <Text style={styles.headerText}>Будильники отключены</Text>
      </View>
      {/*кнопка*/}
      <View style={styles.buttonContainer}>
        <Link href="/alarm_creator" asChild>
          <Pressable> 
            <Ionicons name="add" size={30} color="#1A293C"/>
          </Pressable>
        </Link>
      </View>
    {/*Место для будильников*/}
      <ScrollView contentContainerStyle={styles.alarmscontainer}>
        <Text style={styles.text}>Пока  вы не добавили ни один будильник</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A293C'
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: '#CCE3DE',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight:20
  },
});
