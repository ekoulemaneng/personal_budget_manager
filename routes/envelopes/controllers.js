// Import db handlers
import * as dbHandlers from '../../database/dbHandlers.js';

// Add a new envelope
export const addEnvelope = async (req, res) => {
    try {
        const { title, budget } = req.body;
        // Check if the envelope title already exists
        const envelopeExists = dbHandlers.checkEnvelopeTitle(title);
        if (envelopeExists) return res.status(400).json({ message: 'Envelope title already exists' });
        // Add the envelope to the database
        const envelope = await dbHandlers.addEnvelope(title, budget);
        res.status(201).json(envelope);
    } catch (error) {
        console.error('Error adding envelope:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// Retrieve all envelopes
export const getAllEnvelopes = async (req, res) => {
    try {
        const envelopes = await dbHandlers.getAllEnvelopes();
        res.status(200).json(envelopes);
    } catch (error) {
        console.error('Error retrieving envelopes:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// Check if an envelope exists by ID
export const checkEnvelopeById = async (req, res, next, id) => {
    try {
        const envelopeExists = await dbHandlers.checkEnvelopeById(id);
        if (!envelopeExists) return res.status(404).json({ message: 'Envelope not found' });
        // If envelope exists, get the envelope by ID and attach it to the request object
        const envelope = await dbHandlers.getEnvelopeById(id);
        req.envelope = envelope;
        // Call the next middleware function
        next();
    } catch (error) {
        console.error('Error checking envelope by ID:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// Retrieve an envelope by ID
export const getEnvelopeById = async (req, res) => {
    try {
        const envelope = req.envelope;
        res.status(200).json(envelope);
    } catch (error) {
        console.error('Error retrieving envelope by ID:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// Update an envelope title by ID
export const updateEnvelopeTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        // Check if the envelope title already exists
        const envelopeExists = dbHandlers.checkEnvelopeTitle(title);
        if (envelopeExists) return res.status(400).json({ message: 'Envelope title already exists' });
        // Update the envelope title in the database
        const envelope = await dbHandlers.updateEnvelopeTitle(id, title);
        res.status(200).json(envelope);
    } catch (error) {
        console.error('Error updating envelope title:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// Update an envelope budget by id reduce the budget according to the spent amount
export const updateEnvelopeBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { expense } = req.body;
        // Update the envelope budget in the database
        const response = await dbHandlers.updateEnvelopeBudget(id, expense);
        if (response === 'Insufficient budget') return res.status(400).json({ message: 'Insufficient budget' });
        if (response === 'Envelope not found') return res.status(404).json({ message: 'Envelope not found' });
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating envelope budget:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// Transfer an envelope budget to another envelope
export const transferEnvelopeBudget = async (req, res) => {
    try {
        const { fromId, toId } = req.params;
        const { amount } = req.body;
        // Transfer the envelope budget in the database
        const response = await dbHandlers.transferEnvelopeBudget(fromId, toId, amount);
        if (response === 'Insufficient budget') return res.status(400).json({ message: 'Insufficient budget' });
        if (response === 'Envelope not found') return res.status(404).json({ message: 'Envelope not found' });
        res.status(200).json({ amount , ...response });
    } catch (error) {
        console.error('Error transferring envelope budget:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// Delete an envelope by id
export const deleteEnvelope = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete the envelope from the database
        const response = await dbHandlers.deleteEnvelope(id);
        if (response === 'Envelope not found') return res.status(404).json({ message: 'Envelope not found' });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting envelope:', error.message);
        res.status(500).json({ error: error.message });
    }
}