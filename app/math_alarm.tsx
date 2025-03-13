import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

export default function MathAlarm() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Решите пример, чтобы выключить будильник</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Выключить будильник</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCE3DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#1A293C',
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#6B9080",
    alignItems: "center",
  },
  buttonText: {
    color: '#fff',
    fontFamily: "Inter",
    fontWeight: "bold",
    fontSize: 18,
  },
});
