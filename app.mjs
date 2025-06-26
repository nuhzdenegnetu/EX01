//импортируемые модули
import express from 'express';
import session from 'express-session';
import passport from './src/config/passport.mjs';
import path from 'path';
import ejs from 'ejs';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
// Импортируем мидлвары и маршруты
import { fileURLToPath } from 'url';
import { requestLogger } from './src/middlewares/logging.middleware.mjs';
import { errorHandler } from './src/middlewares/error.middleware.mjs';
import indexRouter from './src/routes/index.mjs';
import usersRouter from './src/routes/users.route.mjs';
import articlesRouter from './src/routes/articles.route.mjs';
import themeRouter from './src/routes/theme.route.mjs';
import authRouter from './src/routes/auth.route.mjs';
import protectedRoute from './src/routes/protected.route.mjs';
import crudRoutes from './src/routes/crud.route.mjs';
// Импортируем функцию для подключения к базе данных
import connectDB from './src/config/db.mjs';
import './src/models/authUser.model.mjs';
// Загрузка переменных окружения
import dotenv from 'dotenv';
import {checkAuth} from "./src/middlewares/auth.middleware.mjs";
dotenv.config();

// Получение абсолютного пути к текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Подключение к базе данных
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Настройка обработки тела запроса
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

// Настройка cookie-parser
app.use(cookieParser());
app.use(checkAuth);

// Установка темы по умолчанию
app.use((req, res, next) => {
  res.locals.theme = req.cookies.theme || 'light-theme';
  next();
});

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.static(path.join(process.cwd(), 'src/public/icon')));
app.use('/favicon.svg', express.static(path.join(process.cwd(), 'public', 'favicon.svg')));

// Настройка шаблонизаторов
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug'); // По умолчанию PUG

// Настройка EJS для маршрутов /articles
app.engine('ejs', ejs.__express);
app.use((req, res, next) => {
  if (req.path.startsWith('/articles')) {
    expressLayouts(req, res, () => {
      res.locals.layout = 'ejs/layout';
      app.set('view engine', 'ejs');
      app.set('layout extractScripts', true);
      app.set('layout extractStyles', true);
      next();
    });
  } else {
    app.set('view engine', 'pug');
    next();
  }
});

// Middleware для логирования
app.use(requestLogger);

// Настройка сессий
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 3600000 },
  })
);
// Настройка Passport
app.use(passport.initialize());
app.use(passport.session());

// Подключение маршрутов
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/theme', themeRouter);
app.use('/auth', authRouter);
app.use('/protected', protectedRoute);
app.use('/api/crud', crudRoutes);

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

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


