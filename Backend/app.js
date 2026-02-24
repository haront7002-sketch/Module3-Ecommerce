import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import {cartRoutes} from './Routes/cartRoutes.js';
import {favouriteRoutes} from './Routes/favouriteRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import { orderRoutes } from './Routes/orderRoutes.js';
import { ticketRoutes } from './Routes/ticketRoutes.js';
import { categoryRoutes } from './Routes/categoryRoutes.js';
import { eventRoutes } from './Routes/eventRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', favouriteRoutes);
app.use('/api', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', ticketRoutes);
app.use('/api', categoryRoutes);
app.use('/api', eventRoutes);


// Test route
app.get('/', (req, res) => {
    res.send('South of Somewhere API is running');
});

// Start server
app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});
