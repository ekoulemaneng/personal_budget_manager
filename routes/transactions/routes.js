// Import express and get the Router
import express from 'express';
const router = express.Router();

// Import the validator middleware
import validator from '../../middlewares/inputsValidator.js';

// Import the schema for envelope validation
import * as schemas from './schemas.js';

// Import the controllers
import * as controllers from './controllers.js';

// Check by ID if the transaction exists
router.param('id', controllers.checkTransactionById);

// Add a new transaction
router.post('/', validator(schemas.addTransaction), controllers.addTransaction);

// Retrieve all transactions
router.get('/', validator(schemas.getAllTransactions), controllers.getAllTransactions);

// Retrieve a transaction by ID
router.get('/:id', validator(schemas.getTransactionById), controllers.getTransactionById);

// Delete a transaction
router.delete('/:id', validator(schemas.deleteTransaction), controllers.deleteTransaction);

// Update the envelope of a transaction
router.post('/:id/envelope', validator(schemas.updateTransactionEnvelope), controllers.updateTransactionEnvelope);

// Update the amount of a transaction
router.post('/:id/amount', validator(schemas.updateTransactionAmount), controllers.updateTransactionAmount);

// Update the recipient of a transaction
router.post('/:id/recipient', validator(schemas.updateTransactionRecipient), controllers.updateTransactionRecipient);

// Export the router
export default router;