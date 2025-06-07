import express from 'express';

const router = express.Router();

// Сохранение темы в cookies
router.post('/set-theme', (req, res) => {
    const { theme } = req.body;

    if (!theme) {
        return res.status(400).json({ message: 'Тема не указана' });
    }

    // Устанавливаем cookie с темой на 30 дней
    res.cookie('theme', theme, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.json({ message: 'Тема сохранена', theme });
});

// Получение текущей темы из cookies
router.get('/get-theme', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.json({ theme });
});

export default router;