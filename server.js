import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models/index.js';
import authRoutes from './routes/auth.js';
import templateRoutes from './routes/template.js';
import questionRoutes from './routes/question.js';
import formRoutes from './routes/form.js';
import likeRoutes from './routes/like.js';
import commentRoutes from './routes/comment.js'
import userRoutes from './routes/user.js';
import supportRoutes from './routes/support.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);

const PORT = process.env.PORT || 5002;


db.sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('DB connection failed:', err));
