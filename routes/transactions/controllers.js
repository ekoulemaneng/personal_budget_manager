// Import the httpErrorHandler function
import { httpErrorHandler } from '../../utils/errorsHandlers.js';
// Import the db handlers
import * as db from './models.js';

// Add a new transaction
export const addTransaction = async (req, res) => {
    try {
        const { envelopeId, amount, recipient } = req.body;
        // Add the transastion to the database
        const transaction = await db.addTransaction(envelopeId, amount, recipient);
        res.status(201).json(transaction);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Retrieve all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await db.getAllTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Check if a transaction exists by ID
export const checkTransactionById = async (req, res, next, id) => {
    try {
        // Try to retrieve the transaction by ID
        const transaction = await db.getTransactionById(id);
        req.transaction = transaction;
        // Call the next middleware function
        next();
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Retrieve a transaction by ID
export const getTransactionById = async (req, res) => {
    try {
        const transaction = req.transaction;
        res.status(200).json(transaction);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Update the envelope of a transaction
export const updateTransactionEnvelope = async (req, res) => {
    try {
        const { envelopeId } = req.body;
        const transaction = req.transaction;
        // If the envelopeId is the same as the current envelope_id transaction, 
        if (transaction.envelope_id === envelopeId) {
            // throw an exception
            throw new Error(JSON.stringify({ 
                status: 400, 
                payload: {
                    message: 'The envelope ID is the same as the current envelope ID',
                    error: 'Bad request'
                } 
            }));
        }
        // Update the envelope of the transaction in the database
        const updatedTransaction = await db.updateTransactionEnvelope(transaction.id, transaction.amount, transaction.envelope_id, envelopeId);
        res.status(200).json(updatedTransaction);
    } catch (error) {
        // Hanfle http failure responses
        httpErrorHandler(res, error);
    }
}

// Update the amount of a transaction
export const updateTransactionAmount = async (req, res) => {
    try {
        const { amount } = req.body;
        const transaction = req.transaction;
        // If the amount is equal to 0, throw an exception
        if (amount <= 0) {
            throw new Error(JSON.stringify({ 
                status: 400, 
                payload: {
                    message: 'The amount must be greater than 0',
                    error: 'Bad request'
                } 
            }));
        }
        // Calculate the difference between the new amount and the current amount
        const difference = amount - transaction.amount;
        // If the amount is the same as the current amount transaction, 
        if (difference === 0) {
            // throw an exception
            throw new Error(JSON.stringify({ 
                status: 400, 
                payload: {
                    message: 'The amount is the same as the current amount',
                    error: 'Bad request'
                } 
            }));
        }
        // Update the amount of the transaction in the database
        const updatedTransaction = await db.updateTransactionAmount(transaction.id, transaction.envelope_id, amount, difference);
        res.status(200).json(updatedTransaction);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Update the recipient of a transaction
export const updateTransactionRecipient = async (req, res) => {
    try {
        const { recipient } = req.body;
        const transaction = req.transaction;
        // If the recipient is the same as the current recipient, throw an exception
        if (transaction.recipient === recipient) {
            throw new Error(JSON.stringify({ 
                status: 400, 
                payload: {
                    message: 'The recipient is the same as the current recipient',
                    error: 'Bad request'
                } 
            }));
        }
        // Update the recipient of the transaction in the database
        const updatedTransaction = await db.updateTransactionRecipient(transaction.id, recipient.trim());
        res.status(200).json(updatedTransaction);
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

// Delete a transaction
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = req.transaction;
        // Delete the transaction from the database
        await db.deleteTransaction(transaction.id, transaction.envelope_id, transaction.amount);
        res.status(204).send();
    } catch (error) {
        // Handle http failure responses
        httpErrorHandler(res, error);
    }
}

