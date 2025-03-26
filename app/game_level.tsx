import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, ScrollView } from "react-native";

const Index = () => {
  const [inputScore, setInputScore] = useState('');
  const router = useRouter();
  const { selectedScreen } = useLocalSearchParams();
  const { melody, melodyPath } = useLocalSearchParams();

  const handleCancelPress = () => {
    router.back();
  };

  const handleStartGame = () => {
    const parsedScore = parseInt(inputScore, 10);
    if (parsedScore >= 10 && parsedScore <= 100) {
      router.push({ 
        pathname: '/alarm_creator', 
        params: { 
          selectedScreen: selectedScreen, 
          totalExamples: parsedScore.toString(),
          melody: melody,
          melodyPath: melodyPath
        } 
      });
    } else {
      Alert.alert('Ошибка', 'Введите корректное количество очков.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Выберите количество шаров</Text>
          </View>

          {/* Правила игры */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.rulesContainer}>
              <Text style={styles.rules}>
                Правила игры: Ловите шары, нажимая на них. Игра идет до выбранного количества очков. 
                Счет идет в обратную сторону от выбранного количества очков до 0. 
                Если вы пропустите 10 шаров, игра начнется заново.
              </Text>
            </View>
          </ScrollView>

          {/* Нижняя часть с полем ввода и кнопками */}
          <View style={styles.bottomSection}>
            {/* Поле ввода количества очков */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Количество очков (10 - 100)"
                placeholderTextColor="#73827A"
                keyboardType="numeric"
                value={inputScore}
                onChangeText={setInputScore}
              />
            </View>

            {/* Кнопки "Отмена" и "Сохранить" */}
            <View style={styles.bottomButtonsContainer}>
              <TouchableOpacity 
                style={[styles.bottomButton, styles.cancelButton]} 
                onPress={handleCancelPress}
              >
                <Text style={styles.bottomButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.bottomButton, styles.saveButton]} 
                onPress={handleStartGame}
              >
                <Text style={styles.bottomButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingBottom: 20,
  },
  rulesContainer: {
    padding: 20,
  },
  rules: {
    fontSize: 18,
    color: '#1A293C',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
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

export default Index;