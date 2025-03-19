import { Link, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getPersonId } from '../context/userContext';

export default function Index() {
  const { refresh } = useLocalSearchParams();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [alarms, setAlarms] = useState<any[]>([]);
  const [personId, setPersonId] = useState<string | null>(null);
  const router = useRouter();

  // Получаем personId
  const fetchPersonId = async () => {
    const id = await getPersonId();
    setPersonId(id);
    return id;
  };

  // Загружаем будильники из базы
  const fetchAlarms = async () => {
    try {
      const id = await fetchPersonId();
      if (!id) return;

      // Загружаем будильники
      const { data: alarmsData, error: alarmsError } = await supabase
        .from('Alarm')
        .select('*')
        .eq('Person_id', id);

      if (alarmsError) {
        console.error('Ошибка при запросе данных:', alarmsError);
        return;
      }

      // Загружаем задачи для каждого будильника
      const alarmsWithTasks = await Promise.all(
        alarmsData.map(async (alarm) => {
          const { data: taskData, error: taskError } = await supabase
            .from('Task')
            .select('Task_task')
            .eq('Task_id', alarm.Task_id)
            .single();

          if (taskError) {
            console.error('Ошибка при запросе задачи:', taskError);
            return { ...alarm, Task_task: 'Неизвестно' };
          }

          return { ...alarm, Task_task: taskData.Task_task };
        })
      );

      setAlarms(alarmsWithTasks);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (refresh === 'true' || !refresh) { // Обновляем только если refresh=true или refresh отсутствует
        fetchAlarms();
      }
    }, [fetchAlarms, refresh])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Функция для переключения состояния будильника
  const toggleAlarm = async (alarmId: string, currentStatus: boolean) => {
    try {
      // Сразу обновляем состояние локально
      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.Alarm_id === alarmId ? { ...alarm, Activity: !currentStatus } : alarm
        )
      );

      // Затем обновляем состояние в базе данных
      const { error } = await supabase
        .from('Alarm')
        .update({ Activity: !currentStatus })
        .eq('Alarm_id', alarmId);

      if (error) {
        console.error('Ошибка обновления состояния будильника:', error);
        // Если произошла ошибка, откатываем локальное состояние
        setAlarms((prevAlarms) =>
          prevAlarms.map((alarm) =>
            alarm.Alarm_id === alarmId ? { ...alarm, Activity: currentStatus } : alarm
          )
        );
      }
    } catch (error) {
      console.error('Ошибка при переключении будильника:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Верхняя часть с текущим временем */}
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

      {/* Список будильников */}
      <ScrollView contentContainerStyle={styles.alarmsContainer}>
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <Pressable 
              key={alarm.Alarm_id} 
              style={styles.alarmCard}
              onPress={() => router.push("/alarm_creator")} // Переход на экран редактирования
            >
              <View style={styles.alarmInfo}>
                <Text style={styles.alarmTime}>
                  {alarm.Alarm_time}
                </Text>
                <View style={styles.alarmDetails}>
                  <Text style={styles.alarmName}>{alarm.Alarm_name}</Text>
                  <Text style={styles.alarmSubtitle}>
                    {alarm.Task_task || 'Неизвестно'}
                  </Text>
                </View>
              </View>
              <Switch
                value={alarm.Activity} // Привязка значения
                onValueChange={() => toggleAlarm(alarm.Alarm_id, alarm.Activity)} // Обработчик изменения
                trackColor={{ false: '#A0A0A0', true: '#6B9080' }}
                thumbColor={alarm.Activity ? '#CCE3DE' : '#F6FFF8'}
              />
            </Pressable>
          ))
        ) : (
          <Text style={styles.text}>Пока нет будильников</Text>
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
  alarmsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  alarmCard: {
    backgroundColor: '#A4C3B2',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alarmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmDetails: {
    marginLeft: 15,
  },
  alarmTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A293C',
  },
  alarmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A293C',
  },
  alarmSubtitle: {
    fontSize: 14,
    color: '#6B9080',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: '#1A293C',
    fontWeight: 'bold',
  },
});