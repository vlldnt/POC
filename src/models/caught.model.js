import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export const Caught = sequelize.define("Caught", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  guide_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  pokemon_id: {
    type: DataTypes.STRING(3),
    allowNull: false,
    validate : {
      is: /^[0-9]{3}$/,
    },
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ["guide_id", "pokemon_id"],
    },
  ],
});
