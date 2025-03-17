import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform } from "react-native";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "./lib/supabase";



// Определите тип для объекта melodiesAudio
type MelodiesAudio = {
    [key: number]: any; // Ключи могут быть числами
};

// Создайте объект для хранения аудиофайлов
const melodiesAudio: MelodiesAudio = {
    1: require('../assets/1.mp3'),
    2: require('../assets/2.mp3'),
    3: require('../assets/3.mp3'),
    4: require('../assets/4.mp3'),
    5: require('../assets/5.mp3'),
    6: require('../assets/6.mp3'),
    7: require('../assets/7.mp3'),
    8: require('../assets/8.mp3'),
    9: require('../assets/9.mp3'),
    10: require('../assets/10.mp3'),
    11: require('../assets/11.mp3'),
    12: require('../assets/12.mp3'),
    13: require('../assets/13.mp3'),
    14: require('../assets/14.mp3'),
    15: require('../assets/15.mp3'),
    16: require('../assets/16.mp3'),
    17: require('../assets/17.mp3'),
    18: require('../assets/18.mp3'),
    19: require('../assets/19.mp3'),
    20: require('../assets/20.mp3'),
    
};

type Melody = {
    Ring_id: number;
    Ring_category_id: number;
    Ring: string;
};

export default function MelodySelection() {
    const [melodies, setMelodies] = useState<Melody[]>([]);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [selectedMelody, setSelectedMelody] = useState<number | null>(null);
    const router = useRouter();
    const { categoryId } = useLocalSearchParams();

    useEffect(() => {
        fetchMelodies();
    }, [categoryId]);

    const fetchMelodies = async () => {
        const { data, error } = await supabase
            .from('Rings')
            .select('*')
            .eq('Ring_category_id', categoryId);
        if (error) {
            console.error("Error fetching melodies:", error);
        } else {
            setMelodies(data as Melody[]);
        }
    };

    const playSound = async (melodyId: number) => {
        if (sound) {
            await sound.unloadAsync(); // Остановить и выгрузить предыдущий звук
        }

        try {
            const audioSource = melodiesAudio[melodyId]; // Получаем аудиофайл по ID
            if (!audioSource) {
                console.error('Аудиофайл не найден');
                return;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(audioSource);
            setSound(newSound);
            await newSound.playAsync(); // Воспроизвести звук
        } catch (error) {
            console.error('Ошибка загрузки или воспроизведения звука:', error);
        }
    };

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync(); // Выгрузить звук при размонтировании компонента
            }
        };
    }, [sound]);

    const handleSave = () => {
        if (selectedMelody) {
            const selectedMelodyText = melodies.find(m => m.Ring_id === selectedMelody)?.Ring;
            router.push({ pathname: "/alarm_creator", params: { melody: selectedMelodyText } });
        } else {
            alert("Пожалуйста, выберите мелодию");
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Выберите мелодию</Text>

            <FlatList
                data={melodies}
                keyExtractor={(item) => item.Ring_id.toString()}
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.melodyItem,
                            selectedMelody === item.Ring_id && styles.selectedMelodyItem,
                        ]}
                        onPress={() => {
                            setSelectedMelody(item.Ring_id);
                            playSound(item.Ring_id);
                        }}
                    >
                        <Text style={styles.melodyText}>{item.Ring}</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>Сохранить</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#CCE3DE',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#6B9080',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? 50 : 20,
        marginBottom: 20,
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    melodyItem: {
        padding: 20,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#6B9080',
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    selectedMelodyItem: {
        backgroundColor: '#A6CEC5',
    },
    melodyText: {
        fontSize: 18,
        color: '#1A293C',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#6B9080',
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#6B9080',
        borderRadius: 10,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});