import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Pedometer } from 'expo-sensors';
import { Audio } from 'expo-av';

const StepsScreen = () => {
  const { stepCount } = useLocalSearchParams();
  const [stepsLeft, setStepsLeft] = useState<number>(stepCount ? parseInt(stepCount.toString(), 10) : 0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentSteps, setCurrentSteps] = useState<number>(0); // Шаги с начала таймера
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean>(false);
  const router = useRouter();

  // Загрузка звука
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/error_sound.mp3')
        );
        setSound(sound);
      } catch (error) {
        console.error('Ошибка загрузки звука:', error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Воспроизведение звука
  const playErrorSound = async () => {
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.error('Ошибка воспроизведения звука:', error);
      }
    }
  };

  // Проверка доступности шагомера
  useEffect(() => {
    const checkPedometerAvailability = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);

      if (!isAvailable) {
        Alert.alert('Ошибка', 'Шагомер недоступен на вашем устройстве.');
      }
    };

    checkPedometerAvailability();
  }, []);

  // Таймер
  useEffect(() => {
    if (timeLeft > 0 && currentSteps < stepsLeft) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      playErrorSound();
      Alert.alert('Время вышло!', 'Вы не прошли все шаги.');
      router.back();
    }
  }, [timeLeft, currentSteps]);

  // Отслеживание шагов с начала таймера
  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;

    if (isPedometerAvailable) {
      // Сбрасываем шаги при старте таймера
      setCurrentSteps(0);

      // Подписываемся на обновления шагов
      subscription = Pedometer.watchStepCount((result) => {
        setCurrentSteps((prevSteps) => prevSteps + 1); // Увеличиваем счетчик шагов на 1
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isPedometerAvailable]);

  // Проверка выполнения шагов
  useEffect(() => {
    if (currentSteps >= stepsLeft && timeLeft > 0) {
      Alert.alert('Поздравляем!', 'Вы прошли все шаги!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [currentSteps, timeLeft]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Шаги</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.stepsText}>Осталось шагов: {Math.max(0, stepsLeft - currentSteps)}</Text>
        <Text style={styles.timerText}>Осталось времени: {timeLeft} сек</Text>
      </View>
    </View>
  );
};
export default StepsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCE3DE',
  },
  header: {
    backgroundColor: '#6B9080',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stepsText: {
    fontSize: 24,
    color: '#1A293C',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    color: '#1A293C',
    fontFamily: 'Inter',
    marginBottom: 20,
  },
});

