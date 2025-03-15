import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from './lib/supabase'; // Импортируйте ваш клиент Supabase
import { Audio } from 'expo-av';

const TextInputScreen = () => {
  const { count } = useLocalSearchParams();
  const [texts, setTexts] = useState<string[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(60);
  const [errorIndex, setErrorIndex] = useState<number | null>(null); // Индекс ошибки
  const [errorText, setErrorText] = useState<string>(''); // Текст с ошибкой
  const router = useRouter();

  // Генерация уникальных случайных индексов
  const generateRandomIndexes = (count: number, max: number): number[] => {
    const indexes = new Set<number>();
    while (indexes.size < count) {
      const randomIndex = Math.floor(Math.random() * max) + 1;
      indexes.add(randomIndex);
    }
    return Array.from(indexes);
  };

  useEffect(() => {
    const fetchTexts = async () => {
      const countNumber = parseInt(count as string, 10);

      if (isNaN(countNumber)) {
        Alert.alert('Ошибка', 'Некорректное количество текстов');
        return;
      }

      // Генерация случайных индексов
      const randomIndexes = generateRandomIndexes(countNumber, 25);

      const { data, error } = await supabase
        .from('Text')
        .select('Text_text')
        .in('Text_id', randomIndexes); // Запрашиваем только нужные тексты

      if (error) {
        Alert.alert('Ошибка', 'Не удалось загрузить тексты');
        return;
      }

      setTexts(data.map((item) => item.Text_text));
    };

    fetchTexts();
  }, [count]);

  useEffect(() => {
    if (timer === 0) {
      playErrorSound();
      setCurrentTextIndex((prev) => prev + 1);
      setTimer(60);
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const playErrorSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../assets/error_sound.mp3'));
    await sound.playAsync();
  };

  const handleCheckText = () => {
    const correctText = texts[currentTextIndex];
    let mismatchIndex = -1;

    // Находим индекс первого несовпадающего символа
    for (let i = 0; i < correctText.length; i++) {
      if (userInput[i] !== correctText[i]) {
        mismatchIndex = i;
        break;
      }
    }

    if (mismatchIndex === -1 && userInput.length === correctText.length) {
      // Текст введён правильно
      if (currentTextIndex + 1 < texts.length) {
        setCurrentTextIndex((prev) => prev + 1);
        setUserInput('');
        setTimer(60);
        setErrorIndex(null); // Сбрасываем ошибку
        setErrorText(''); // Сбрасываем текст с ошибкой
      } else {
        Alert.alert('Поздравляем!', 'Вы успешно завершили задание');
        router.back();
      }
    } else {
      // Ошибка в тексте
      playErrorSound();
      setErrorIndex(mismatchIndex); // Устанавливаем индекс ошибки
      setErrorText(userInput); // Сохраняем текст с ошибкой
      setUserInput(''); // Очищаем поле ввода
      Alert.alert('Ошибка', 'Текст введен неверно, попробуйте еще раз');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Таймер: {timer} сек</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.textToCopy}>{texts[currentTextIndex]}</Text>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={(text) => {
              setUserInput(text);
              setErrorIndex(null); // Сбрасываем ошибку при изменении текста
              setErrorText(''); // Сбрасываем текст с ошибкой
            }}
            placeholder="Введите текст"
            multiline
            placeholderTextColor="#999"
          />
          {errorIndex !== null && (
            <Text style={styles.errorText}>
              {errorText.slice(0, errorIndex)}
              <Text style={{ color: 'red' }}>{errorText[errorIndex]}</Text>
              {errorText.slice(errorIndex + 1)}
            </Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.checkButton} onPress={handleCheckText}>
        <Text style={styles.checkButtonText}>Проверить</Text>
      </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textToCopy: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#6B9080',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 18, // Увеличиваем размер шрифта
  },
  checkButton: {
    backgroundColor: '#6B9080',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    margin: 20,
    alignSelf: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#000',
    marginTop: 10,
  },
});

export default TextInputScreen;