import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const Index = () => {
  const [inputScore, setInputScore] = useState('');
  const {selectedScreen } = useLocalSearchParams();

  function handleStartGame() {
        const parsedScore = parseInt(inputScore, 10);
        if (parsedScore > 0) {
            router.push({ pathname: '/alarm_creator', params: { selectedScreen: selectedScreen, totalExamples: parsedScore.toString() } });
        } else {
            Alert.alert('Ошибка', 'Введите корректное количество очков.');
        }
    }

  return (
    <View style={styles.container}>
      <Text style={styles.rules}>
        Правила игры: Ловите шары, нажимая на них. Игра идет до выбранного количества очков. Счет идет в обратную сторону от выбранного количества очков до 0. Если вы пропустите 10 шаров, игра начнется заново.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Введите количество очков"
        placeholderTextColor="#73827A"
        keyboardType="numeric"
        value={inputScore}
        onChangeText={setInputScore}
      />
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonTextSave}>Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#CCE3DE',
  },
  rules: {
    fontSize: 18,
    color: '#1A293C',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#6B9080',
    fontSize: 18,
    marginBottom: 20,
    paddingVertical: 10,
    fontFamily: 'Inter',
    color: '#1A293C',
  },
  button: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#6B9080',
    alignItems: 'center',
  },
  buttonTextSave: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Index;