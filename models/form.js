import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Template from "./template.js";
import User from "./user.js";

const Form = sequelize.define('Form', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    templateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Template,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true
})


export default Form;