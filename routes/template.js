import express from 'express';
import { createTemplate, getUserTemplates, getTemplateById, getAllTemplates, updateTemplate, searchTemplatesByTag, deleteTemplate } from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';



const router = express.Router();

router.post('/', protect, createTemplate);
router.get('/mine', protect, getUserTemplates);
router.get('/search', protect, searchTemplatesByTag);
router.get('/:id', getTemplateById);
router.get('/', protect, getAllTemplates); // for unauthenticated users
router.put('/:id', protect, updateTemplate);
router.delete('/:id', protect, deleteTemplate);


export default router;