import cors from 'cors';
import express from 'express';
import {cartRoutes} from './Routes/cartRoute.js';
import {favouriteRoutes} from './Routes/favouriteRoute.js';
import authRoutes from './Routes/authRoutes.js';
import { orderRoutes } from './Routes/orderRoutes.js';
import { ticketRoutes } from './Routes/ticketRoutes.js';

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


// Test route
app.get('/', (req, res) => {
    res.send('South of Somewhere API is running');
});

// Start server
app.listen(PORT, () =>{
    console.log("http://localhost:3000");
    console.log(`Server running on port ${PORT}`);
});
