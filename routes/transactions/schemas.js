// JSONSchemas for input validation

// Schema for adding a new envelope
export const addTransaction = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                envelopeId: {
                    type: 'number',
                    minimum: 1,
                },
                amount: {
                    type: 'number',
                    minimum: 0,
                },
                recipient: {
                    type: 'string',
                    minLength: 1,
                }
            },
            required: ['envelopeId', 'amount', 'recipient'],
            additionalProperties: false
        }
    },
    required: ['body'],
    additionalProperties: true,
}

// Schema for retrieving all transactions
export const getAllTransactions = {
    type: 'object',
    properties: {},
    additionalProperties: true
}

// Schema for retrieving a transaction by ID
export const getTransactionById = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    minimum: 1,
                }
            },
            required: ['id'],
            additionalProperties: false
        }
    },
    required: ['params'],
    additionalProperties: true
}

// Schema for updating the envelope of a transaction
export const updateTransactionEnvelope = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    minimum: 1,
                }
            },
            required: ['id'],
            additionalProperties: false
        },
        body: {
            type: 'object',
            properties: {
                envelopeId: {
                    type: 'number',
                    minimum: 1,
                }
            },
            required: ['envelopeId'],
            additionalProperties: false
        }
    },
    required: ['params', 'body'],
    additionalProperties: true
}

// Schema for updating the amount of a transaction
export const updateTransactionAmount = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    minimum: 1,
                }
            },
            required: ['id'],
            additionalProperties: false
        },
        body: {
            type: 'object',
            properties: {
                amount: {
                    type: 'number',
                    minimum: 0,
                }
            },
            required: ['amount'],
            additionalProperties: false
        }
    },
    required: ['params', 'body'],
    additionalProperties: true
}

// Schema for updating the recipient of a transaction
export const updateTransactionRecipient = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    minimum: 1,
                }
            },
            required: ['id'],
            additionalProperties: false
        },
        body: {
            type: 'object',
            properties: {
                recipient: {
                    type: 'string',
                    minLength: 1,
                }
            },
            required: ['recipient'],
            additionalProperties: false
        }
    },
    required: ['params', 'body'],
    additionalProperties: true
}

// Schema for deleting a transaction
export const deleteTransaction = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    minimum: 1,
                }
            },
            required: ['id'],
            additionalProperties: false
        }
    },
    required: ['params'],
    additionalProperties: true
}