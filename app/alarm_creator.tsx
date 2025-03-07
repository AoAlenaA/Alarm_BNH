import React, { useState } from "react";
import { TimerPicker } from "react-native-timer-picker";
import MaskedView from "@react-native-masked-view/masked-view"; // for transparent fade-out
import { LinearGradient } from "expo-linear-gradient"; // or `import LinearGradient from "react-native-linear-gradient"`
import { Audio } from "expo-av"; // for audio feedback (click sound as you scroll)
import * as Haptics from "expo-haptics"; // for haptic feedback
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";


export const App = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [alarmString, setAlarmString] = useState<
        string | null
    >(null);
    const [date, setDate] = useState(new Date())

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
            </View>
        </SafeAreaView>
        )

};
export default App