// Import express and instantiate the express app
import express from 'express';
const app = express();

// Import morgan module for logging HTTP requests and responses and use it for all routes
import morgan from 'morgan';
app.use(morgan('dev'));

// Import cors module and use it for all routes
import cors from 'cors';
app.use(cors());

// Import helmet module and use it for all routes
import helmet from 'helmet';
app.use(helmet({
    contentSecurityPolicy: false
}));

// Parse JSON data and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import swagger UI and set up the documentation
import swaggerUi from 'swagger-ui-express';
// Import readFile from fs/promises
import { readFile } from 'fs/promises';
// Import the OpenAPI JSON file and build the documentation
const swaggerDocument = JSON.parse(await readFile(new URL('./openapi.json', import.meta.url)));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import routes and use them as middleware
import indexRouter from './routes/index.js';
app.use('/api', indexRouter);

// Import error handler module and use it for all routes
import errorHandler from 'errorhandler';
app.use(errorHandler());

// Handle server error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.stack });
})

// Export the app
export default app;