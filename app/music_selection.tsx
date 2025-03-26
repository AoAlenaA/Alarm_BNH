import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, StatusBar, ScrollView } from "react-native";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "./lib/supabase";
import { Ionicons } from '@expo/vector-icons';

// Определите тип для объекта melodiesAudio
type MelodiesAudio = {
    [key: number]: any;
};

// Создайте объект для хранения аудиофайлов
const melodiesAudio: MelodiesAudio = {
    1: require('../assets/sounds/sound_1.mp3'),
    2: require('../assets/sounds/sound_2.mp3'),
    3: require('../assets/sounds/sound_3.mp3'),
    4: require('../assets/sounds/sound_4.mp3'),
    5: require('../assets/sounds/sound_5.mp3'),
    6: require('../assets/sounds/sound_6.mp3'),
    7: require('../assets/sounds/sound_7.mp3'),
    8: require('../assets/sounds/sound_8.mp3'),
    9: require('../assets/sounds/sound_9.mp3'),
    10: require('../assets/sounds/sound_10.mp3'),
    11: require('../assets/sounds/sound_11.mp3'),
    12: require('../assets/sounds/sound_12.mp3'),
    13: require('../assets/sounds/sound_13.mp3'),
    14: require('../assets/sounds/sound_14.mp3'),
    15: require('../assets/sounds/sound_15.mp3'),
    16: require('../assets/sounds/sound_16.mp3'),
    17: require('../assets/sounds/sound_17.mp3'),
    18: require('../assets/sounds/sound_18.mp3'),
    19: require('../assets/sounds/sound_19.mp3'),
    20: require('../assets/sounds/sound_20.mp3'),
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
    const { categoryId, selectedScreen, level, totalExamples } = useLocalSearchParams();

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
            await sound.unloadAsync();
        }

        try {
            const audioSource = melodiesAudio[melodyId];
            if (!audioSource) {
                console.error('Аудиофайл не найден');
                return;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(audioSource);
            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.error('Ошибка загрузки или воспроизведения звука:', error);
        }
    };

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const handleSave = async () => {
        if (selectedMelody) {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }
    
            const selectedMelodyText = melodies.find(m => m.Ring_id === selectedMelody)?.Ring;
            router.push({
                pathname: "/alarm_creator",
                params: {
                    melody: selectedMelodyText,
                    melodyPath: `sound_${selectedMelody}.mp3`,
                    selectedScreen: selectedScreen, 
                    level: level,
                    totalExamples: totalExamples,
                },
            });
        } else {
            alert("Пожалуйста, выберите мелодию");
        }
    };

    const handleCancel = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }
        router.back();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerText}>Выберите мелодию</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.buttonContainer}>
                    <FlatList
                        data={melodies}
                        keyExtractor={(item) => item.Ring_id.toString()}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    selectedMelody === item.Ring_id && styles.buttonSelected,
                                ]}
                                onPress={() => {
                                    setSelectedMelody(item.Ring_id);
                                    playSound(item.Ring_id);
                                }}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    selectedMelody === item.Ring_id && styles.buttonTextSelected
                                ]}>
                                    {item.Ring}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </ScrollView>

            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity style={[styles.bottomButton, styles.cancelButton]} onPress={handleCancel}>
                    <Text style={styles.bottomButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bottomButton, styles.nextButton]} onPress={handleSave}>
                    <Text style={styles.bottomButtonText}>Сохранить</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
    },
    buttonSelected: {
        backgroundColor: '#A4C3B2',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        textAlign: 'center',
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