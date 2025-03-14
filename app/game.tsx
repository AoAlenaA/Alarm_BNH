import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, Alert, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

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

const App = () => {
  const [balls, setBalls] = useState<{ id: string; top: number; left: number; size: number; color: string; speed: number }[]>([]);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [inputScore, setInputScore] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [missedBalls, setMissedBalls] = useState(0); // Счетчик пропущенных шаров

  useEffect(() => {
    if (gameStarted && targetScore !== null) {
      const interval = setInterval(() => {
        const newBall = {
          id: Math.random().toString(),
          top: 0,
          left: Math.random() * (width - 50),
          size: Math.random() * 50 + 20,
          color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
          speed: Math.random() * 5 + 2,
        };
        setBalls((prevBalls) => [...prevBalls, newBall]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStarted, targetScore]);

  useEffect(() => {
    if (gameStarted && targetScore !== null) {
      const moveBalls = setInterval(() => {
        setBalls((prevBalls) =>
          prevBalls
            .map((ball) => ({
              ...ball,
              top: ball.top + ball.speed,
            }))
            .filter((ball) => {
              if (ball.top >= height) {
                setMissedBalls((prev) => prev + 1); // Увеличиваем счетчик пропущенных шаров
                return false;
              }
              return true;
            })
        );
      }, 16);

      return () => clearInterval(moveBalls);
    }
  }, [gameStarted, targetScore]);

  const handleBallPress = (id: string) => {
    setBalls((prevBalls) => prevBalls.filter((ball) => ball.id !== id));
    setScore((prevScore) => prevScore + 1);
  };

  const handleStartGame = () => {
    const parsedScore = parseInt(inputScore, 10);
    if (parsedScore > 0) {
      setTargetScore(parsedScore);
      setScore(0);
      setMissedBalls(0); // Сбрасываем счетчик пропущенных шаров
      setGameStarted(true);
    } else {
      Alert.alert('Ошибка', 'Введите корректное количество очков.');
    }
  };

  useEffect(() => {
    if (gameStarted && targetScore !== null && score >= targetScore) {
      Alert.alert('Победа!', 'Вы набрали нужное количество очков!');
      setGameStarted(false);
      setTargetScore(null);
      setBalls([]);
      setMissedBalls(0); // Сбрасываем счетчик пропущенных шаров
    }
  }, [score, targetScore, gameStarted]);

  useEffect(() => {
    if (missedBalls >= 10) {
      // Перезапуск игры без показа правил
      setScore(0);
      setMissedBalls(0);
      setBalls([]);
    }
  }, [missedBalls]);

  return (
    <View style={styles.container}>
      <StatusBar hidden /> {/* Скрываем статус-бар (надпись "game" вверху экрана) */}
      {!gameStarted ? (
        <View style={styles.menu}>
          <Text style={styles.rules}>
            Правила игры: Ловите шары, нажимая на них. Игра идет до выбранного количества очков. Счет идет в обратную сторону от выбранного количества очков до 0. Если вы пропустите 10 шаров, игра начнется заново.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Введите количество очков"
            placeholderTextColor="#73827A"
            keyboardType="numeric"
            value={inputScore}
            onChangeText={setInputScore}
          />
          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonTextSave}>Начать игру</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>Осталось очков: {targetScore! - score}</Text>
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCE3DE',
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  rules: {
    fontSize: 18,
    color: '#1A293C',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#6B9080',
    fontSize: 18,
    marginBottom: 20,
    paddingVertical: 10,
    fontFamily: 'Inter',
    color: '#1A293C',
  },
  button: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#6B9080',
    alignItems: 'center',
  },
  buttonTextSave: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 18,
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

export default App;