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

      const { data, error } = await supabase.from('Alarm').select('*').eq('Person_id', id);

      if (error) {
        console.error('Ошибка при запросе данных:', error);
        return;
      }
      setAlarms(data || []);
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
    const { error } = await supabase
      .from('Alarm')
      .update({ Activity: !currentStatus })
      .eq('Alarm_id', alarmId);

    if (error) {
      console.error('Ошибка обновления состояния будильника:', error);
      return;
    }

    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.Alarm_id === alarmId ? { ...alarm, Activity: !currentStatus } : alarm
      )
    );
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
                  {new Date(alarm.Alarm_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <View>
                  <Text style={styles.alarmName}>{alarm.Alarm_name}</Text>
                  <Text style={styles.alarmSubtitle}>
                    {alarm.Task_id === 1 ? 'Игра' : 'Мелодия'}
                  </Text>
                </View>
              </View>
              <Switch
                value={alarm.Activity}
                onValueChange={() => toggleAlarm(alarm.Alarm_id, alarm.Activity)}
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
  },
  alarmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A293C',
    marginRight: 15,
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