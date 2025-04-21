import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Form from "./form.js";
import Question from "./question.js";

const Answer = sequelize.define('Answer', {
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

export default Answer;
