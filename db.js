 // Import Client from 'pg';
import { title } from 'errorhandler';
import { text } from 'express';
import { Pool } from 'pg';

// Create a new Pool instance
const pool = new Pool({
    connectionString: process.env.DB_URL
});

// Add an envelope to the database
export const addEnvelope = async (title, budget) => {
    try {
        const envelope = { title, budget, remaining: budget };
        // Insert the envelope into the database
        const result = await pool.query({
            title: 'add-envelope',
            text: 'INSERT INTO envelopes (title, budget, remaining) VALUES ($1, $2, $3) RETURNING *;',
            values: [envelope.title, envelope.budget, envelope.remaining]
        });
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') {
            // Handle unique constraint violation
            throw new Error(JSON.stringify({ 
                status: 409, 
                payload: {
                    message: 'Envelope title already exists',
                    error: error.message
                } 
            }));
        }
        // Handle other errors
        throw new Error(JSON.stringify({ 
            status: 500, 
            payload: {
                message: 'Internal server error',
                error: error.message
            } 
        }));
    }
}

// Retrieve all envelopes from the database
export const getAllEnvelopes = async () => {
    try {
        // Retrieve all envelopes from the database
        const result = await pool.query({
            title: 'get-all-envelopes', 
            text: 'SELECT * FROM envelopes;'
        });
        return result.rows;
    } catch (error) {
        // Handle errors
        throw new Error(JSON.stringify({ 
            status: 500, 
            payload: {
                message: 'Internal server error',
                error: error.message
            } 
        }));
    }
}

// Retrieve an envelope by ID
export const getEnvelopeById = async (id) => {
    try {
        // Retrieve the envelope by ID from the database
        const result = await pool.query({
            title: 'get-envelope-by-id', 
            text: 'SELECT * FROM envelopes WHERE id = $1;', 
            values: [id]
        });
        if (result.rows.length === 0) {
            // If envelope does not exist, throw an error
            throw new Error(JSON.stringify({ 
                status: 404, 
                payload: {
                    message: 'Envelope not found',
                    error: `Envelope with ID ${id} not found`
                } 
            }));
        };
        // If envelope exists, return the envelope
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

// Update an envelpe title by id
export const updateEnvelopeTitle = async (id, title) => {
    try {
        // Update the envelope title in the database
        const result = await pool.query({
            title: 'update-envelope-title', 
            text: 'UPDATE envelopes SET title = $1 WHERE id = $2 RETURNING *;', 
            values: [title, id]
        });
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') {
            // Handle unique constraint violation
            throw new Error(JSON.stringify({ 
                status: 409, 
                payload: {
                    message: 'Envelope title already exists',
                    error: error.message
                } 
            }));
        }
        // Handle other errors
        throw new Error(JSON.stringify({ 
            status: 500, 
            payload: {
                message: 'Internal server error',
                error: error.message
            } 
        }));
    }
}

// Update an envelope budget by id reduce the budget according to the spent amount
export const updateEnvelopeBudget = async (id, amount) => {
    try {
        // Update the envelope budget in the database
        const result = await pool.query({
            title: 'update-envelope-budget', 
            text: 'UPDATE envelopes SET spent = spent + $1, remaining = remaining - $1 WHERE id = $2 RETURNING *;', 
            values: [amount, id]});
        return result.rows[0];
    } catch (error) {
        console.error('Error updating envelope budget:', error.code);
        if (error.code === '23514') {
            // Handle check constraint violation
            throw new Error(JSON.stringify({ 
                status: 400, 
                payload: {
                    message: 'Expense exceeds remaining budget',
                    error: error.message
                } 
            }));
        }
        // Handle other errors
        throw new Error(JSON.stringify({ 
            status: 500, 
            payload: {
                message: 'Internal server error',
                error: error.message
            } 
        }));
    }
}

// Transfer an envelope budget to another envelope
export const transferEnvelopeBudget = async (fromId, toId, amount) => {
    const client = await pool.connect();
    try {
        // Start the transaction
        await client.query('BEGIN');
        // Lock the envelopes for update
        await client.query({
            title: 'lock-envelopes',
            text: 'SELECT * FROM envelopes WHERE id IN ($1, $2) FOR UPDATE;',
            values: [fromId, toId]
        })
        // Update the source envelope
        const sourceResult = await client.query({
            title: 'update-souce-envelope',
            text: 'UPDATE envelopes SET budget = budget - $1, remaining = remaining - $1 WHERE id = $2 RETURNING *;',
            values: [amount, fromId]
        });
        // Update the target envelope
        const targetResult = await client.query({
            title: 'update-target-envelope',
            text: 'UPDATE envelopes SET budget = budget + $1, remaining = remaining + $1 WHERE id = $2 RETURNING *;',
            values: [amount, toId]
        });
        // Validate the tranction
        await client.query('COMMIT');
        // Return the result
        return { amount, source: sourceResult.rows[0], target: targetResult.rows[0] };
    } catch (error) {
        // Cancel the transaction in case of error
        await client.query('ROLLBACK');
        // Handle specific error codes
        if (error.code === '23514') {
            // Handle check constraint violation
            throw new Error(JSON.stringify({ 
                status: 400, 
                payload: {
                    message: 'Transfer exceeds remaining budget',
                    error: error.message
                } 
            }));
        }
        // Handle other errors
        throw new Error(JSON.stringify({ 
            status: 500, 
            payload: {
                message: 'Internal server error',
                error: error.message
            } 
        }));
    } finally {
        // Release the client
        await client.release();
    }
}

// Delete an envelope by id
export const deleteEnvelope = async (id) => {
    try {
        // Delete the envelope from the database
        const result = await pool.query({
            title: 'delete-envelope', 
            text: 'DELETE FROM envelopes WHERE id = $1;', 
            values: [id]
        });
        return result.rowCount > 0;
    } catch (error) {
        // Handle errors
        throw new Error(JSON.stringify({ 
            status: 500, 
            payload: {
                message: 'Internal server error',
                error: error.message
            } 
        }));
    }
}