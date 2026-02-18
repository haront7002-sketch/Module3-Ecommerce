import cors from 'cors';
import express from 'express';
import {cartRoutes} from './Routes/cartRoute.js';
import {favouriteRoutes} from './Routes/favouriteRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', favouriteRoutes);
app.use('/api', cartRoutes);


// Test route
app.get('/', (req, res) => {
    res.send('South of Somewhere API is running');
});

// Start server
app.listen(PORT, () =>{
    console.log("http://localhost:3000");
    console.log(`Server running on port ${PORT}`);
});
