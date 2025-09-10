import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export const UserGuide = sequelize.define("UserGuide", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  guide: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
