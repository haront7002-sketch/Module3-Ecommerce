import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import {cartRoutes} from './Routes/cartRoutes.js';
import {favouriteRoutes} from './Routes/favouriteRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import { orderRoutes } from './Routes/orderRoutes.js';
import { ticketRoutes } from './Routes/ticketRoutes.js';
import { eventRoutes } from './Routes/eventRoutes.js';
import { categoryRoutes } from './Routes/categoryRoutes.js';
import { preferenceRoutes } from './Routes/preferenceRoutes.js';
import userRoutes from './Routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  
// Routes
app.use('/', favouriteRoutes);
app.use('/', cartRoutes);
app.use('/auth', authRoutes);
app.use('/', orderRoutes);
app.use('/', ticketRoutes);
app.use('/', categoryRoutes);
app.use('/', eventRoutes);
app.use('/', preferenceRoutes);
app.use('/', userRoutes);


// Test route
app.get('/', (req, res) => {
    res.send('South of Somewhere API is running');
});

// Start server
app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});
