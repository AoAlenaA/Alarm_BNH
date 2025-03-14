import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Pedometer } from 'expo-sensors';
import { Audio } from 'expo-av';

const StepsScreen = () => {
  const { stepCount } = useLocalSearchParams();
  const [stepsLeft, setStepsLeft] = useState<number>(stepCount ? parseInt(stepCount.toString(), 10) : 0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentSteps, setCurrentSteps] = useState<number>(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const router = useRouter();

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

  const playErrorSound = async () => {
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.error('Ошибка воспроизведения звука:', error);
      }
    }
  };

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

  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;

    const subscribeToPedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Ошибка', 'Шагомер недоступен на вашем устройстве.');
        return;
      }

      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const pastStepCount = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCount.steps !== null) {
        setCurrentSteps(pastStepCount.steps);
      }

      subscription = Pedometer.watchStepCount((result) => {
        setCurrentSteps((prevSteps) => prevSteps + result.steps);
      });
    };

    subscribeToPedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

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

export default StepsScreen;