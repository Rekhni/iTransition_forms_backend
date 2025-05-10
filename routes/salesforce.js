import express from 'express';
import { createSalesforceAccountAndContact } from '../controllers/salesforceController.js';

const router = express.Router();
router.post('/create-account-contact', createSalesforceAccountAndContact);
export default router;
