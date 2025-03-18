import { Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getPersonId } from '../context/userContext'; // Импортируем функцию для получения Person_id


export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [alarms, setAlarms] = useState<any[]>([]);
  const [personId, setPersonId] = useState<string | null>(null); // Состояние для хранения personId


  // Функция для получения personId
  const fetchPersonId = async () => {
    const id = await getPersonId(); // Получаем personId
    setPersonId(id); // Сохраняем personId в состоянии
    return id; // Возвращаем personId
  };


  // Функция для получения данных о будильниках
  const fetchAlarms = async () => {
    try {
      const id = await fetchPersonId(); // Получаем personId
      if (!id) {
        console.error('Person_id не найден');
        return;
      }


      // Запрашиваем данные из таблицы Alarm для текущего пользователя
      const { data, error } = await supabase
        .from('Alarm')
        .select('*')
        .eq('Person_id', id); // Используем значение personId


      if (error) {
        console.error('Ошибка при запросе данных:', error);
        return;
      }


      // Устанавливаем данные в состояние
      setAlarms(data || []);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };


  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchAlarms();
  }, []); // Зависимость от personId не нужна, так как fetchAlarms сама вызывает fetchPersonId


  // Обновляем время каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);


    return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{currentTime}</Text>
      </View>


      {/* Кнопка добавления будильника */}
      <View style={styles.buttonContainer}>
        <Link href="/alarm_creator" asChild>
          <Pressable>
            <Ionicons name="add-circle-outline" size={50} color="#1A293C" />
          </Pressable>
        </Link>
      </View>


      {/* Место для будильников */}
      <ScrollView contentContainerStyle={styles.alarmscontainer}>
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <View key={alarm.Alarm_id} style={styles.alarmItem}>
              <Text style={styles.alarmText}>Название: {alarm.Alarm_name}</Text>
              <Text style={styles.alarmText}>Время: {new Date(alarm.Alarm_time).toLocaleTimeString()}</Text>
              <Text style={styles.alarmText}>Task ID: {alarm.Task_id}</Text>
              <Text style={styles.alarmText}>Level ID: {alarm.Level_id}</Text>
              <Text style={styles.alarmText}>Количество: {alarm.Count}</Text>
              <Text style={styles.alarmText}>Активен: {alarm.Activity ? 'Да' : 'Нет'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>Пока вы не добавили ни один будильник</Text>
        )}
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
    flex: 1,
    backgroundColor: '#CDE9D8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#1A293C',
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  header: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 52,
    color: '#1A293C',
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: '#CCE3DE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  alarmItem: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#F6FFF8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6B9080',
  },
  alarmText: {
    color: '#1A293C',
    fontFamily: 'Inter',
    fontSize: 16,
    marginBottom: 5,
  },
});
