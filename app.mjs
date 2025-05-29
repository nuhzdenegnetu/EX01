import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { requestLogger } from './src/middlewares/logging.middleware.mjs';
import { errorHandler } from './src/middlewares/error.middleware.mjs';
import indexRouter from './src/routes/index.mjs';
import usersRouter from './src/routes/users.route.mjs';
import articlesRouter from './src/routes/articles.route.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Настройка обработки тела запроса
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'src/public')));

// Настройка шаблонизаторов

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug'); // Установка PUG как шаблонизатора по умолчанию


// Middleware для логирования
app.use(requestLogger);

// Маршруты
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

// Обработка ошибок
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});