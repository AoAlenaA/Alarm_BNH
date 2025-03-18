import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "./lib/supabase";

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
            router.push({ pathname: "/music_selection", params: { categoryId: selectedCategory, 
                selectedScreen: selectedScreen, 
                level: level,
                totalExamples: totalExamples, } });
        } else {
            alert("Пожалуйста, выберите категорию");
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Заголовок "Выберите категорию" */}
            <Text style={styles.headerText}>Выберите категорию</Text>

            {/* Список категорий */}
            <FlatList
                data={categories}
                keyExtractor={(item) => item.Ring_category_id.toString()}
                contentContainerStyle={styles.flatListContent} // Центрируем категории
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.categoryItem,
                            selectedCategory === item.Ring_category_id && styles.selectedCategoryItem,
                        ]}
                        onPress={() => setSelectedCategory(item.Ring_category_id)}
                    >
                        <Text style={styles.categoryText}>{item.Category}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Кнопки "Отмена" и "Далее" */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.buttonText}>Далее</Text>
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
        color: '#fff', // Цвет как у кнопок
        backgroundColor: '#6B9080', // Фон как у кнопок
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? 50 : 20, // Больше отступ для iPhone
        marginBottom: 20,
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'center', // Центрируем категории
    },
    categoryItem: {
        padding: 20,
        marginVertical: 10, // Промежутки между категориями
        borderWidth: 1,
        borderColor: '#6B9080',
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    selectedCategoryItem: {
        backgroundColor: '#A6CEC5', // Подсветка выбранной категории
    },
    categoryText: {
        fontSize: 18,
        color: '#1A293C', // Более яркий цвет текста
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
    nextButton: {
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