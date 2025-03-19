import { Link, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Modal, Alert } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlarmId, setSelectedAlarmId] = useState<string | null>(null);
  const router = useRouter();

  const fetchPersonId = async () => {
    const id = await getPersonId();
    setPersonId(id);
    return id;
  };

  const fetchAlarms = async () => {
    try {
      const id = await fetchPersonId();
      if (!id) return;

      const { data: alarmsData, error: alarmsError } = await supabase
        .from('Alarm')
        .select('*')
        .eq('Person_id', id)
        .order('Alarm_time', { ascending: true });

      if (alarmsError) {
        console.error('Ошибка при запросе данных:', alarmsError);
        return;
      }

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
      if (refresh === 'true' || !refresh) {
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

  const toggleAlarm = async (alarmId: string, currentStatus: boolean) => {

    setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.Alarm_id === alarmId ? { ...alarm, Activity: !currentStatus } : alarm
        )
      );

    console.log('Новое состояние', !currentStatus)
    try {
      const { error } = await supabase
        .from('Alarm')
        .update({ Activity: !currentStatus })
        .eq('Alarm_id', alarmId);
      console.log("Состояние обновилось")

      if (error) {
        console.error('Ошибка обновления состояния будильника:', error);
      }
    } catch (error) {
      console.error('Ошибка при переключении будильника:', error);
    }
  };

  const handleLongPress = (alarmId: string) => {
    setSelectedAlarmId(alarmId);
    setModalVisible(true);
  };

  const deleteAlarm = async () => {
    console.log('Удаляю будильник')
    if (!selectedAlarmId) return;

    try {
      const { error } = await supabase
        .from('Alarm')
        .delete()
        .eq('Alarm_id', selectedAlarmId);

      if (error) {
        console.error('Ошибка удаления будильника:', error);
        return;
      }

      setAlarms((prevAlarms) => prevAlarms.filter((alarm) => alarm.Alarm_id !== selectedAlarmId));
      setModalVisible(false);
    } catch (error) {
      console.error('Ошибка при удалении будильника:', error);
    }
    console.log('Удалила будильник')
  };

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

      <ScrollView contentContainerStyle={styles.alarmsContainer}>
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <Pressable 
              key={alarm.Alarm_id} 
              style={styles.alarmCard}
              onPress={() => router.push("/alarm_creator")}
              onLongPress={() => handleLongPress(alarm.Alarm_id)}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Вы точно хотите удалить будильник?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={deleteAlarm}>
                <Text style={styles.modalButtonText}>Да</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Нет</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#6B9080',
    borderRadius: 10,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});