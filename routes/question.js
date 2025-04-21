import express from 'express';
import { addQuestion, getQuestions, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:templateId', protect, addQuestion);
router.get('/:templateId', getQuestions);
router.put('/:id', protect, updateQuestion);
router.delete('/:questionId', protect, deleteQuestion);


export default router;