import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

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
      references: {
        model: "projects",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
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

export { ProjectMember };