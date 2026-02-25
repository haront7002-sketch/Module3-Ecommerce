import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

// REGISTER
const register = async (req, res) => {
    try {
        const { user_name, user_surname, email, password, country, zip_code } = req.body;
        const normalizedEmail = (email || '').trim().toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json({ message: "Email is required" });
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
            zip_code
        });

        const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({ message: "User created", token });

    } catch (error) {
        if (error?.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error(error);
        res.status(500).json({ message: error.message});
    }
};

//  LOGIN
const login = async (req, res) => {
    try {
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
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET USER PROFILE 
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

//  UPDATE USER COUNTRY / ZIP 
const updateUser = async (req, res) => {
    try {
        const { country, zip_code } = req.body;

        const updatedUser = await User.updateUser(req.user.user_id, { country, zip_code });

        res.json({ message: "User updated", updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// UPDATE USER PREFERENCES
const updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;

        const updatedPrefs = await User.updatePreferences(req.user.user_id, preferences);

        res.json({ message: "Preferences updated", updatedPrefs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export { register, login, getUserProfile, updateUser, updatePreferences };
