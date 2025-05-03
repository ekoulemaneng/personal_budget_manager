const routeErrorsHandler = (res, error) => {
    console.error(error);
    // Parse the error message to check if it is a custom error
    const _error = JSON.parse(error.message);
    // Check if the error is a custom error
    if (Object.keys(_error).includes('status')) {
        // If it is a custom error, send the status and message
        return res.status(_error.status).json(_error.payload);
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

export default routeErrorsHandler;