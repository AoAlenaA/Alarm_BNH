import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Alert, TouchableOpacity, BackHandler } from 'react-native';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import * as SystemUI from 'expo-system-ui'; 

interface BallProps {
  top: number;
  left: number;
  size: number;
  color: string;
  onPress: () => void;
}


const Ball: React.FC<BallProps> = ({ top, left, size, color, onPress }) => (
  <TouchableOpacity
    style={[styles.ball, { top, left, width: size, height: size, backgroundColor: color }]}
    onPress={onPress}
  />
);


const { width, height } = Dimensions.get('window');

const Game = () => {
  const { targetScore } = useLocalSearchParams();
  const [balls, setBalls] = useState<{ id: string; top: number; left: number; size: number; color: string; speed: number }[]>([]);
  const [score, setScore] = useState(0);
  const [missedBalls, setMissedBalls] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/error_sound.mp3')
        );
        setSound(sound);
      } catch (error) {
        console.error('Ошибка загрузки звука:', error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playErrorSound = async () => {
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.error('Ошибка воспроизведения звука:', error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newBall = {
        id: Math.random().toString(),
        top: 100,
        left: Math.random() * (width - 50),
        size: Math.random() * 50 + 20,
        color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        speed: Math.random() * 5 + 2,
      };
      setBalls((prevBalls) => [...prevBalls, newBall]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const moveBalls = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls
          .map((ball) => ({
            ...ball,
            top: ball.top + ball.speed,
          }))
          .filter((ball) => {
            if (ball.top >= height) {
              setMissedBalls((prev) => prev + 1);
              return false;
            }
            return true;
          })
      );
    }, 16);

    return () => clearInterval(moveBalls);
  }, []);

  const handleBallPress = (id: string) => {
    setBalls((prevBalls) => prevBalls.filter((ball) => ball.id !== id));
    setScore((prevScore) => prevScore + 1);
  };

  useEffect(() => {
    if (score >= Number(targetScore)) {
      Alert.alert('Победа!', 'Вы успешно прошли игру!', [
      { text: 'OK', onPress: () => BackHandler.exitApp() }]);
    }
  }, [score, targetScore]);

  useEffect(() => {
    if (missedBalls == 10) {
      playErrorSound();
      setScore(0);
      setMissedBalls(0);
      setBalls([]);
    }
  }, [missedBalls]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>Осталось очков: {Number(targetScore) - score}</Text>
        <Text style={styles.missedBalls}>Пропущено шаров: {missedBalls}/10</Text>
      </View>
      {balls.map((ball) => (
        <Ball
          key={ball.id}
          top={ball.top}
          left={ball.left}
          size={ball.size}
          color={ball.color}
          onPress={() => handleBallPress(ball.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCE3DE',
  },
  scoreContainer: {
    padding: 20,
    backgroundColor: '#6B9080',
    alignItems: 'center',
  },
  score: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: 'bold',
  },
  missedBalls: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Inter',
    marginTop: 10,
  },
  ball: {
    position: 'absolute',
    borderRadius: 50,
  },
});

export default Game;