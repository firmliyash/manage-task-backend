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
ProjectMember.associations = () => {
  ProjectMember.belongsTo(User, { foreignKey: "user_id" });
  ProjectMember.belongsTo(Project, { foreignKey: "project_id" });
};

export { ProjectMember };
