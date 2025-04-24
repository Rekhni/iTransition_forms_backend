import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TemplateAccess = sequelize.define('TemplateAccess', {
    templateId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default TemplateAccess;