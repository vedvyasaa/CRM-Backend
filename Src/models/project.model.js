import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    startDate: { type: DataTypes.DATEONLY },
    endDate: { type: DataTypes.DATEONLY },
    status: {
      type: DataTypes.ENUM(
        "Planned",
        "Active",
        "On Hold",
        "Completed",
        "Cancelled"
      ),
      defaultValue: "Planned"
    },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 } // 0..100
  },
  {
    tableName: "projects",
    timestamps: true
  }
);

export default Project;

