import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, StatusBar, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "./lib/supabase";
import { Ionicons } from '@expo/vector-icons';

// Определяем тип для категории
type Category = {
    Ring_category_id: number;
    Category: string;
};

export default function CategorySelection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const router = useRouter();
    const { selectedScreen, level, totalExamples } = useLocalSearchParams();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('Ring_category')
            .select('*');
        if (error) {
            console.error("Error fetching categories:", error);
        } else {
            setCategories(data as Category[]);
        }
    };

    const handleNext = () => {
        if (selectedCategory) {
            router.push({ 
                pathname: "/music_selection", 
                params: { 
                    categoryId: selectedCategory, 
                    selectedScreen: selectedScreen, 
                    level: level,
                    totalExamples: totalExamples, 
                } 
            });
        } else {
            alert("Пожалуйста, выберите категорию");
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerText}>Выберите категорию</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.buttonContainer}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.Ring_category_id.toString()}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    selectedCategory === item.Ring_category_id && styles.buttonSelected,
                                ]}
                                onPress={() => setSelectedCategory(item.Ring_category_id)}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    selectedCategory === item.Ring_category_id && styles.buttonTextSelected
                                ]}>
                                    {item.Category}
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
                <TouchableOpacity style={[styles.bottomButton, styles.nextButton]} onPress={handleNext}>
                    <Text style={styles.bottomButtonText}>Далее</Text>
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