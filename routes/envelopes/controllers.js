// Import httpErrorHandler function
import { httpErrorHandler } from '../../utils/errorsHandlers.js';
// Import the db handlers
import * as db from './models.js';

// Add a new envelope
export const addEnvelope = async (req, res) => {
    try {
        const { title, amount } = req.body;
        // Add the envelope to the database
        const envelope = await db.addEnvelope(title.trim(), amount);
        res.status(201).json(envelope);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Retrieve all envelopes
export const getAllEnvelopes = async (req, res) => {
    try {
        const envelopes = await db.getAllEnvelopes();
        res.status(200).json(envelopes);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Check if an envelope exists by ID
export const checkEnvelopeById = async (req, res, next, id) => {
    try {
        // Try to retrieve the envelope by ID
        const envelope = await db.getEnvelopeById(id);
        req.envelope = envelope;
        // Call the next middleware function
        next();
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Retrieve an envelope by ID
export const getEnvelopeById = async (req, res) => {
    try {
        const envelope = req.envelope;
        res.status(200).json(envelope);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Update an envelope title by ID
export const updateEnvelopeTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        // Update the envelope title in the database
        const envelope = await db.updateEnvelopeTitle(id, title.trim());
        res.status(200).json(envelope);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Update an envelope budget by id
export const updateEnvelopeBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        // Update the envelope budget in the database
        const response = await db.updateEnvelopeBudget(id, amount);
        res.status(200).json(response);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Transfer an envelope budget to another envelope
export const transferEnvelopeBudget = async (req, res) => {
    try {
        const { fromId, toId } = req.params;
        const { amount } = req.body;
        // Transfer the envelope budget in the database
        const response = await db.transferEnvelopeBudget(fromId, toId, amount);
        res.status(200).json(response);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Delete an envelope by id
export const deleteEnvelope = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete the envelope from the database
        await db.deleteEnvelope(id);
        res.status(204).send();
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}