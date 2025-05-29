import express from 'express';
import { getHomePage } from '../controllers/index.controller.mjs';

const router = express.Router();

router.get('/', getHomePage);

export default router;