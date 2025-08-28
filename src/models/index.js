import { User } from "./user.model.js";
import { UserGuide } from "./userGuide.model.js";

// Associations
User.hasMany(UserGuide, { foreignKey: "user_id", onDelete: "CASCADE" });
UserGuide.belongsTo(User, { foreignKey: "user_id" });
