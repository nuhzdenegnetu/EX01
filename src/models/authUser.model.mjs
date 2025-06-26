// `src/models/authUser.model.mjs`
import mongoose from 'mongoose';

const authUserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: String, // Поле для хранения токена
}, {timestamps: true});

// Удаляем хук pre('save') для предотвращения двойного хеширования
// Хеширование будем делать только в контроллерах

export default mongoose.model('AuthUser', authUserSchema);