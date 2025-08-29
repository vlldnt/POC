import { User } from "./user.model.js";
import { UserGuide } from "./userGuide.model.js";
import { Caught } from "./caught.model.js";

// Table links
User.hasMany(UserGuide, { foreignKey: "user_id", onDelete: "CASCADE" });
UserGuide.belongsTo(User, { foreignKey: "user_id" });

UserGuide.hasMany(Caught, { foreignKey: "guide_id", onDelete: "CASCADE" });
Caught.belongsTo(UserGuide, { foreignKey: "guide_id" });
