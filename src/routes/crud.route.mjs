// src/routes/crud.route.mjs
import { Router } from 'express';
import * as crudController from '../controllers/crud.controller.mjs';
import { checkAuth } from '../middlewares/auth.middleware.mjs';

const router = Router();

// Маршруты для CRUD операций с моделями
router.post('/:modelName', crudController.insertOne); // Создание документа
router.get('/:modelName', crudController.find); // Получение документов
router.put('/:modelName', crudController.updateOne); // Обновление документа
router.delete('/:modelName', crudController.deleteOne); // Удаление документа

// Оставляем старые маршруты для обратной совместимости
router.post('/:modelName/insertOne', crudController.insertOne);
router.post('/:modelName/insertMany', crudController.insertMany);
router.put('/:modelName/updateOne', crudController.updateOne);
router.put('/:modelName/updateMany', crudController.updateMany);
router.put('/:modelName/replaceOne', crudController.replaceOne);
router.delete('/:modelName/deleteOne', crudController.deleteOne);
router.delete('/:modelName/deleteMany', crudController.deleteMany);
router.post('/:modelName/find', crudController.find);

// Маршрут для получения всех доступных моделей
router.get('/models', crudController.getAvailableModels);
router.post('/register', crudController.register);

export default router;