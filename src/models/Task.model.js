import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Task = sequelize.define(
  "Task",
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Todo", "In-Progress", "Done"),
      allowNull: false,
      defaultValue: "Todo",
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
  }
);
Task.associations = () => {
  Task.belongsTo(User, { foreignKey: "assigned_to" });
  Task.belongsTo(Project, { foreignKey: "project_id" });
};

export { Task };
