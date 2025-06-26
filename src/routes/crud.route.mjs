// src/routes/crud.route.mjs
import { Router } from 'express';
import * as crudController from '../controllers/crud.controller.mjs';
import { checkAuth } from '../middlewares/auth.middleware.mjs';

const router = Router();

// Маршруты для создания документов
router.post('/:modelName/insertOne', crudController.insertOne);
router.post('/:modelName/insertMany', crudController.insertMany);

// Маршруты для обновления документов
router.put('/:modelName/updateOne', crudController.updateOne);
router.put('/:modelName/updateMany', crudController.updateMany);
router.put('/:modelName/replaceOne', crudController.replaceOne);

// Маршруты для удаления документов
router.delete('/:modelName/deleteOne', crudController.deleteOne);
router.delete('/:modelName/deleteMany', crudController.deleteMany);

// Маршрут для расширенного чтения
router.post('/:modelName/find', crudController.find);
// Маршрут для получения всех доступных моделей
router.get('/models', crudController.getAvailableModels);
router.post('/register', crudController.register);

export default router;