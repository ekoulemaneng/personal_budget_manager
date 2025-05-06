// Import the pool instance
import { pool } from '../../config.js'
// Import the dbErrorHandler function
import { dbErrorHandler } from '../../utils/errorsHandlers.js';

// Add an transaction to the database
export const addTransaction = async (envelopeId, amount, recipient) => {
    const client = await pool.connect();
    try {
        // Start the transaction
        await client.query('BEGIN');
        // Lock the envelope row for update
        await client.query({
            title: 'lock-envelope',
            text: 'SELECT * FROM envelopes WHERE id = $1 FOR UPDATE;',
            values: [envelopeId]
        });
        // Simultaneously, update  the envelope (spent and remaining amounts) and insert the transaction
        const [envelopeResult, transactionResult] = await Promise.all([
            client.query({
                title: 'update-envelope-budget',
                text: 'UPDATE envelopes SET spent = spent + $1, remaining = remaining - $1 WHERE id = $2 RETURNING *;',
                values: [amount, envelopeId]
            }),
            client.query({
                title: 'add-transaction',
                text: 'INSERT INTO transactions (envelope_id, amount, recipient) VALUES ($1, $2, $3) RETURNING *;',
                values: [envelopeId, amount, recipient]
            })
        ]);
        // If the envelope is not found, throw an error
        if (envelopeResult.rowCount === 0) {
            throw new Error(JSON.stringify({ 
                status: 400, 
                payload: {
                    message: 'Envelope not found',
                    error: 'Bad request'
                } 
            }));
        }
        // Commit the transaction
        await client.query('COMMIT');
        // Return the transaction
        return transactionResult.rows[0];
    } catch (error) {
        // Rollback the transaction
        await client.query('ROLLBACK');
        // Handle errors
        dbErrorHandler(error);
    } finally {
        // Release the client
        await client.release();
    }
}

// Retrieve all transactions from the database
export const getAllTransactions = async () => {
    try {
        // Retrieve all transactions from the database
        const result = await pool.query({
            title: 'get-transactions',
            text: 'SELECT * FROM transactions;',
        });
        return result.rows;
    }
    catch (error) {
        // Handle errors
        dbErrorHandler(error);
    }
}

// Retrieve a transaction by id from the database
export const getTransactionById = async (id) => {
    try {
        // Retrieve the transaction by id from the database
        const result = await pool.query({
            title: 'get-transaction-by-id',
            text: 'SELECT * FROM transactions WHERE id = $1;',
            values: [id]
        });
        // If the transaction is not found, throw an error
        if (result.rowCount === 0) {
            throw new Error(JSON.stringify({ 
                status: 404, 
                payload: {
                    message: 'Transaction not found',
                    error: 'Not found'
                } 
            }));
        }
        return result.rows[0];
    } catch (error) {
        // Handle errors
        dbErrorHandler(error);
    }
}

// Update the envelope of a transaction in the database
export const updateTransactionEnvelope = async (transactionId, amount, oldEnvelopeId, newEnvelopeId) => {
    const client = await pool.connect();
    try {
        // Start the transaction
        await client.query('BEGIN');
        // Lock the envelope and transaction rows for update
        await Promise.all([
            await client.query({
                title: 'lock-transaction',
                text: 'SELECT * FROM transactions WHERE id = $1 FOR UPDATE;',
                values: [transactionId]
            }),
            await client.query({
                title: 'lock-old-envelope',
                text: 'SELECT * FROM envelopes WHERE id = $1 FOR UPDATE;',
                values: [oldEnvelopeId]
            }),
            await client.query({
                title: 'lock-new-envelope',
                text: 'SELECT * FROM envelopes WHERE id = $1 FOR UPDATE;',
                values: [newEnvelopeId]
            })
        ]);
        // Simultaneously:
        // 1- reverse the update of the envelope spent and remaining amounts
        // 2- update the envelope spent and remaining amounts
        // 3- update the envelope of the transaction in the database
        const [_, __, transactionResult] = await Promise.all([
            client.query({
                title: 'reverse-update-spent-and-remaining-old-envelope-budgets',
                text: 'UPDATE envelopes SET spent = spent - $1, remaining = remaining + $1 WHERE id = $2;',
                values: [amount, oldEnvelopeId]
            }),
            client.query({
                title: 'update-spent-and-remaining-new-envelope-budgets',
                text: 'UPDATE envelopes SET spent = spent + $1, remaining = remaining - $1 WHERE id = $2;',
                values: [amount, newEnvelopeId]
            }),
            client.query({
                title: 'update-transaction-envelope_id',
                text: 'UPDATE transactions SET envelope_id = $1 WHERE id = $2 RETURNING *;', 
                values: [newEnvelopeId, transactionId]
            })
        ]);
        // Commit the transaction
        await client.query('COMMIT');
        // Return the transaction
        return transactionResult.rows[0];
    } catch (error) {
        // Rollback the transaction
        await client.query('ROLLBACK');
        // Handle errors
        dbErrorHandler(error);
    } finally {
        // Release the client
        await client.release();
    }
}

// Update the amount of a transaction in the database
export const updateTransactionAmount = async (transactionId, envelopeId, amount, difference) => {
    const client = await pool.connect();
    try {
        // Start the transaction
        await client.query('BEGIN');
        // Lock the envelope and the transaction rows for update
        await Promise.all([
            await client.query({
                title: 'lock-envelope',
                text: 'SELECT * FROM envelopes WHERE id = $1 FOR UPDATE;',
                values: [envelopeId]
            }),
            await client.query({
                title: 'lock-transaction',
                text: 'SELECT * FROM transactions WHERE id = $1 FOR UPDATE;',
                values: [transactionId]
            })
        ]);
        // Simultaneously:
        // 1- reverse the update of the envelope spent and remaining amounts
        // 2- update the transaction amount
        const [envelopeResult, transactionResult] = await Promise.all([
            client.query({
                title: 'reverse-update-spent-and-remaining-envelope-budgets',
                text: 'UPDATE envelopes SET spent = spent + $1, remaining = remaining - $1 WHERE id = $2 RETURNING *;',
                values: [difference, envelopeId]
            }),
            client.query({
                title: 'update-transaction-amount',
                text: 'UPDATE transactions SET amount = $1 WHERE id = $2 RETURNING *;',
                values: [amount, transactionId]
            })
        ]);
        // If the envelope is not found, throw an exception
        if (envelopeResult.rows.length === 0) {
            throw new Error(JSON.stringify({ 
                status: 400, 
                payload: {
                    message: 'Envelope not found',
                    error: 'Bad request'
                } 
            }));
        }
        // Commit the transaction
        await client.query('COMMIT');
        // Return the transaction
        return transactionResult.rows[0];
    } catch (error) {
        // Rollback the transaction
        await client.query('ROLLBACK');
        // Handle errors
        dbErrorHandler(error);
    } finally {
        // Release the client
        await client.release();
    }
}

// Update the recipient of a transaction in the database
export const updateTransactionRecipient = async (transactionId, recipient) => {
    try {
        // Update the recipient of the transaction in the database
        const result = await pool.query({
            title: 'update-transaction-recipient',
            text: 'UPDATE transactions SET recipient = $1 WHERE id = $2 RETURNING *;',
            values: [recipient, transactionId]
        });
        // Return the transaction
        return result.rows[0];
    } catch (error) {
        // Handle errors
        dbErrorHandler(error);
    }
}

// Delete a transaction from the database
export const deleteTransaction = async (transactionId, envelopeId, amount) => {
    const client = await pool.connect();
    try {
        // Start the transaction
        await client.query('BEGIN');
        // Lock the envelope and transaction rows for update
        await Promise.all([
            await client.query({
                title: 'lock-transaction',
                text: 'SELECT * FROM transactions WHERE id = $1 FOR UPDATE;',
                values: [transactionId]
            }),
            await client.query({
                title: 'lock-envelope',
                text: 'SELECT * FROM envelopes WHERE id = $1 FOR UPDATE;',
                values: [envelopeId]
            })
        ]);
        // Simultaneously:
        // 1- reverse the update of the envelope spent and remaining amounts
        // 2- delete the transaction from the database
        const [envelopeResult, transactionResult] = await Promise.all([
            client.query({
                title: 'reverse-update-spent-and-remaining-envelope-budgets',
                text: 'UPDATE envelopes SET spent = spent - $1, remaining = remaining + $1 WHERE id = $2 RETURNING *;',
                values: [amount, envelopeId]
            }),
            client.query({
                title: 'delete-transaction',
                text: 'DELETE FROM transactions WHERE id = $1 RETURNING *;',
                values: [transactionId]
            })
        ]);
        // If the envelope is not found, throw an exception
        if (envelopeResult.rows.length === 0) {
            throw new Error(JSON.stringify({ 
                status: 400, 
                payload: {
                    message: 'Envelope not found',
                    error: 'Bad request'
                } 
            }));
        }
        // If the transaction is not found, throw an exception
        if (transactionResult.rows.length === 0) {
            throw new Error(JSON.stringify({ 
                status: 500, 
                payload: {
                    message: 'Internal server error',
                    error: 'Failed to delete transaction'
                } 
            }));
        }
        // Commit the transaction
        await client.query('COMMIT');
        // Return the transaction
        return;
    } catch (error) {
        // Rollback the transaction
        await client.query('ROLLBACK');
        // Handle errors
        dbErrorHandler(error);
    } finally {
        // Release the client
        await client.release();
    }
}