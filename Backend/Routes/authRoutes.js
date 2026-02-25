const express = require('express');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);

export default router;
