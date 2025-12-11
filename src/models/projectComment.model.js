import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ProjectComment = sequelize.define(
  "ProjectComment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    text: { type: DataTypes.TEXT, allowNull: false }
  },
  {
    tableName: "project_comments",
    timestamps: true
  }
);

export default ProjectComment;

