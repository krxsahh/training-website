import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';
import { IDatabase } from '../interfaces/IDatabase';
import type { IConfig } from '../config/container';
import { MONGODB_URI } from '../config/env';

// Клас для роботи з базою даних MongoDB
// Позначений як injectable для використання в IoC контейнері
@injectable()
export class MongoDatabase implements IDatabase {
    private _isConnected = false; // стан підключення
    private _connectionUri: string | null = null; // URI-адреса поточного підключення

    // Конструктор з впровадженням залежності конфігурації
    constructor(@inject('Config') private config: IConfig) {
        mongoose.set('strictQuery', true);
    }

    // Метод для підключення до бази даних
    public async connect(uri?: string): Promise<void> {
        // Використовуємо URI з параметра або з конфігурації
        const mongoUri = uri !== undefined ? uri : MONGODB_URI;

        // Перевіряємо, чи задано URI
        if (mongoUri === '') {
            throw new Error('URI MongoDB не визначено');
        }

        // Якщо вже підключені до цієї ж бази, повторно не підключаємося
        if (this._isConnected && this._connectionUri === mongoUri) {
            console.log('Використовуємо існуюче підключення до бази даних');
            return;
        }

        // Якщо підключені до іншої бази, спочатку відключаємося
        if (this._isConnected && this._connectionUri !== mongoUri) {
            console.log('Відключаємося від попередньої бази даних перед підключенням до нової');
            await this.disconnect();
        }

        try {
            // Створюємо підключення до MongoDB
            await mongoose.connect(mongoUri);
            this._isConnected = true;
            this._connectionUri = mongoUri;
            console.log(
                `MongoDB підключено: ${mongoose.connection.host} у режимі ${this.config.nodeEnv}`,
            );
        } catch (error) {
            // Обробка помилок підключення
            const errorMessage =
                error instanceof Error ? error.message : 'Виникла невідома помилка';
            console.error(`Помилка: ${errorMessage}`);
            throw error;
        }
    }

    // Метод для відключення від бази даних
    public async disconnect(): Promise<void> {
        // Якщо не підключені, нічого не робимо
        if (!this._isConnected) {
            return;
        }

        try {
            // Відключаємося від MongoDB
            await mongoose.disconnect();
            this._isConnected = false;
            this._connectionUri = null;
            console.log('MongoDB відключено');
        } catch (error) {
            // Обробка помилок відключення
            const errorMessage =
                error instanceof Error ? error.message : 'Виникла невідома помилка';
            console.error(`Помилка відключення від MongoDB: ${errorMessage}`);
            throw error;
        }
    }

    // Метод для перевірки стану підключення
    public isConnected(): boolean {
        return this._isConnected;
    }

    // Метод для отримання URI поточного підключення
    public getConnectionUri(): string | null {
        return this._connectionUri;
    }
}
