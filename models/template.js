import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Template = sequelize.define('Template', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    topic: {
        type: DataTypes.ENUM('Other', 'Information request', 'Feedback', 'Appointment', 'Quiz', 'Product Order', 'Education', 'Hotel booking'),
        allowNull: false,
        defaultValue: 'Other',
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tags: {
        type: DataTypes.TEXT,
        allowNull: true
    }, 
}, {
    timestamps: true
});


export default Template;