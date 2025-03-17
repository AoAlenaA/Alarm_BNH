import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const StepsSelectionScreen = () => {
  const [stepCount, setStepCount] = useState<string>('');
  const router = useRouter();
  const {selectedScreen } = useLocalSearchParams();

  function handleSavePress() {
    const count = parseInt(stepCount, 10);
    if (count > 0 && count <= 10000) {
      router.push({
        pathname: '/alarm_creator',
        params: { selectedScreen: selectedScreen, totalExamples: stepCount},
      });
    } else {
      Alert.alert('Ошибка', 'Введите число от 1 до 100.');
    }
  }

  const handleCancelPress = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Выберите количество шагов</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Количество шагов (1-100)"
          keyboardType="numeric"
          value={stepCount}
          onChangeText={setStepCount}
        />
      </View>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={[styles.bottomButton, styles.cancelButton]} onPress={handleCancelPress}>
          <Text style={styles.bottomButtonText}>Отмена</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.saveButton]} onPress={handleSavePress}>
          <Text style={styles.bottomButtonText}>Сохранить</Text>
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
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#6B9080',
    borderRadius: 10,
    marginBottom: 20, // Отступ снизу для клавиатуры
  },
  bottomButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#A4C3B2',
  },
  saveButton: {
    backgroundColor: '#A4C3B2',
  },
  bottomButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    color: '#fff',
  },
});

export default StepsSelectionScreen;