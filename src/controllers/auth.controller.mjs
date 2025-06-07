import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const users = []; // В реальном приложении использую базу данных

const SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjkzNzY4MDAwLCJleHAiOjE2OTM3NzE2MDB9.4f5c8b1a2d3e4f5g6h7i8j9k0lmnopqrstuvwx';

export const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Имя пользователя и пароль обязательны' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'Пользователь зарегистрирован' });
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Вход выполнен', token });
};