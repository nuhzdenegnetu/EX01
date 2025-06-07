import express from 'express';
import path from 'path';
import ejs from 'ejs';
// Импортируем либы
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
// Импорт middleware для логирования и обработки ошибок
import { fileURLToPath } from 'url';
import { requestLogger } from './src/middlewares/logging.middleware.mjs';
import { errorHandler } from './src/middlewares/error.middleware.mjs';
// Импорт маршрутов
import indexRouter from './src/routes/index.mjs';
import usersRouter from './src/routes/users.route.mjs';
import articlesRouter from './src/routes/articles.route.mjs';
import themeRouter from './src/routes/theme.route.mjs';
import authRouter from './src/routes/auth.route.mjs';

// Получение абсолютного пути к текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Настройка обработки тела запроса
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка cookie-parser
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.theme = req.cookies.theme || 'light-theme'; // Устанавливаем тему по умолчанию
  next();
});

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.static(path.join(process.cwd(), 'src/public/icon')));
app.use('/favicon.svg', express.static(path.join(process.cwd(), 'public', 'favicon.svg')));

// Настройка шаблонизаторов
app.set('views', path.join(__dirname, 'src/views'));

// Настройка PUG (по умолчанию для маршрутов /users)
app.set('view engine', 'pug');

// Настройка EJS для маршрутов /articles
app.engine('ejs', ejs.__express);

// Измените middleware определения шаблонизатора
app.use((req, res, next) => {
  if (req.path.startsWith('/articles')) {
    // Применяем express-ejs-layouts только для маршрутов /articles
    expressLayouts(req, res, () => {
      res.locals.layout = 'ejs/layout';
      app.set('view engine', 'ejs');
      app.set('layout extractScripts', true);
      app.set('layout extractStyles', true);
      next();
    });
  } else {
    // Для остальных маршрутов (включая /users) используем PUG
    app.set('view engine', 'pug');
    next();
  }
});

// Middleware для логирования
app.use(requestLogger);

// Маршруты
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/theme', themeRouter);
app.use('/auth', authRouter);

// Обработка несуществующих маршрутов
app.use((req, res) => {
  const viewEngine = req.path.startsWith('/articles') ? 'ejs' : 'pug';
  const template = viewEngine === 'ejs' ? 'ejs/error' : 'pug/error';

  res.status(404).render(template, {
    title: 'Страница не найдена',
    message: 'Запрашиваемая страница не существует'
  });
});

// Обработка ошибок
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//hello world


// TODO: Надо доделать прбоблему с аутентификацией и авторизацией, не работает отдает просто пустую страницу