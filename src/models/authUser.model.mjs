// `src/models/authUser.model.mjs`
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const authUserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String } // Поле для хранения токена
});

// Хэширование пароля перед сохранением
authUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.model('AuthUser', authUserSchema);