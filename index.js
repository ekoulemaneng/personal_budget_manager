// Import http server creator
import { createServer } from 'node:http';
// Import express app
import app from './app.js';
// Import the port number
import { PORT } from './config.js';

// Create a http server with the express app
const server = createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});