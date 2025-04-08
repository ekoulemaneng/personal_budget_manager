// JSONSchemas for input validation

// Schema for adding a new envelope
export const addEnvelope = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    minLength: 1,
                },
                budget: {
                    type: 'number',
                    minimum: 0,
                },
            },
            required: ['title', 'budget'],
            additionalProperties: false,
        }
    },
    required: ['body'],
    additionalProperties: true,
}

// Schema for getting all envelopes
export const getAllEnvelopes = {
    type: 'object',
    properties: {
        query: {
            type: 'object',
            properties: {
                page: {
                    type: 'number',
                    minimum: 1,
                },
                limit: {
                    type: 'number',
                    minimum: 1,
                },
            },
            additionalProperties: false,
        }
    },
    required: ['query'],
    additionalProperties: true,
}

// Schema for getting an envelope by ID
export const getEnvelopeById = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    minimum: 1
                },
            },
            required: ['id'],
            additionalProperties: false,
        }
    },
    required: ['params'],
    additionalProperties: true,
}

// Schema for updating an envelope title
export const updateEnvelopeTitle = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    minimum: 1
                },
            },
            required: ['id'],
            additionalProperties: false,
        },
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    minLength: 1,
                },
            },
            required: ['title'],
            additionalProperties: false,
        }
    },
    required: ['params', 'body'],
    additionalProperties: true,
}

// Schema for updating an envelope budget
export const updateEnvelopeBudget = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    minimum: 1
                },
            },
            required: ['id'],
            additionalProperties: false,
        },
        body: {
            type: 'object',
            properties: {
                expense: {
                    type: 'number',
                    minimum: 1,
                },
            },
            required: ['expense'],
            additionalProperties: false,
        }
    },
    required: ['params', 'body'],
    additionalProperties: true,
}

// Schema for deleting an envelope
export const deleteEnvelope = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    minimum: 1
                },
            },
            required: ['id'],
            additionalProperties: false,
        }
    },
    required: ['params'],
    additionalProperties: true,
}

// Schema for transferring an envelope budget
export const transferEnvelopeBudget = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                fromId: {
                    type: 'number',
                    minimum: 1
                },
                toId: {
                    type: 'number',
                    minimum: 1
                },
            },
            required: ['fromId', 'toId'],
            additionalProperties: false,
        },
        body: {
            type: 'object',
            properties: {
                amount: {
                    type: 'number',
                    minimum: 1,
                },
            },
            required: ['amount'],
            additionalProperties: false,
        }
    },
    required: ['params', 'body'],
    additionalProperties: true,
}