import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TextCountSelection = () => {
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const router = useRouter();
  const {selectedScreen } = useLocalSearchParams();

  function handleCountSelect(count: number) {
    setSelectedCount(count);
  }

  const handleCancelPress = () => {
    router.back();
  };

  const handleNextPress = () => {
    if (selectedCount === null) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите количество текстов');
    } else {
      router.push({
        pathname: '/alarm_creator',
        params: { selectedScreen: selectedScreen, totalExamples: selectedCount },
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Выберите количество текстов</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.buttonContainer}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((count) => (
            <TouchableOpacity
              key={count}
              style={[styles.button, selectedCount === count && styles.buttonSelected]}
              onPress={() => handleCountSelect(count)}
            >
              <Text style={[styles.buttonText, selectedCount === count && styles.buttonTextSelected]}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={[styles.bottomButton, styles.cancelButton]} onPress={handleCancelPress}>
          <Text style={styles.bottomButtonText}>Отмена</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.nextButton]} onPress={handleNextPress}>
          <Text style={styles.bottomButtonText}>Далее</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6B9080',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#A4C3B2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  buttonTextSelected: {
    color: '#000',
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
  nextButton: {
    backgroundColor: '#6B9080',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
});

export default TextCountSelection;