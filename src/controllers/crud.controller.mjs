import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

// Вспомогательная функция для получения модели по имени с исправлением
const getModelByName = (modelName) => {
  try {
    // Пытаемся получить модель, как есть
    return mongoose.model(modelName);
  } catch (error) {
    try {
      // Пробуем привести первую букву к верхнему регистру
      const capitalizedName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
      return mongoose.model(capitalizedName);
    } catch (innerError) {
      try {
        // Пробуем привести все к нижнему регистру
        return mongoose.model(modelName.toLowerCase());
      } catch (finalError) {
        // Если не получилось - выводим список доступных моделей
        const availableModels = mongoose.modelNames().join(", ");
        throw new Error(`Модель '${modelName}' не найдена. Доступные модели: ${availableModels}`);
      }
    }
  }
};
// Создание одного документа
// Модификация метода insertOne
export const insertOne = async (req, res, next) => {
  try {
    const { modelName } = req.params;
    const data = req.body;

    console.log(`Попытка создания документа в модели ${modelName}`);
    console.log('Данные для вставки:', data);

    const Model = getModelByName(modelName);
    console.log('Модель найдена:', Model.modelName);

    // Специальная обработка для модели AuthUser
    if (Model.modelName === 'AuthUser' && data.password) {
      // Хеширование пароля перед сохранением
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
      console.log('Пароль захеширован');

      // Создаем токен для пользователя
      const token = jwt.sign(
        { email: data.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Добавляем токен в данные пользователя
      data.token = token;
      console.log('Токен добавлен в данные пользователя');
    }

    const newDocument = new Model(data);
    const savedDocument = await newDocument.save();

    console.log('Документ сохранен:', savedDocument);

    res.status(201).json({
      success: true,
      data: savedDocument
    });
  } catch (error) {
    console.error('Ошибка при создании документа:', error);
    next(error);
  }
};

// Аналогичные изменения для insertMany
export const insertMany = async (req, res, next) => {
  try {
    const { modelName } = req.params;
    const documents = req.body;

    if (!Array.isArray(documents)) {
      return res.status(400).json({
        success: false,
        message: 'Требуется массив документов'
      });
    }

    const Model = getModelByName(modelName);

    // Специальная обработка для модели AuthUser
    if (Model.modelName === 'AuthUser') {
      const saltRounds = 10;
      // Хешируем пароли для всех пользователей в массиве
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].password) {
          documents[i].password = await bcrypt.hash(documents[i].password, saltRounds);
        }
      }
    }

    const savedDocuments = await Model.insertMany(documents);

    // Для пользователей не будем генерировать массив токенов
    // Это можно реализовать отдельно, если нужно
    res.status(201).json({
      success: true,
      data: savedDocuments
    });
  } catch (error) {
    console.error('Ошибка при создании документов:', error);
    next(error);
  }
};

// Обновление одного документа
export const updateOne = async (req, res, next) => {
  try {
    const { modelName } = req.params;
    const { filter, update, options = {} } = req.body;

    if (!filter || !update) {
      return res.status(400).json({
        success: false,
        message: 'Требуются поля filter и update'
      });
    }

    const Model = getModelByName(modelName);

    // Обработка для модели AuthUser - хешируем пароль при обновлении
    if (Model.modelName === 'AuthUser' && update.$set && update.$set.password) {
      const saltRounds = 10;
      update.$set.password = await bcrypt.hash(update.$set.password, saltRounds);
    }

    const result = await Model.updateOne(filter, update, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Ошибка при обновлении документа:', error);
    next(error);
  }
};

// Обновление множества документов
export const updateMany = async (req, res, next) => {
  try {
    const { modelName } = req.params;
    const { filter, update, options = {} } = req.body;

    if (!filter || !update) {
      return res.status(400).json({
        success: false,
        message: 'Требуются поля filter и update'
      });
    }

    const Model = getModelByName(modelName);

    // Обработка для модели AuthUser - хешируем пароль при обновлении
    if (Model.modelName === 'AuthUser' && update.$set && update.$set.password) {
      const saltRounds = 10;
      update.$set.password = await bcrypt.hash(update.$set.password, saltRounds);
    }

    const result = await Model.updateMany(filter, update, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Ошибка при обновлении документов:', error);
    next(error);
  }
};
// Полная замена документа
export const replaceOne = async (req, res, next) => {
  try {
    const { modelName } = req.params;
    const { filter, replacement, options = {} } = req.body;

    if (!filter || !replacement) {
      return res.status(400).json({
        success: false,
        message: 'Требуются поля filter и replacement'
      });
    }

    const Model = getModelByName(modelName);
    const result = await Model.replaceOne(filter, replacement, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Удаление одного документа
export const deleteOne = async (req, res, next) => {
  try {
    const { modelName } = req.params;
    const { filter } = req.body;

    if (!filter) {
      return res.status(400).json({
        success: false,
        message: 'Требуется поле filter'
      });
    }

    const Model = getModelByName(modelName);
    const result = await Model.deleteOne(filter);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Удаление множества документов
export const deleteMany = async (req, res, next) => {
  try {
    const { modelName } = req.params;
    const { filter } = req.body;

    if (!filter) {
      return res.status(400).json({
        success: false,
        message: 'Требуется поле filter'
      });
    }

    const Model = getModelByName(modelName);
    const result = await Model.deleteMany(filter);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Расширенное чтение с поддержкой проекции
export const find = async (req, res, next) => {
  try {
    const { modelName } = req.params;
    const { filter = {}, projection = null, options = {} } = req.body;

    const Model = getModelByName(modelName);
    const documents = await Model.find(filter, projection, options);

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

// Специализированная функция для регистрации пользователя
export const register = async (req, res, next) => {
  try {
    const userData = req.body;

    if (!userData.email || !userData.password) {
      return res.status(400).json({
        success: false,
        message: 'Email и пароль обязательны'
      });
    }

    // Получаем модель пользователя
    const UserModel = getModelByName('AuthUser');

    // Проверяем, существует ли пользователь
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Хешируем пароль
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);

    // Генерируем JWT токен
    const token = jwt.sign(
      { email: userData.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Добавляем токен в данные пользователя
    userData.token = token;

    // Создаем пользователя
    const newUser = new UserModel(userData);
    const savedUser = await newUser.save();

    // Отправляем ответ с токеном
    res.status(201).json({
      success: true,
      data: savedUser
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    next(error);
  }
};

// Получение списка доступных моделей
export const getAvailableModels = (req, res) => {
  try {
    const models = mongoose.modelNames();

    res.json({
      success: true,
      count: models.length,
      data: models
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};