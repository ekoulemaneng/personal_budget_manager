// Import express and get the Router
import express from 'express';
const router = express.Router();

// Import envelope routes and use them as middleware
import envelopesRouter from './envelopes/routes.js';
router.use('/envelopes', envelopesRouter);

// Import transaction routes and use them as middleware
import transactionsRouter from './transactions/routes.js';
router.use('/transactions', transactionsRouter);

// Export the router
export default router;