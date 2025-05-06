const isValidJSON = value => {
    if (typeof value !== 'string') {
        return false; // If the value is not a string, return false
    }
    try {
        // Try to parse the value as JSON
        const parsed = JSON.parse(value);
        // If parsing is successful, return true
        return parsed !== null && (Array.isArray(parsed) || typeof parsed === 'object'); 
    } catch (e) {
        return false; // If parsing fails, return false
    }
}

export const httpErrorHandler = (res, error) => {
    console.error(error);
    // If error.message is a valid JSON string
    if (isValidJSON(error.message)) {
        // Parse the error message to check if it is a custom error
        const _error = JSON.parse(error.message);
        // Check if the error is a custom error
        if (Object.keys(_error).includes('status')) {
            // If it is a custom error, send the status and message
            return res.status(_error.status).json(_error.payload);
        }
    }
    // If error.message is not a valid JSON string, send a 500 status and the error message
    res.status(500).json({
        status: 500,
        payload: {
            message: 'Internal server error',
            error: error.message
        }
    });
}

export const dbErrorHandler = (error) => {
    // If exception is called up by the database
    if (typeof error === 'object' && error.hasOwnProperty('code')) {
        throw new Error(JSON.stringify({ 
            status: 400, 
            payload: {
                message: error.message,
                error: error.detail
            } 
        }));
    }
    // If the exception is not called up by the database
    if (isValidJSON(error.message)) {
        const _error = JSON.parse(error.message);
        // Check if the error is a custom error
        if (Object.keys(_error).includes('status')) {
            // If it is a custom error, send the status and message
            throw new Error(JSON.stringify({
                status: _error.status,
                payload: {
                    message: _error.payload.message,
                    error: _error.payload.error
                }
            }));
        }
    }
    // If it is not a custom error, send a 500 status and the error message
    res.status(500).json({
        status: 500,
        payload: {
            message: 'Internal server error',
            error: error.message
        }
    });
}