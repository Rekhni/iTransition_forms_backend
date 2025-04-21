import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Question = sequelize.define('Question', {
    type: {
        type: DataTypes.ENUM('single-line', 'multi-line', 'integer', 'checkbox'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    options: {
        type: DataTypes.JSON,
        allowNull: true
    },
    showInTable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

});


export default Question;