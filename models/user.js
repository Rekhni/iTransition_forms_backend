import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    apiToken: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
});

export default User;

