import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient"; // or `import LinearGradient from "react-native-linear-gradient"`
import { Audio } from "expo-av"; // for audio feedback (click sound as you scroll)
import * as Haptics from "expo-haptics"; // for haptic feedback

const AlarmPicker = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [alarmString, setAlarmString] = useState<string | null>(null);

    const formatTime = ({
        hours,
        minutes,
        seconds,
    }: {
        hours?: number;
        minutes?: number;
        seconds?: number;
    }) => {
        const timeParts = [];

        if (hours !== undefined) {
            timeParts.push(hours.toString().padStart(2, "0"));
        }
        if (minutes !== undefined) {
            timeParts.push(minutes.toString().padStart(2, "0"));
        }
        if (seconds !== undefined) {
            timeParts.push(seconds.toString().padStart(2, "0"));
        }

        return timeParts.join(":");
    };

    return (
        <View style={{ backgroundColor: "#F1F1F1", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Text style={{ fontSize: 18, color: "#202020" }}>
                {alarmString ? "Alarm set for" : "No alarm set"}
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPicker(true)}>
                <View style={{ alignItems: "center" }}>
                    {alarmString !== null ? (
                        <Text style={{ color: "#202020", fontSize: 48 }}>{alarmString}</Text>
                    ) : null}
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPicker(true)}>
                        <View style={{ marginTop: 30 }}>
                            <Text
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 18,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    fontSize: 16,
                                    overflow: "hidden",
                                    borderColor: "#8C8C8C",
                                    color: "#8C8C8C",
                                }}
                            >
                                Set Alarm 🔔
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={(pickedDuration) => {
                    setAlarmString(formatTime(pickedDuration));
                    setShowPicker(false);
                }}
                modalTitle="Set Alarm"
                onCancel={() => setShowPicker(false)}
                closeOnOverlayPress
                use12HourPicker
                Audio={Audio}
                clickSoundAsset={require("./assets/custom_click.mp3")}
                LinearGradient={LinearGradient}
                Haptics={Haptics}
                styles={{
                    theme: "light",
                }}
            />
        </View>
    );
};

export default AlarmPicker;
