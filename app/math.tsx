import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av'; // Импорт для работы со звуком


const MathGameScreen = () => {
  const { level, totalExamples } = useLocalSearchParams();
  const [currentExample, setCurrentExample] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null); // Для воспроизведения звука


  // Загрузка звукового файла
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/error_sound.mp3') // Укажите путь к вашему звуковому файлу
        );
        setSound(sound);
      } catch (error) {
        console.error('Ошибка загрузки звука:', error);
      }
      console.log("Уровень установлен: ", level, " ", totalExamples)
    };


    loadSound();


    return () => {
      if (sound) {
        sound.unloadAsync(); // Выгрузка звука при размонтировании компонента
      }
    };
  }, []);


  // Воспроизведение звука
  const playErrorSound = async () => {
    if (sound) {
      try {
        await sound.replayAsync(); // Воспроизведение звука
      } catch (error) {
        console.error('Ошибка воспроизведения звука:', error);
      }
    }
  };


  // Генерация примера в зависимости от уровня сложности
  const generateExample = () => {
    let example = '';
    let answer = 0;
    if (level === 'Легкий') {
      const num1 = Math.floor(Math.random() * 90) + 10; // Двузначное число
      const num2 = Math.floor(Math.random() * 9) + 1; // Однозначное число
      example = `${num1} + ${num2}`;
      answer = num1 + num2;
    } else if (level === 'Средний') {
      const num1 = Math.floor(Math.random() * 90) + 10; // Двузначное число
      const num2 = Math.floor(Math.random() * 90) + 10; // Двузначное число
      const num3 = Math.floor(Math.random() * 90) + 10; // Двузначное число
      example = `${num1} + ${num2} + ${num3}`;
      answer = num1 + num2 + num3;
    } else if (level === 'Сложный') {
      const num1 = Math.floor(Math.random() * 90) + 10; // Двузначное число
      const num2 = Math.floor(Math.random() * 9) + 1; // Однозначное число
      example = `${num1} * ${num2}`;
      answer = num1 * num2;
    }

    console.log("Уровень реальный: ", level, " ", totalExamples)
    setCurrentExample(example);
    setCorrectAnswer(answer);
    setUserAnswer('');
  };


  // Проверка ответа пользователя
  const checkAnswer = async () => {
    const userAnswerNumber = parseInt(userAnswer, 10);
    if (userAnswerNumber === correctAnswer) {
      setSolvedCount((prev) => prev + 1);


      const totalExamplesNumber = parseInt(totalExamples.toString(), 10);
      if (solvedCount + 1 >= totalExamplesNumber) {
        Alert.alert('Победа!', 'Вы решили все примеры!');
        router.back();
      } else {
        generateExample();
        setTimeLeft(60); // Сброс таймера
      }
    } else {
      await playErrorSound(); // Воспроизведение звука ошибки
      Alert.alert('Ошибка', 'Неправильный ответ!');
      generateExample();
      setTimeLeft(60); // Сброс таймера
    }
  };


  // Таймер
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      playErrorSound(); // Воспроизведение звука при окончании времени
      Alert.alert('Время вышло!', 'Попробуйте еще раз.');
      generateExample();
      setTimeLeft(60); // Сброс таймера
    }
  }, [timeLeft]);


  // Генерация первого примера при загрузке
  useEffect(() => {
    generateExample();
  }, []);


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Математические примеры</Text>
      </View>


      <View style={styles.content}>
        <Text style={styles.remainingText}>
          Осталось примеров: {parseInt(totalExamples.toString(), 10) - solvedCount}
        </Text>
        <Text style={styles.timerText}>Осталось времени: {timeLeft} сек</Text>
        <Text style={styles.exampleText}>{currentExample}</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите ответ"
          keyboardType="numeric"
          value={userAnswer}
          onChangeText={setUserAnswer}
        />
        <TouchableOpacity style={styles.submitButton} onPress={checkAnswer}>
          <Text style={styles.submitButtonText}>Проверить</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: 50, // Отступ для iPhone
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
  remainingText: {
    fontSize: 18,
    color: '#1A293C',
    fontFamily: 'Inter',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 18,
    color: '#1A293C',
    fontFamily: 'Inter',
    marginBottom: 20,
  },
  exampleText: {
    fontSize: 32,
    color: '#1A293C',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 15,
    borderWidth: 2,
    borderColor: '#6B9080',
    borderRadius: 10,
    fontSize: 18,
    fontFamily: 'Inter',
    color: '#1A293C',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6B9080',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
});


export default MathGameScreen;