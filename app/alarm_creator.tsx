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
 
    const[time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
    const [date, setDate] = useState(String)
    const [selectedDate, setSelectedDate] = useState(String);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const saveAlarm = () => {
        console.warn("A time has been picked: ", time);
        console.warn("A date has been picked: ", date);
      };
    

    const handleConfirm = (date: Date) => {
        const formattedDate1 = date.toLocaleDateString("ru-RU");
        setDate(formattedDate1)
        const formattedDate = date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long"
        }); 
        setSelectedDate(formattedDate);
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
                        onDurationChange={({ hours, minutes, seconds }) => {
                            setTime({ hours, minutes, seconds }); // Сохраняем время в состоянии
                        }}
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
                    <Text style={styles.text}>Дата</Text>
                    <Text style={styles.optionSubtext}>{selectedDate}</Text>
                </TouchableOpacity>
                {/* Название будильника */}
                    <TextInput
                        style={styles.input}
                        placeholder="Название будильника"
                    />

                {/* Выбор игры */}
                <Link href="/choose_game" asChild>
                    <TouchableOpacity style={styles.option} >
                        <Text style={styles.text}>Способ пробуждения</Text>
                        <Text style={styles.optionSubtext}>Игра</Text>
                    </TouchableOpacity>
                </Link>

                

                {/* Выбор звука */}
                <Link href='/alarm_music' asChild>
                    <TouchableOpacity style={styles.option} >
                        <Text style={styles.text}>Звук будильника</Text>
                        <Text style={styles.optionSubtext}>Homecoming</Text>
                    </TouchableOpacity>
                </Link>

                {/* Вибрация */}
                <Link href='/alarm_vibration' asChild>
                    <TouchableOpacity style={styles.option} >
                        <Text style={styles.text}>Вибрация</Text>
                        <Text style={styles.optionSubtext}>Basic Call</Text>
                    </TouchableOpacity>
                </Link>

                {/* Кнопки */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonTextCancel}>Отмена</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={saveAlarm}>
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
        fontSize: 18,
    },
    buttonTextSave: {
        color: '#fff',
        fontFamily: "Inter",
        fontWeight: "bold",
        fontSize: 18,
    },
    containerOptions:
    {
        flex: 1,
        backgroundColor: '#CCE3DE',
        padding:15,
        justifyContent: "space-between", 
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
        paddingVertical:10,
        fontFamily: "Inter",
        color: "#73827A",
    },
    text: {
        color: '#1A293C',
        fontFamily: "Inter",
        fontSize: 18,

    },
    optionSubtext: { 
        fontSize: 16, 
        color: "#73827A",
        fontFamily: "Inter",
    },
    

});

