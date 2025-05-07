// routes/googleAuth.js

import express from 'express';
import { getGoogleAuthURL, googleCallback } from '../controllers/googleAuthController.js';

const router = express.Router();

router.get('/google', getGoogleAuthURL); // → /auth/google
router.get('/google/callback', googleCallback); // → /auth/google/callback

export default router;
