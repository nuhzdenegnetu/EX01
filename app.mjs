import express from 'express';
import { requestLogger } from './src/middlewares/logging.middleware.mjs';
import { errorHandler } from './src/middlewares/error.middleware.mjs';
import indexRouter from './src/routes/index.mjs';
import usersRouter from './src/routes/users.route.mjs';
import articlesRouter from './src/routes/articles.route.mjs';

const app = express();

app.use(express.text());
app.use(requestLogger);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;