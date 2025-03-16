import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

const copyAudioFiles = async () => {
    // Список аудиофайлов в папке assets/Rings_melody
    const audioFiles = [
        require("../assets/Rings_melody/1.mp3"),
        require("../assets/Rings_melody/2.mp3"),
        require("../assets/Rings_melody/3.mp3"),
        require("../assets/Rings_melody/4.mp3"),
        require("../assets/Rings_melody/5.mp3"),
        require("../assets/Rings_melody/6.mp3"),
        require("../assets/Rings_melody/7.mp3"),
        require("../assets/Rings_melody/8.mp3"),
        require("../assets/Rings_melody/9.mp3"),
        require("../assets/Rings_melody/10.mp3"),
        require("../assets/Rings_melody/11.mp3"),
        require("../assets/Rings_melody/12.mp3"),
        require("../assets/Rings_melody/13.mp3"),
        require("../assets/Rings_melody/14.mp3"),
        require("../assets/Rings_melody/15.mp3"),
        require("../assets/Rings_melody/16.mp3"),
        require("../assets/Rings_melody/17.mp3"),
        require("../assets/Rings_melody/18.mp3"),
        require("../assets/Rings_melody/19.mp3"),
        require("../assets/Rings_melody/20.mp3"),
        
    ];

     // Копируем каждый файл
     for (const audioFile of audioFiles) {
        try {
            // Загружаем файл из assets
            const assets = await Asset.loadAsync(audioFile);

            // Получаем первый элемент массива (так как мы загружаем один файл)
            const asset = assets[0];

            // Получаем URI файла
            const uri = asset.localUri || asset.uri;

            // Получаем имя файла (например, "1.mp3")
            const fileName = uri.split("/").pop();

            // Формируем путь для сохранения файла
            const destination = `${FileSystem.documentDirectory}${fileName}`;

            // Копируем файл
            await FileSystem.copyAsync({ from: uri, to: destination });

            console.log(`Файл ${fileName} скопирован в ${destination}`);
        } catch (error) {
            console.error(`Ошибка при копировании файла:`, error);
        }
    }
};

export default copyAudioFiles;