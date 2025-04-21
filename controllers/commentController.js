import db from "../models/index.js";

const Comment = db.Comment;
const User = db.User;

export const addComment = async (req, res) => {
    const { templateId } = req.params;
    const { text } = req.body;

    try {
        const comment = await Comment.create({
            text,
            userId: req.user.id,
            templateId
        });

        const fullComment = await Comment.findByPk(comment.id, {
            include: { model: User, attributes: ['name', 'email'] }
        });
        
        res.status(201).json(fullComment);
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to add comment' });
    }
}

export const getComments = async (req, res) => {
    const { templateId } = req.params;

    try {
        const comments = await Comment.findAll({
            where: { templateId },
            include: { model: User, attributes: ['name', 'email'] },
            order: [['createdAt', 'ASC']]
        });
        
        res.json(comments);
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch comments' });
    }
}