import React, { useState } from "react";
import { TimerPicker } from "react-native-timer-picker";
import MaskedView from "@react-native-masked-view/masked-view"; // for transparent fade-out
import { LinearGradient } from "expo-linear-gradient"; // or `import LinearGradient from "react-native-linear-gradient"`
import { Audio } from "expo-av"; // for audio feedback (click sound as you scroll)
import * as Haptics from "expo-haptics"; // for haptic feedback
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Link } from "expo-router";
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useRouter for navigation
import { sendNotification, useNotificationListeners } from './notifications';


export default function App() {
    useNotificationListeners();
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [date, setDate] = useState<string>("");
    const { level, totalExamples, selectedScreen, melody, melodyPath } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [repeatType, setRepeatType] = useState<'once' | 'weekly' | 'specific'>('once');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const router = useRouter(); // Initialize router for navigation


    const daysOfWeek = [
        { id: 1, label: 'Пн' },
        { id: 2, label: 'Вт' },
        { id: 3, label: 'Ср' },
        { id: 4, label: 'Чт' },
        { id: 5, label: 'Пт' },
        { id: 6, label: 'Сб' },
        { id: 0, label: 'Вс' },
    ];


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };


    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const dataScreen = '';
    const handleConfirm = (date: Date) => {
        const formattedDate1 = date.toLocaleDateString("ru-RU");
        setDate(formattedDate1);
        const formattedDate = date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long"
        });
        setSelectedDate(formattedDate);
        hideDatePicker();
    };


    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };


    const handleSave = () => {
        if (repeatType === 'specific' && !date) {
            Alert.alert("Ошибка", "Пожалуйста, выберите дату.");
            return;
        }


        if (repeatType === 'weekly' && selectedDays.length === 0) {
            Alert.alert("Ошибка", "Пожалуйста, выберите дни недели.");
            return;
        }


        let notifyDates: Date[] = [];
        const now = new Date();


        switch (repeatType) {
            case 'once':
                const onceDate = new Date();
                onceDate.setHours(time.hours, time.minutes, time.seconds);
                if (onceDate < now) onceDate.setDate(onceDate.getDate() + 1);
                notifyDates.push(onceDate);
                break;


            case 'weekly':
                selectedDays.forEach(day => {
                    const date = getNextWeekdayDate(day);
                    date.setHours(time.hours, time.minutes, time.seconds);
                    notifyDates.push(date);
                });
                break;


            case 'specific':
                const specificDate = formatDateTime(date, time);
                if (specificDate < now) {
                    Alert.alert("Ошибка", "Выбранная дата и время не могут быть в прошлом.");
                    return;
                }
                notifyDates.push(specificDate);
                break;
        }

        const melodyPathTrue = melodyPath.toString()
        console.log(melodyPathTrue)
        notifyDates.forEach(date => sendNotification(date, selectedScreen, level, totalExamples, melodyPathTrue));
        router.replace('/(tabs)');
    };



    const getNextWeekdayDate = (targetDay: number): Date => {
        const date = new Date();
        date.setHours(time.hours, time.minutes, time.seconds);


        const currentDay = date.getDay();
        let daysToAdd = (targetDay - currentDay + 7) % 7;
        if (daysToAdd === 0 && date < new Date()) daysToAdd = 7;


        date.setDate(date.getDate() + daysToAdd);
        return date;
    };


    const handleCancel = () => {
        router.replace('/(tabs)');
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


            {/* Выбор типа повторения */}
            <View style={styles.repeatTypeContainer}>
                <TouchableOpacity
                    style={[styles.repeatButton, repeatType === 'once' && styles.activeRepeat]}
                    onPress={() => setRepeatType('once')}>
                    <Text style={styles.repeatButtonText}>Однократно</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[styles.repeatButton, repeatType === 'weekly' && styles.activeRepeat]}
                    onPress={() => setRepeatType('weekly')}>
                    <Text style={styles.repeatButtonText}>По дням</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[styles.repeatButton, repeatType === 'specific' && styles.activeRepeat]}
                    onPress={() => setRepeatType('specific')}>
                    <Text style={styles.repeatButtonText}>Дата</Text>
                </TouchableOpacity>
            </View>


            {/* Блок выбора дней недели */}
            {repeatType === 'weekly' && (
                <View style={styles.daysContainer}>
                    {daysOfWeek.map(day => (
                        <TouchableOpacity
                            key={day.id}
                            style={[
                                styles.dayButton,
                                selectedDays.includes(day.id) && styles.selectedDay
                            ]}
                            onPress={() => toggleDay(day.id)}>
                            <Text style={styles.dayText}>{day.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}


            {/* Блок выбора конкретной даты */}
            {repeatType === 'specific' && (
                <View>
                    <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
                        <Text style={styles.datePickerText}>
                            {selectedDate || 'Выберите дату'}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>
            )}


            {/* Остальные элементы */}
            <View style={styles.containerOptions}>
                <TextInput
                    style={styles.input}
                    placeholder="Название будильника"
                />


                <Link href="/choose_game" asChild>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.text}>Способ пробуждения</Text>
                        <Text style={styles.optionSubtext}>{selectedScreen || "-"}</Text>
                    </TouchableOpacity>
                </Link>


                <Link href='/music_category' asChild>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.text}>Звук будильника</Text>
                        <Text style={styles.optionSubtext}>{melody || "Homecoming"}</Text>
                    </TouchableOpacity>
                </Link>


                <Link href='/alarm_vibration' asChild>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.text}>Вибрация</Text>
                        <Text style={styles.optionSubtext}>Basic Call</Text>
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


function formatDateTime(dateStr: string, timeObj: { hours: number; minutes: number; seconds: number }): Date {
    const [day, month, year] = dateStr.split('.').map(Number);
    const { hours, minutes, seconds } = timeObj;
    return new Date(year, month - 1, day, hours, minutes, seconds);
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
        fontSize: 16,
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
