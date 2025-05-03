// Import ajv module
import Ajv from 'ajv';

// Create an instance of Ajv
const ajv = new Ajv({ allErrors: false, coerceTypes: true });

// Define the middleware function
const validator = (schema) => {
  return (req, res, next) => {
    // Validate the request body against the schema
    const validate = ajv.compile(schema);
    // Create an empty data object
    const data = {};
    // Populate the data object with request data
    // If req.params has data, add a params key in the object data
    if (req.params) data.params = req.params;
    // If req.headers has data, add a headers key in the object data
    if (req.headers) data.headers = req.headers;
    // If req.cookies has data, add a cookies key in the object data
    if (req.cookies) data.cookies = req.cookies;
    // If req.query has data, add a query key in the object data
    if (req.query) data.query = req.query;
    // If req.body has data, add a body key in the object data
    if (req.body) data.body = req.body;
    // If req.files has data, add a files key in the object data
    if (req.files) data.files = req.files;
    // Validate the data against the schema
    const valid = validate(data);
    // If validation fails, send a 400 Bad Request response with the validation errors
    if (!valid) {
      return res.status(400).json({
        message: 'Invalid request data',
        error: validate.errors,
      });
    }
    // If validation succeeds, call the next middleware function
    next();
  }
}

export default validator;