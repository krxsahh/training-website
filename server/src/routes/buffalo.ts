import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { BuffaloRepository } from '../repositories/BuffaloRepository';

// Створюємо новий обробник HTTP-запитів Express
const router = Router();
// Отримуємо екземпляр репозиторію бізонів з контейнера інверсії залежностей
const buffaloRepository = container.get(BuffaloRepository);

// Обробка HTTP-запиту GET / - отримання всіх записів бізонів
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи бізонів з бази даних через репозиторій
        const buffalo = await buffaloRepository.findAll();
        res.json(buffalo);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту GET /:id - отримання запису одного бізона за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук бізона за ідентифікатором
        const buffalo = await buffaloRepository.findById(req.params.id);
        if (buffalo) {
            res.json(buffalo);
        } else {
            // Якщо бізон не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис бізона не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту POST / - створення нового запису бізона
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис бізона з даних запиту
        const newBuffalo = await buffaloRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного бізона
        res.status(201).json(newBuffalo);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PUT /:id - повне оновлення запису бізона
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо бізона з вказаним ID
        const buffalo = await buffaloRepository.update(req.params.id, req.body);
        if (buffalo) {
            return res.json(buffalo);
        } else {
            // Якщо бізон не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис бізона не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PATCH /:id - часткове оновлення запису бізона
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису бізона - передаються лише ті поля, які потрібно змінити
        const buffalo = await buffaloRepository.patch(req.params.id, req.body);
        if (buffalo) {
            res.json(buffalo);
        } else {
            // Якщо бізон не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис бізона не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту DELETE /:id - видалення запису бізона
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про бізона за ID
        const buffalo = await buffaloRepository.delete(req.params.id);
        if (buffalo) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про бізона видалено' });
        } else {
            // Якщо бізон не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про бізона не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
