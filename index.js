// Import http server creator
import { createServer } from 'node:http';
// Import express app
import app from './app.js';
// Set the port
const PORT = 3000;

// Create a http server with the express app
const server = createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});