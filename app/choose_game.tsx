import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Импорт иконок


const App = () => {
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const router = useRouter();


  const handleButtonPress = (index: string) => {
    setSelectedIndex(index);
  };


  const handleCancelPress = () => {
    router.push('/alarm_creator');
  };


  const handleNextPress = () => {
    if (selectedIndex === "Решение примеров") {
      router.push({
        pathname: '/level',
        params: { selectedIndex: selectedIndex },
      });
    } else if (selectedIndex === "Прохождение шагов") {
      router.push('../stepSelection');
    } else if (selectedIndex === "Сканирование QR-кода") {
      router.push('/game');
    } else {
      if (selectedIndex === null) {
        alert('Пожалуйста, выберите способ пробуждения');
      } else {
        if (selectedIndex === "Игра") {
          router.push({
            pathname: '/game',
          });
        } else if (selectedIndex === "Запись текста") {
          router.push({
            pathname: '/TextCount',
          });
        } else {
          router.push('/alarm_creator');
        }
      }
    }
  };


  const showHint = (method: string) => {
    let message = '';
    switch (method) {
      case 'Игра':
        message = 'Просыпайтесь, играя в мини-игру!';
        break;
      case 'Перевод текста':
        message = 'Переведите текст, чтобы выключить будильник.';
        break;
      case 'Запись текста':
        message = 'Запишите текст, чтобы выключить будильник.';
        break;
      case 'Сканирование QR-кода':
        message = 'Отсканируйте QR-код, чтобы выключить будильник.';
        break;
      case 'Решение примеров':
        message = 'Решите примеры, чтобы выключить будильник.';
        break;
      default:
        message = 'Нет подсказки для этого метода.';
    }


    Alert.alert(`Подсказка (${method})`, message);
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Выберите способ пробуждения</Text>
      </View>


      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, selectedIndex === "Игра" && styles.buttonSelected]}
            onPress={() => handleButtonPress("Игра")}
          >
            <Text style={[styles.buttonText, selectedIndex === "Игра" && styles.buttonTextSelected]}>Игра</Text>
            <TouchableOpacity onPress={() => showHint("Игра")} style={styles.hintButton}>
              <Ionicons name="help-circle-outline" size={24} color="#1A293C" />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedIndex === "Прохождение шагов" && styles.buttonSelected]}
            onPress={() => handleButtonPress("Прохождение шагов")}
          >
            <Text style={[styles.buttonText, selectedIndex === "Прохождение шагов" && styles.buttonTextSelected]}>Прохождение шагов</Text>
            <TouchableOpacity onPress={() => showHint("Прохождение шагов")} style={styles.hintButton}>
              <Ionicons name="help-circle-outline" size={24} color="#1A293C" />
            </TouchableOpacity>
          </TouchableOpacity>
         
          <TouchableOpacity
            style={[styles.button, selectedIndex === "Запись текста" && styles.buttonSelected]}
            onPress={() => handleButtonPress("Запись текста")}
          >
            <Text style={[styles.buttonText, selectedIndex === "Запись текста" && styles.buttonTextSelected]}>Запись текста</Text>
            <TouchableOpacity onPress={() => showHint("Запись текста")} style={styles.hintButton}>
              <Ionicons name="help-circle-outline" size={24} color="#1A293C" />
            </TouchableOpacity>
          </TouchableOpacity>
        
          
          <TouchableOpacity
            style={[styles.button, selectedIndex === "Решение примеров" && styles.buttonSelected]}
            onPress={() => handleButtonPress("Решение примеров")}
          >
            <Text style={[styles.buttonText, selectedIndex === "Решение примеров" && styles.buttonTextSelected]}>Решение примеров</Text>
            <TouchableOpacity onPress={() => showHint("Решение примеров")} style={styles.hintButton}>
              <Ionicons name="help-circle-outline" size={24} color="#1A293C" />
            </TouchableOpacity>
           
          </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Добавляем отступ для iPhone
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#A4C3B2', // Цвет выделенной кнопки
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  buttonTextSelected: {
    color: '#000', // Черный цвет для выбранной кнопки
  },
  hintButton: {
    marginLeft: 10,
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


export default App;