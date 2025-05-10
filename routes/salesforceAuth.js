import express from 'express';
import { getSalesforceAuthURL, salesforceCallback } from '../controllers/salesforceAuthController.js';

const router = express.Router();

router.get('/login', getSalesforceAuthURL); // /api/sf/login
router.get('/callback', salesforceCallback); // /api/sf/callback

export default router;
