// src/middlewares/validation.middleware.mjs
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};

  // Валидация имени
  if (!name || name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа';
  }

  // Валидация email
  if (!email || !isValidEmail(email)) {
    errors.email = 'Введите корректный email адрес';
  }

  // Валидация пароля
  if (!password || password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }

  if (Object.keys(errors).length > 0) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(400).json({ errors });
    } else {
      return res.status(400).render('pug/users/register', {
        title: 'Регистрация',
        errors,
        values: { name, email }
      });
    }
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  // Проверка наличия email
  if (!email || !isValidEmail(email)) {
    errors.email = 'Введите корректный email адрес';
  }

  // Проверка наличия пароля
  if (!password) {
    errors.password = 'Введите пароль';
  }

  if (Object.keys(errors).length > 0) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(400).json({ errors });
    } else {
      return res.status(400).render('pug/users/login', {
        title: 'Вход',
        errors,
        values: { email }
      });
    }
  }

  next();
};

// Проверка формата email с помощью регулярного выражения
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}