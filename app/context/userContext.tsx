// storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';


// Сохранить Person_id
export const savePersonId = async (personId: string) => {
  try {
    await AsyncStorage.setItem('Person_id', personId);
  } catch (error) {
    console.error('Error saving Person_id:', error);
  }
};


// Получить Person_id
export const getPersonId = async (): Promise<string | null> => {
    try {
      const personId = await AsyncStorage.getItem('Person_id');
      return personId;
    } catch (error) {
      console.error('Error getting Person_id:', error);
      return null;
    }
  };


// Удалить Person_id (если нужно)
export const removePersonId = async () => {
  try {
    await AsyncStorage.removeItem('Person_id');
  } catch (error) {
    console.error('Error removing Person_id:', error);
  }
};
