import db from "../models/index.js";
import { Op, literal } from 'sequelize';

const User = db.User;

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        res.json(users);
    } catch(err) {
        console.error("Failed to fetch all users", err);
    }
}

export const toggleBlockStatus = async (req, res) => {
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) return res.status(400).json({ msg: 'userIds must be an array' });
    try {
        // const users = await User.findAll({
        //     where: { id: userIds }
        // });
        // for (const user of users) {
        //     user.isBlocked = !user.isBlocked;
        //     await user.save();
        // }  

        await User.update(
            {
                isBlocked: literal(`NOT isBLocked`)
            },
            {
                where: {
                    id: {
                        [Op.in]: userIds
                    }
                }
            }
        )

        res.json({ msg: "Block status toggled" });
    } catch(err) {
        console.error("Toggle block failed:", err);
        res.status(500).json({ msg: "Failed to toggle block status" });
    }
};

export const deleteUsers = async (req, res) => {
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) return res.status(404).json({ msg: "userIds must be an array" })

    try {  
        await User.destroy({ where: { id: userIds } })
        res.json({ msg: 'Users deleted' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to delete users" });
    }
}

export const toggleAdminStatus = async (req, res) => {
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) return res.status(404).json({ msg: "userIds must be an array" })

    try {   
        await User.update(
            {
                role: literal(`CASE WHEN role = 'admin THEN 'user' ELSE 'admin' END`)
            },
            {
                where: {
                    id: {
                        [Op.in]: userIds
                    }
                }
            }
        );

        res.json({ msg: "Admin status toggled" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to toggle admin status' })
    }
}