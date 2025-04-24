import express from 'express';
import { getAllUsers, toggleAdminStatus, toggleBlockStatus, deleteUsers, autoCompleteUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllUsers);

router.delete('/', protect, adminOnly, deleteUsers);

router.put('/toggle-admin', protect, adminOnly, toggleAdminStatus);

router.put('/toggle-block', protect, adminOnly, toggleBlockStatus);

router.get('/search', protect, autoCompleteUsers);

export default router;