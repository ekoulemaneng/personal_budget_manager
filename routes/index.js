// Import express and get the Router
import express from 'express';
const router = express.Router();

// Import routes and use them as middleware
import envelopesRouter from './envelopes/routes.js';
router.use('/envelopes', envelopesRouter);

// Export the router
export default router;