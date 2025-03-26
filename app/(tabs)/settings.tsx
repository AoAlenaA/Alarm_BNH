import { Text, View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import * as Notifications from 'expo-notifications';

export default function Settings() {
  const handleDeleteAllNotifications = async () => {
    await cancelAllNotifications();
  };

  const performLogout = async () => {
    handleDeleteAllNotifications();
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

  async function cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Все уведомления успешно удалены.');
    } catch (error) {
      console.error('Ошибка при удалении уведомлений:', error);
    }
  }

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

  const showAppInfo = () => {
    Alert.alert(
      'О приложении',
      'Разработчики: Анучина А.О., Белослудцева К.Д. и Харитонова В.В.\nВерсия приложения: 1\nРазработано в 2025 году',
      [
        {
          text: 'OK',
          style: 'default'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      
      <View style={styles.settingsContainer}>
        <Text style={styles.welcomeText}>Добро пожаловать в приложение "Пока вставать!"</Text>
        
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={showAppInfo}
        >
          <Text style={styles.infoButtonText}>О приложении</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Добавляем отступ для iPhone
    marginBottom: 20,
    textAlign: 'center'
  },
  settingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    color: '#1A293C',
    fontFamily: "Inter",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 30
  },
  infoButton: {
    backgroundColor: '#6B9080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    marginBottom: 20
  },
  infoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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