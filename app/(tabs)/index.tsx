import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getPersonId } from '../context/userContext';

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [alarms, setAlarms] = useState<any[]>([]);
  const [personId, setPersonId] = useState<string | null>(null); // Состояние для хранения personId
  const { refresh } = useLocalSearchParams(); // Получаем параметр refresh

  // Функция для получения personId
  const fetchPersonId = useCallback(async () => { // useCallback добавлен
    try {
      const id = await getPersonId();
      console.log("Person ID fetched:", id); // Логируем Person ID
      setPersonId(id);
      return id;
    } catch (error) {
      console.error('Ошибка при получении Person ID:', error);
      return null; // Важно возвращать null в случае ошибки
    }
  }, []);

  // Функция для получения данных о будильниках
  const fetchAlarms = useCallback(async () => { // useCallback добавлен
    try {
      const id = personId; // Используем personId из состояния
      if (!id) {
        console.warn('Person_id не найден, ожидаем загрузку...');
        return;
      }

      const { data, error } = await supabase
        .from('Alarm')
        .select('*')
        .eq('Person_id', id);

      if (error) {
        console.error('Ошибка при запросе данных:', error);
        return;
      }

      console.log("Данные будильников получены:", data); // Логируем данные
      setAlarms(data || []);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }, [personId]); // personId добавлен в зависимости

  // Получаем Person ID при монтировании компонента
  useEffect(() => {
    fetchPersonId();
  }, [fetchPersonId]);

  // Используем useFocusEffect для обновления данных при каждом переходе на экран И при наличии параметра refresh
  useFocusEffect(
    useCallback(() => {
      if (refresh === 'true' || !refresh) { // Обновляем только если refresh=true или refresh отсутствует
        fetchAlarms();
      }
    }, [fetchAlarms, refresh])
  );

  // Обновляем время каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{currentTime}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/alarm_creator" asChild>
          <Pressable>
            <Ionicons name="add-circle-outline" size={50} color="#1A293C" />
          </Pressable>
        </Link>
      </View>

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