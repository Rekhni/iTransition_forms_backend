import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import db from './models/index.js';
import authRoutes from './routes/auth.js';
import templateRoutes from './routes/template.js';
import questionRoutes from './routes/question.js';
import formRoutes from './routes/form.js';
import likeRoutes from './routes/like.js';
import commentRoutes from './routes/comment.js'
import userRoutes from './routes/user.js';
import supportRoutes from './routes/support.js';
import googleAuthRoutes from './routes/googleAuth.js';
import { loadSavedCredentials } from './utils/googleDrive.js';
import salesforceRoutes from './routes/salesforce.js';
import salesforceAuthRoutes from './routes/salesforceAuth.js';
import odooRoutes from './routes/odoo.js';


dotenv.config();


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

app.use(cors());
app.use(express.json());

loadSavedCredentials();


app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/salesforce', salesforceRoutes);
app.use('/auth/sf', salesforceAuthRoutes);
app.use('/api/odoo', odooRoutes);

const PORT = process.env.PORT || 5002;


db.sequelize.sync().then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('DB connection failed:', err));
