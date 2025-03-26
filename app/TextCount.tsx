import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

const TextCountSelection = () => {
  const [textCount, setTextCount] = useState<string>('');
  const router = useRouter();
  const { selectedScreen } = useLocalSearchParams();
  const { melody, melodyPath } = useLocalSearchParams();

  function handleNextPress() {
    const count = parseInt(textCount, 10);
    if (count >= 1 && count <= 20) {
      router.push({
        pathname: '/alarm_creator',
        params: { 
          selectedScreen: selectedScreen, 
          totalExamples: count, 
          melody: melody,
          melodyPath: melodyPath
        },
      });
    } else {
      Alert.alert('Ошибка', 'Введите число от 1 до 20.');
    }
  }

  const handleCancelPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Выберите количество текстов</Text>
          </View>

          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder="Количество текстов (1-20)"
              keyboardType="numeric"
              value={textCount}
              onChangeText={setTextCount}
            />
          </View>

          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity style={[styles.bottomButton, styles.cancelButton]} onPress={handleCancelPress}>
              <Text style={styles.bottomButtonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bottomButton, styles.nextButton]} onPress={handleNextPress}>
              <Text style={styles.bottomButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#CCE3DE',
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
    marginBottom: 20,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#CCE3DE',
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
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    color: '#fff',
  },
});

export default TextCountSelection;