import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Buffalo } from '../src/models/buffalo';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про бізонів
describe('API вебдодатку сайту про бізонів', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/buffalo-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "buffalo-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію бізонів
    beforeEach(async () => {
        await Buffalo.deleteMany({});
    });

    // Тести для створення запису про нового бізона (POST-запит)
    describe('POST /api/buffalo', () => {
        it('має створити запис про нового бізона', done => {
            // Тестові дані бізона
            const buffalo = {
                name: 'Влад',
                age: 3,
                height: 20,
                weight: 3.5,
                gender: 'male' as const,
                description: 'Бізон',
                migrationDistance: 4,
            };

            // Виконуємо POST-запит для створення запису про бізона
            chai.request(app)
                .post('/api/buffalo')
                .send(buffalo)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', buffalo.name);
                    expect(res.body).to.have.property('age', buffalo.age);
                    expect(res.body).to.have.property('height', buffalo.height);
                    expect(res.body).to.have.property('weight', buffalo.weight);
                    expect(res.body).to.have.property('gender', buffalo.gender);
                    expect(res.body).to.have.property('description', buffalo.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    expect(res.body).to.have.property('migrationDistance', buffalo.migrationDistance);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів бізонів (GET-запит)
    describe('GET /api/buffalo', () => {
        it('має отримати всіх бізонів', async () => {
            // Створюємо тестовий запис бізона
            const testBuffalo = new Buffalo({
                name: 'Діма',
                age: 2,
                height: 25,
                weight: 5,
                gender: 'male',
                description: 'Бізон',
                migrationDistance: 4,
            });
            await testBuffalo.save();

            // Виконуємо GET-запит для отримання всіх записів бізона
            const res = await chai.request(app).get('/api/buffalo');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Діма');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Бізон');
            expect(res.body[0]).to.have.property('dateAdded');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
            expect(res.body[0]).to.have.property('migrationDistance', 4);
        });
    });

    // Тести для отримання запису конкретного бізону за ID (GET-запит)
    describe('GET /api/buffalo/:id', () => {
        it('має отримати конкретного бізону за id', async () => {
            // Створюємо запис тестового бізона
            const testBuffalo = new Buffalo({
                name: 'Прямий',
                age: 2,
                height: 35,
                weight: 2,
                gender: 'male',
                description: 'Коричневий бізон',
                migrationDistance: 4,
            });
            const savedBuffalo = await testBuffalo.save();

            // Виконуємо GET-запит для отримання запису бізона за ID
            const res = await chai.request(app).get(`/api/buffalo/${String(savedBuffalo._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Прямий');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 35);
            expect(res.body).to.have.property('weight', 2);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Коричневий бізон');
            expect(res.body).to.have.property('migrationDistance', 4);
        });

        it('має повернути 404 для неіснуючого бізона', async () => {
            // Виконуємо GET-запит для неіснуючого ID бізона
            const res = await chai.request(app).get('/api/buffalo/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про бізона (PUT-запит)
    describe('PUT /api/buffalo/:id', () => {
        it('має повністю оновити запис про бізона', async () => {
            // Створюємо тестового бізона
            const testBuffalo = new Buffalo({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                migrationDistance: 4,

            });
            const savedBuffalo = await testBuffalo.save();

            // Дані для оновлення бізона
            const updatedData = {
                name: 'Оновлений',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
                migrationDistance: 6,
            };

            // Виконуємо PUT-запит для повного оновлення запису про бізона
            const res = await chai
                .request(app)
                .put(`/api/buffalo/${String(savedBuffalo._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
            expect(res.body).to.have.property('migrationDistance', 6);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестового бізона
            const testBuffalo = new Buffalo({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                migrationDistance: 4,
            });
            const savedBuffalo = await testBuffalo.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/buffalo/${String(savedBuffalo._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що бізон не змінився
            const unchangedBuffalo = await Buffalo.findById(savedBuffalo._id);
            expect(unchangedBuffalo).to.have.property('name', 'Оригінальний');
            expect(unchangedBuffalo).to.have.property('height', 25);
            expect(unchangedBuffalo).to.have.property('weight', 1.8);
            expect(unchangedBuffalo).to.have.property('migrationDistance', 4);
        });
    });

    // Тести для часткового оновлення запису про бізона (PATCH-запит)
    describe('PATCH /api/buffalo/:id', () => {
        it('має частково оновити запис про бізона', async () => {
            // Створюємо тестового бізона
            const testBuffalo = new Buffalo({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                migrationDistance: 4,
            });
            const savedBuffalo = await testBuffalo.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
                migrationDistance: 7,
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/buffalo/${String(savedBuffalo._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
            expect(res.body).to.have.property('migrationDistance', 7);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестового бізона
            const testBuffalo = new Buffalo({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                migrationDistance: 4,
            });
            const savedBuffalo = await testBuffalo.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/buffalo/${String(savedBuffalo._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('migrationDistance', 4);
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/buffalo', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/buffalo')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису бізона (DELETE-запит)
    describe('DELETE /api/buffalo/:id', () => {
        it('має видалити запис про бізона', async () => {
            // Створюємо тестового бізона
            const testBuffalo = new Buffalo({
                name: 'Стрибунець',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Чорний бізон',
                migrationDistance: 4,
            });
            const savedBuffalo = await testBuffalo.save();

            // Виконуємо DELETE-запит
            const res = await chai.request(app).delete(`/api/buffalo/${String(savedBuffalo._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про бізона видалено');

            // Перевіряємо, що запис про бізона дійсно видалено з бази
            const findBuffalo = await Buffalo.findById(savedBuffalo._id);
            expect(findBuffalo).to.be.null;
        });
    });
});
