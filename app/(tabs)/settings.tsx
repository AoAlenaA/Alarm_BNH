import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const performLogout = async () => {
    try {
      // Выход из Supabase
      await supabase.auth.signOut();
      // Удаляем токен
      await AsyncStorage.removeItem('userToken');
      
      Alert.alert('Успех', 'Вы успешно вышли из аккаунта', [
        {
          text: 'OK',
          onPress: () => router.replace('/auth/AuthScreen')
        }
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Подтверждение',
      'Вы действительно хотите выйти из аккаунта?',
      [
        {
          text: 'Отмена',
          style: 'cancel'
        },
        {
          text: 'Выйти',
          onPress: performLogout,
          style: 'destructive'
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      
      <View style={styles.settingsContainer}>
        {/* Здесь можно добавить другие настройки */}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCE3DE',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#1A293C',
    fontFamily: "Inter",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center'
  },
  settingsContainer: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#6B9080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
