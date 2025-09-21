import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.model.js";
import { ProjectMember } from "./ProjectMember.model.js";

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "projects",
    timestamps: true,
  }
);
Project.belongsTo(User, {
  foreignKey: "created_by",
  as: "createdBy",
});
 
Project.hasMany(ProjectMember, {
  foreignKey: "project_id",
  as: "projectMembers",
});

export { Project };
