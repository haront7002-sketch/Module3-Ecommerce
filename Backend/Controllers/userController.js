import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

const getJwtConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const secret = process.env.JWT_SECRET || (!isProduction ? 'local-dev-jwt-secret-change-me' : '');
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!secret) {
        const err = new Error('Missing JWT_SECRET');
        err.code = 'JWT_CONFIG_MISSING';
        throw err;
    }

    return { secret, expiresIn };
};

const register = async (req, res) => {
    try {
        const { secret, expiresIn } = getJwtConfig();
        const { user_name, user_surname, email, password, country, zip_code, area } = req.body;
        const normalizedEmail = (email || '').trim().toLowerCase();

        if (!user_name || !user_surname || !normalizedEmail || !password) {
            return res.status(400).json({ message: "Name, surname, email and password are required" });
        }

        if (String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findByEmail(normalizedEmail);
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            user_name,
            user_surname,
            email: normalizedEmail,
            password: hashedPassword,
            country,
            zip_code,
            area
        });

        const token = jwt.sign(
            { user_id: user.user_id },
            secret,
            { expiresIn }
        );

        res.status(201).json({ message: "User created", token });

    } catch (error) {
        if (error?.code === 'JWT_CONFIG_MISSING') {
            return res.status(500).json({ message: "Server auth configuration missing (JWT_SECRET)" });
        }
        if (error?.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { secret, expiresIn } = getJwtConfig();
        const { email, password } = req.body;
        const normalizedEmail = (email || '').trim().toLowerCase();

        const user = await User.findByEmail(normalizedEmail);
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { user_id: user.user_id },
            secret,
            { expiresIn }
        );

        res.json({ message: "Login successful", token });

    } catch (error) {
        if (error?.code === 'JWT_CONFIG_MISSING') {
            return res.status(500).json({ message: "Server auth configuration missing (JWT_SECRET)" });
        }
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getMe = async (req, res) => {
    try {
        const { secret } = getJwtConfig();
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : null;

        if (!token) {
            return res.status(401).json({ message: 'Missing token' });
        }

        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        if (error?.code === 'JWT_CONFIG_MISSING') {
            return res.status(500).json({ message: "Server auth configuration missing (JWT_SECRET)" });
        }
        console.error(error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export { register, login, getMe };
