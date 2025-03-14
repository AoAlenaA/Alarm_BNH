import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        console.log('Login attempt:', email);
        const { data: personData, error: personError } = await supabase
          .from('Person')
          .select('*')
          .eq('Login', email)
          .eq('Password', password);

        console.log('Query result:', personData);

        if (personError) throw personError;
        
        if (!personData  || personData.length === 0) {
          throw new Error('Неверный логин или пароль');
        }
        
        const user = personData[0];
        
        await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        // Сохраняем токен
        await AsyncStorage.setItem('userToken', 'authenticated');
        Alert.alert('Успех', 'Вход выполнен успешно', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]);
        
      } else {
        const { data: existingUser } = await supabase
          .from('Person')
          .select('*')
          .eq('Login', email)
          .single();

        if (existingUser) {
          throw new Error('Пользователь с таким email уже существует');
        }

        const { data: newPerson, error: insertError } = await supabase
          .from('Person')
          .insert([
            {
              Login: email,
              Password: password,
              Setting_id: null
            }
          ])
          .select();

        if (insertError) throw insertError;

        await supabase.auth.signUp({
          email: email,
          password: password,
        });

        // Сохраняем токен
        await AsyncStorage.setItem('userToken', 'authenticated');
        Alert.alert('Успех', 'Регистрация прошла успешно', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]);
      }
    } catch (error: any) {
      console.error('Error details:', error);
      Alert.alert('Ошибка', error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#6B9080"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#CCE3DE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#6B9080',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#6B9080',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
});