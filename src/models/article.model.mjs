// src/models/article.model.mjs (обновленная версия)
import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Заголовок статьи обязателен'],
    trim: true,
    minlength: [5, 'Заголовок должен содержать минимум 5 символов'],
    maxlength: [200, 'Заголовок не может быть длиннее 200 символов']
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: [true, 'Содержание статьи обязательно'],
    minlength: [10, 'Содержание должно быть минимум 10 символов']
  },
  summary: {
    type: String,
    maxlength: [500, 'Краткое описание не может быть длиннее 500 символов']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser'
  },
  authorName: {
    type: String,
    default: 'Анонимный автор'
  },
  category: {
    type: String,
    enum: ['Технологии', 'Разработка', 'JavaScript', 'Node.js', 'База данных',
           'Фронтенд', 'Бэкенд', 'DevOps', 'Искусственный интеллект',
           'Мобильная разработка', 'Другое'],
    default: 'Другое'
  },
  tags: [{
    type: String,
    trim: true
  }],
  published: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  readingTime: {
    type: String,
    default: '5 мин'
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Индексы для быстрого поиска
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Article = mongoose.model('Article', articleSchema);

export default Article;