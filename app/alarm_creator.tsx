import React, { useState } from "react";
import { TimerPicker } from "react-native-timer-picker";
import MaskedView from "@react-native-masked-view/masked-view"; // for transparent fade-out
import { LinearGradient } from "expo-linear-gradient"; // or `import LinearGradient from "react-native-linear-gradient"`
import { Audio } from "expo-av"; // for audio feedback (click sound as you scroll)
import * as Haptics from "expo-haptics"; // for haptic feedback
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Link } from "expo-router";


export default function App() {
    const [showPicker, setShowPicker] = useState(false);
    const [alarmString, setAlarmString] = useState<
        string | null
    >(null);
    const [date, setDate] = useState(new Date())

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
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
                        styles={{
                            theme: "light",
                            backgroundColor: "transparent", // transparent fade-out
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


            <View style={styles.containerOptions}>
                {/* Выбор даты */}
                <TouchableOpacity style={styles.option} onPress={showDatePicker} >
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker} />
                    <Text style={styles.optionText}>Дата</Text>
                    <Text style={styles.optionSubtext}>8 марта</Text>
                </TouchableOpacity>
                {/* Название будильника */}
                    <TextInput
                        style={styles.input}
                        placeholder="Название будильника"
                    />

                {/* Выбор игры */}
                <Link href="/choose_game" asChild>
                    <TouchableOpacity style={styles.option} >
                        <Text style={styles.optionText}>Способ пробуждения</Text>
                        <Text style={styles.optionSubtext}>Игра</Text>
                    </TouchableOpacity>
                </Link>

                

                {/* Выбор звука */}
                <Link href='/alarm_music' asChild>
                    <TouchableOpacity style={styles.option} >
                        <Text style={styles.optionText}>Звук будильника</Text>
                        <Text style={styles.optionSubtext}>Homecoming</Text>
                    </TouchableOpacity>
                </Link>

                {/* Вибрация */}
                <Link href='/alarm_vibration' asChild>
                    <TouchableOpacity style={styles.option} >
                        <Text style={styles.optionText}>Вибрация</Text>
                        <Text style={styles.optionSubtext}>Basic Call</Text>
                    </TouchableOpacity>
                </Link>

                {/* Кнопки */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonTextCancel}>Отмена</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonTextSave}>Сохранить</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCE3DE',
    },

    buttonContainer: { 
        flex:1,
        flexDirection: "row", 
        justifyContent: "space-between", 
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#CCE3DE',
    },
    button: {
        margin:20,
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
        fontSize: 14,
    },
    buttonTextSave: {
        color: '#fff',
        fontFamily: "Inter",
        fontWeight: "bold",
        fontSize: 14,
    },
    containerOptions:
    {
        flex: 1,
        backgroundColor: '#CCE3DE',
        padding:15

    },

    label: { fontSize: 16, color: "#888" },
    input: { borderBottomWidth: 1, borderColor: "#ddd", fontSize: 18,   marginBottom: 20 },
    option: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderColor: "#ddd" },
    optionText: { fontSize: 18 },
    optionSubtext: { fontSize: 16, color: "#888" },
    
    screen: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
    header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});

