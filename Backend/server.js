require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json()); // allows JSON body

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
