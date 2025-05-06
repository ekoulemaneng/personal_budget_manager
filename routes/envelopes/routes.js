// Import express and get the Router
import express from 'express';
const router = express.Router();

// Import the validator middleware
import validator from '../../middlewares/inputsValidator.js';

// Import the schema for envelope validation
import * as schemas from './schemas.js';

// Import the controllers
import * as controllers from './controllers.js';

// Check by ID if the envelope exists
router.param('id', controllers.checkEnvelopeById);

// Check by fromId if the envelope exists
router.param('fromId', controllers.checkEnvelopeById);

// Check by toId if the envelope exists
router.param('toId', controllers.checkEnvelopeById);

// Add a new envelope
router.post('/', validator(schemas.addEnvelope), controllers.addEnvelope);

// Retrieve all envelopes
router.get('/', validator(schemas.getAllEnvelopes), controllers.getAllEnvelopes);

// Retrieve an envelope by ID
router.get('/:id', validator(schemas.getEnvelopeById), controllers.getEnvelopeById);

// Update an envelope title by ID
router.post('/:id/title', validator(schemas.updateEnvelopeTitle), controllers.updateEnvelopeTitle);

// Update an envelope budget by id
router.post('/:id/budget', validator(schemas.updateEnvelopeBudget), controllers.updateEnvelopeBudget);

// Transfer an envelope budget to another envelope
router.post('/transfer/:fromId/:toId', validator(schemas.transferEnvelopeBudget), controllers.transferEnvelopeBudget);

// Delete an envelope by ID
router.delete('/:id', validator(schemas.deleteEnvelope), controllers.deleteEnvelope);

// Export the router
export default router;