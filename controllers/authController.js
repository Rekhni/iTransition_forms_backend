import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const User = db.User;

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ msg: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            apiToken: crypto.randomBytes(32).toString('hex') 
        });

        res.status(201).json({ msg: 'User registered successfully', newUser});
    } catch(err) {  
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { email, password  } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'There is no such user' })
        }

        if (user.isBlocked) {
            return res.status(403).json({ msg: 'User is blocked' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Password for this is incorrect' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                language: user.language,
                theme: user.theme,
                isBlocked: user.isBlocked
            }
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (err) {
        console.error("Failed to get current user", err);
        res.status(500).json({ msg: "Server error" });
    }
};