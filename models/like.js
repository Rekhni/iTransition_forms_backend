import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Like = sequelize.define('Like', {}, { timestamps: true });

export default Like;
