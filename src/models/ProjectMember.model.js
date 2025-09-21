import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.model.js";
import { Project } from "./Project.model.js";

const ProjectMember = sequelize.define(
  "ProjectMember",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Member"),
      allowNull: false,
      defaultValue: "Member",
    },
  },
  {
    tableName: "project_members",
    timestamps: true,
  }
);
 
ProjectMember.belongsTo(User, { foreignKey: "user_id" , as : "userInfo"}); 

export { ProjectMember };
