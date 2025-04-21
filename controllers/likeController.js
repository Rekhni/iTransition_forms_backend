import db from "../models/index.js";

const Like = db.Like;

export const toggleLike = async (req, res) => {
    const { templateId } = req.params;
    const userId = req.user.id;

    try {
        const existing = await Like.findOne({ where: { userId, templateId} });

        if (existing) {
            await existing.destroy();
            return res.json({ liked: false })
        } else {
            await Like.create({ userId, templateId });
            return res.json({ liked: true });
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to toggle like' });
    }
};

export const getLikeCount = async (req, res) => {
    const { templateId } = req.params;

    try {  
        const count = await Like.count({ where: { templateId } });
        res.json({ count });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to get like count' });
    }
};