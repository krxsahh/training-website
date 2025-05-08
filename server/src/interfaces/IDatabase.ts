// Інтерфейс для взаємодії з базою даних
export interface IDatabase {
    // Підключення до бази даних з можливістю вказати URI
    connect(uri?: string): Promise<void>;

    // Відключення від бази даних
    disconnect(): Promise<void>;

    // Перевірка, чи є активне підключення до бази даних
    isConnected(): boolean;

    // Отримання URI поточного підключення до бази даних
    getConnectionUri(): string | null;
}
