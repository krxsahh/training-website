import { injectable } from 'inversify';
import { Buffalo, IBuffalo } from '../models/buffalo';

// Клас-репозиторій для роботи з бізонів
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class BuffaloRepository {
    // Метод для отримання всіх бізонів з бази даних
    public async findAll(): Promise<IBuffalo[]> {
        return Buffalo.find();
    }

    // Метод для пошуку бізонів за унікальним ідентифікатором
    public async findById(id: string): Promise<IBuffalo | null> {
        return Buffalo.findById(id);
    }

    // Метод для створення нового бізона в базі даних
    public async create(buffaloData: IBuffalo): Promise<IBuffalo> {
        const buffalo = new Buffalo(buffaloData);
        return buffalo.save();
    }

    // Метод для видалення бізона за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Buffalo.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про бізона (заміна всіх полів)
    public async update(id: string, buffaloData: IBuffalo): Promise<IBuffalo | null> {
        return Buffalo.findByIdAndUpdate(id, buffaloData, { new: true });
    }

    // Метод для часткового оновлення даних про бізона (оновлення лише вказаних полів)
    public async patch(id: string, buffaloData: Partial<IBuffalo>): Promise<IBuffalo | null> {
        return Buffalo.findByIdAndUpdate(id, { $set: buffaloData }, { new: true });
    }
}
