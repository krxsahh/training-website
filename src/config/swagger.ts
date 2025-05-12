// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Бізонів',
        version: '1.0.0',
        description: 'Документація API для Сайту про Бізонів',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення кінцевих точок (endpoints) REST API та операцій з ними
    paths: {
        '/api/buffalo': {
            // GET запит для отримання всіх бізонів
            get: {
                summary: 'Отримати всіх бізонів',
                responses: {
                    '200': {
                        description: 'Список всіх бізонів',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Buffalo' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нового бізона
            post: {
                summary: 'Створити нового бізона',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Buffalo' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт бізон",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Buffalo' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного бізона за ID
        '/api/buffalo/{id}': {
            // GET запит для отримання бізона за ID
            get: {
                summary: 'Отримати бізона за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID бізона',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт бізона",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Buffalo' },
                            },
                        },
                    },
                    '404': { description: 'Бізона не знайдено' },
                },
            },

            // PUT запит для повного оновлення бізона за ID
            put: {
                summary: 'Повністю оновити бізона',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID бізона',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Buffalo' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт бізона",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Buffalo' },
                            },
                        },
                    },
                    '404': { description: 'Бізона не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення бізона за ID
            patch: {
                summary: 'Частково оновити бізона',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID бізона',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Buffalo' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт бізона",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Buffalo' },
                            },
                        },
                    },
                    '404': { description: 'Бізона не знайдено' },
                },
            },
            // DELETE запит для видалення даних про бізона за ID
            delete: {
                summary: 'Видалити дані про бізона',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID бізона',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Бізона не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Бізона
            Buffalo: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender', 'migrationDistance'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я бізона",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік бізона у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота бізона в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага бізона в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать бізона',
                    },
                    description: {
                        type: 'string',
                        description: "Опис бізона (необов'язкове поле)",
                    },
                    dateAdded: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Дата додавання запису до бази даних',
                    },
                    migrationDistance: {
                        type: 'number',
                        description: 'Відстань міграції бізона в кілометрах',
                        default: 0,
                    },
                },
            },
        },
    },
};
