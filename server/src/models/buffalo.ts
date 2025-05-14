import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Бізон"
interface IBuffalo {
    name: string; // Ім'я бізона
    age: number; // Вік бізона у роках
    height: number; // Висота бізона в сантиметрах
    weight: number; // Вага бізона в кілограмах
    gender: 'male' | 'female'; // Стать бізона: 'male' - самець, 'female' - самка
    description?: string; // Опис бізона (необов'язкове поле)
    dateAdded: Date; // Дата додавання запису до бази даних
    migrationDistance: number;
}

// Схема MongoDB для моделі "Бізон"
const buffaloSchema = new Schema<IBuffalo>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
    migrationDistance: {
        type: Number,
        default: 0,
        required: true,
    },
});

// Створення моделі Mongoose на основі схеми
export const Buffalo = model<IBuffalo>('Buffalo', buffaloSchema);
export type { IBuffalo }; // Експортуємо інтерфейс для використання в інших файлах
