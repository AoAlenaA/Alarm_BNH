import React, { useState } from "react";
import { TimerPicker } from "react-native-timer-picker";
import MaskedView from "@react-native-masked-view/masked-view"; // for transparent fade-out
import { LinearGradient } from "expo-linear-gradient"; // or `import LinearGradient from "react-native-linear-gradient"`
import { Audio } from "expo-av"; // for audio feedback (click sound as you scroll)
import * as Haptics from "expo-haptics"; // for haptic feedback
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useRouter for navigation
import { sendNotification} from './notifications';


export default function App() {
    
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const { level, totalExamples, selectedScreen, melody, melodyPath } = useLocalSearchParams();
    const router = useRouter(); // Initialize router for navigation

    const handleSave = () => {
        if (!selectedScreen) {
            Alert.alert("Ошибка", "Пожалуйста, выберите способ пробуждения.");
            return;
        }
        if (!melody) {
            Alert.alert("Ошибка", "Пожалуйста, выберите звук будильника.");
            return;
        }

        const melodyPathTrue = melodyPath.toString()
        console.log(melodyPathTrue)
        sendNotification(time, selectedScreen, level, totalExamples, melodyPathTrue);
        console.log("Уведомление с парметрами:",time, selectedScreen, level, melodyPathTrue, totalExamples)
        router.push('/(tabs)');

    };

    const handleCancel = () => {
        router.back();
    };


    return (
        <SafeAreaView style={styles.container}>
            {/* Выбор времени */}
            <View>
                <LinearGradient
                    colors={["#809291", "#A6CEC5"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ alignItems: "center", justifyContent: "center" }}>
                    <TimerPicker
                        padWithNItems={2}
                        hourLabel=":"
                        minuteLabel=":"
                        secondLabel=""
                        Audio={Audio}
                        LinearGradient={LinearGradient}
                        Haptics={Haptics}
                        MaskedView={MaskedView}
                        onDurationChange={({ hours, minutes, seconds }) => {
                            setTime({ hours, minutes, seconds });
                        }}
                        styles={{
                            theme: "light",
                            backgroundColor: "transparent",
                            pickerItem: {
                                fontSize: 34,
                            },
                            pickerLabel: {
                                fontSize: 32,
                                marginTop: 0,
                            },
                            pickerContainer: {
                                marginRight: 6,
                            },
                            pickerItemContainer: {
                                width: 100
                            },
                            pickerLabelContainer: {
                                right: -20,
                                top: 0,
                                bottom: 6,
                                width: 40,
                                alignItems: "center",
                            },
                        }}
                    />
                </LinearGradient>
            </View>

            {/* Остальные элементы */}
            <View style={styles.containerOptions}>
                <TextInput
                    style={styles.input}
                    placeholder="Название будильника"
                />
                <Link href={{
                            pathname: '/choose_game',
                            params: { melody, melodyPath}, // Передаем параметры игры
                        }} asChild>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.text}>Способ пробуждения</Text>
                        <Text style={styles.optionSubtext}>{selectedScreen || "Не выбрано"}</Text>
                    </TouchableOpacity>
                </Link>


                <Link  href={{
                            pathname: '/music_category',
                            params: { selectedScreen, level, totalExamples }, // Передаем параметры игры
                        }} asChild>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.text}>Звук будильника</Text>
                        <Text style={styles.optionSubtext}>{melody || "Не выбрано"}</Text>
                    </TouchableOpacity>
                </Link>
            </View>


            {/* Кнопки */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                    <Text style={styles.buttonTextCancel}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonTextSave}>Сохранить</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCE3DE',
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#CCE3DE',
    },
    button: {
        margin: 20,
        flex: 1,
        padding: 15,
        borderRadius: 20,
        backgroundColor: "#6B9080",
        alignItems: "center",
        marginRight: 10
    },
    buttonTextCancel: {
        color: '#1A293C',
        fontFamily: "Inter",
        fontWeight: "bold",
        fontSize: 18,
    },
    buttonTextSave: {
        color: '#fff',
        fontFamily: "Inter",
        fontWeight: "bold",
        fontSize: 18,
    },
    containerOptions: {
        flex: 1,
        backgroundColor: '#CCE3DE',
        padding: 15,
        justifyContent: "flex-start",
    },
    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderBottomWidth: 2,
        borderColor: "#6B9080",
    },
    input: {
        borderBottomWidth: 2,
        borderColor: "#6B9080",
        fontSize: 18,
        marginBottom: 20,
        paddingVertical: 10,
        fontFamily: "Inter",
        color: "#73827A",
    },
    text: {
        color: '#1A293C',
        fontFamily: "Inter",
        fontSize: 18,
    },
    optionSubtext: {
        fontSize: 12,
        color: "#73827A",
        fontFamily: "Inter",
    },
    repeatTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
    },
    repeatButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#6B9080',
    },
    activeRepeat: {
        backgroundColor: '#6B9080',
    },
    repeatButtonText: {
        color: '#1A293C',
        fontSize: 16,
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 10,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        backgroundColor: '#F6FFF8',
        borderWidth: 1,
        borderColor: '#6B9080',
    },
    selectedDay: {
        backgroundColor: '#6B9080',
    },
    dayText: {
        color: '#1A293C',
        fontSize: 16,
    },
    datePickerButton: {
        margin: 15,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#F6FFF8',
        alignItems: 'center',
    },
    datePickerText: {
        color: '#1A293C',
        fontSize: 16,
    },
});