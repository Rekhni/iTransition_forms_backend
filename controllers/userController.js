import db from "../models/index.js";
import { Op, literal } from 'sequelize';

const User = db.User;

export const getApiToken = async (req, res) => {
    try {
      const userId = req.user?.id;
      const user = await User.findByPk(userId);
  
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      if (!user.apiToken) {
        user.apiToken = crypto.randomBytes(32).toString('hex');
        await user.save();
      }
  
      res.json({ token: user.apiToken });
    } catch (err) {
      console.error("Error generating token:", err);
      res.status(500).json({ msg: "Failed to generate API token" });
    }
  };

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
        await User.update(
            {
                isBlocked: literal(`NOT isBlocked`)
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
                role: literal(`CASE WHEN role = 'admin' THEN 'user' ELSE 'admin' END`)
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

export const autoCompleteUsers = async (req, res) => {
    const { query } = req.query;

    if (!query) return res.status(404).json({ msg: 'Missing query param' });

    try {
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'name', 'email']
        })

        res.json(users);
    } catch (err) {
        console.error("Autocomplete error:", err);
        res.status(500).json({ msg: "Autocomplete failed" });
    }
}