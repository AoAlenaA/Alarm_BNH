import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Импорт иконок


function LevelScreen() {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [exampleCount, setExampleCount] = useState<string>('');
  const router = useRouter();
  const {selectedScreen } = useLocalSearchParams();


  const handleDifficultyPress = (level: string) => {
    setDifficulty(level);
  };

  const handleCancelPress = () => {
    router.back();
  };

  const handleSavePress = () => {
    if (difficulty !== null && exampleCount !== '') {
      const count = parseInt(exampleCount, 10);
      if (count > 0) {
        router.push({
          pathname: '/alarm_creator',
          params: { level: difficulty, totalExamples: exampleCount, selectedScreen: selectedScreen },
        });
        console.log(selectedScreen)
      } else {
        Alert.alert('Ошибка', 'Количество примеров должно быть больше 0.');
      }
    } else {
      Alert.alert('Ошибка', 'Пожалуйста, выберите уровень сложности и введите количество примеров.');
    }
  };

  const showHint = (level: string) => {
    let message = '';
    switch (level) {
      case 'Легкий':
        message = 'Пример задания: 15+7';
        break;
      case 'Средний':
        message = 'Пример задания: 34+17+90';
        break;
      case 'Сложный':
        message = 'Пример задания: 67*3';
        break;
      default:
        message = 'Нет подсказки для этого уровня';
    }

    Alert.alert(`Уровень сложности: ${level}`, message);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Выберите уровень сложности</Text>
      </View>

      {/* Кнопки выбора уровня сложности */}
      <View style={styles.difficultyButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            difficulty === 'Легкий' && styles.difficultyButtonSelected,
          ]}
          onPress={() => handleDifficultyPress('Легкий')}
        >
          <Text style={[
            styles.difficultyButtonText,
            difficulty === 'Легкий' && styles.difficultyButtonTextSelected,
          ]}>
            Легкий
          </Text>
          <TouchableOpacity onPress={() => showHint('Легкий')} style={styles.hintButton}>
            <Ionicons name="help-circle-outline" size={24} color="#1A293C" />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            difficulty === 'Средний' && styles.difficultyButtonSelected,
          ]}
          onPress={() => handleDifficultyPress('Средний')}
        >
          <Text style={[
            styles.difficultyButtonText,
            difficulty === 'Средний' && styles.difficultyButtonTextSelected,
          ]}>
            Средний
          </Text>
          <TouchableOpacity onPress={() => showHint('Средний')} style={styles.hintButton}>
            <Ionicons name="help-circle-outline" size={24} color="#1A293C" />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            difficulty === 'Сложный' && styles.difficultyButtonSelected,
          ]}
          onPress={() => handleDifficultyPress('Сложный')}
        >
          <Text style={[
            styles.difficultyButtonText,
            difficulty === 'Сложный' && styles.difficultyButtonTextSelected,
          ]}>
            Сложный
          </Text>
          <TouchableOpacity onPress={() => showHint('Сложный')} style={styles.hintButton}>
            <Ionicons name="help-circle-outline" size={24} color="#1A293C" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Поле ввода количества примеров */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Количество примеров"
          keyboardType="numeric"
          value={exampleCount}
          onChangeText={setExampleCount} />
      </View>

      {/* Кнопки "Отмена" и "Далее" */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={[styles.bottomButton, styles.cancelButton]} onPress={handleCancelPress}>
          <Text style={styles.bottomButtonText}>Отмена</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.saveButton]} onPress={handleSavePress}>
          <Text style={styles.bottomButtonText}>Далее</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCE3DE',
  },
  header: {
    backgroundColor: '#6B9080',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Отступ для iPhone
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  difficultyButtonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  difficultyButton: {
    backgroundColor: '#6B9080',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyButtonSelected: {
    backgroundColor: '#A4C3B2', // Цвет выделенной кнопки
  },
  difficultyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  difficultyButtonTextSelected: {
    color: '#000', // Черный цвет для выбранной кнопки
  },
  hintButton: {
    marginLeft: 10,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 2,
    borderColor: '#6B9080',
    borderRadius: 20,
    fontSize: 18,
    fontFamily: 'Inter',
    color: '#1A293C',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#CCE3DE',
    borderRadius: 20,
  },
  bottomButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6B9080',
  },
  saveButton: {
    backgroundColor: '#6B9080',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
});

export default LevelScreen;