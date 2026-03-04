import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import roomRoutes from './routes/room.routes.js';
import { initSocketServer } from './socket/socketServer.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/rooms', roomRoutes);

// Error Handling block
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Initialize Socket.io
initSocketServer(httpServer);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
