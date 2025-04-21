import express from 'express';
import { submitForm, getAccessibleForms, getSingleForm, deleteForms } from '../controllers/formController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, submitForm);
router.get('/all', protect, adminOnly, getAccessibleForms) ;
router.get('/:formId', protect, getSingleForm);
router.get('/', protect, getAccessibleForms);
router.delete('/', protect, deleteForms);

export default router;