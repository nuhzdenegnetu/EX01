// `src/routes/auth.route.mjs`
import express from 'express';
import {
  login,
  register,
  logout,
  renderLoginPage,
  renderRegisterPage,
  apiLogout
} from '../controllers/auth.controller.mjs';

const router = express.Router();

// Маршруты для страниц аутентификации
router.get('/login', renderLoginPage);
router.get('/register', renderRegisterPage);
router.get('/logout', logout);

// Маршруты для API аутентификации
router.post('/register', register);
router.post('/login', login);
router.post('/logout', apiLogout);

export default router;