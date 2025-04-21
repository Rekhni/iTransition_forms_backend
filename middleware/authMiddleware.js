import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const User = db.User;

export const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) return res.status(401).json({ msg: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ msg: 'User is blocked' });
        }

        req.user = user;
        next();
    } catch(err) {
        console.log("Auth error:", err);
        res.status(401).json({ msg: 'Not authorized, token failed' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user?.role !=='admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }

    next();
};

