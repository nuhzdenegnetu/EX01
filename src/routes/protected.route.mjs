// `src/routes/protected.route.mjs`
import express from 'express';
import {isAuthenticated} from '../middlewares/auth.middleware.mjs';
import FakeUser from '../models/fakeUser.model.mjs';

const router = express.Router();

// Используем '/' вместо '/protected'
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const fakeUsers = await FakeUser.find();
        res.status(200).json({message: 'Доступ разрешен', fakeUsers});
    } catch (err) {
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

export default router;