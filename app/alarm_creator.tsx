import React, { useState } from "react";
import { TimerPicker } from "react-native-timer-picker";
import MaskedView from "@react-native-masked-view/masked-view"; // for transparent fade-out
import { LinearGradient } from "expo-linear-gradient"; // or `import LinearGradient from "react-native-linear-gradient"`
import { Audio } from "expo-av"; // for audio feedback (click sound as you scroll)
import * as Haptics from "expo-haptics"; // for haptic feedback
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Pressable, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { Text } from 'react-native';  // ✅ Правильно





export default function App () {
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
        <SafeAreaView>
            <LinearGradient
                colors={["#202020", "#220578"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{alignItems: "center", justifyContent: "center"}}>
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
                        theme: "dark",
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
            <View>
                <Button title="Выбрать дату" onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}/>
            </View>
            <View >
                <Link href="/choose_game" asChild>
                    <Button title="Выбрать способ пробуждения" />
                </Link>
            </View>
    <View style={styles.container}>
      {/* Название будильника */}
      <Text style={styles.label}>Название будильника</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Введите название" 
      />

      {/* Выбор звука */}
      <TouchableOpacity style={styles.option} >
        <Text style={styles.optionText}>Звук будильника</Text>
        <Text style={styles.optionSubtext}>Homecoming</Text>
      </TouchableOpacity>

      {/* Вибрация */}
      <TouchableOpacity style={styles.option} >
        <Text style={styles.optionText}>Вибрация</Text>
        <Text style={styles.optionSubtext}>Basic Call</Text>
      </TouchableOpacity>

      {/* Кнопки */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Отмена</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Сохранить</Text>
        </TouchableOpacity>
      </View></View>

        </SafeAreaView>
        )

};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, color: "#888" },
  input: { borderBottomWidth: 1, borderColor: "#ddd", fontSize: 18, padding: 8, marginBottom: 20 },
  option: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderColor: "#ddd" },
  optionText: { fontSize: 18 },
  optionSubtext: { fontSize: 16, color: "#888" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelButton: { flex: 1, padding: 15, borderRadius: 5, backgroundColor: "#ddd", alignItems: "center", marginRight: 10 },
  saveButton: { flex: 1, padding: 15, borderRadius: 5, backgroundColor: "#007AFF", alignItems: "center" },
  cancelText: { fontSize: 16, color: "#333" },
  saveText: { fontSize: 16, color: "#fff" },
  screen: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});

