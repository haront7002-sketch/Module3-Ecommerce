import cors from 'cors';
import express from 'express';
import {favouriteRoutes} from './Routes/favouriteRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', favouriteRoutes);


app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});