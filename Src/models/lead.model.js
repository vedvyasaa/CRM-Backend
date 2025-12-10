import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    source: { type: DataTypes.STRING },
    stage: {
      type: DataTypes.ENUM(
        "New",
        "Contacted",
        "Qualified",
        "Proposal",
        "Converted",
        "Lost"
      ),
      defaultValue: "New"
    },
    notes: { type: DataTypes.TEXT }
  },
  {
    tableName: "leads",
    timestamps: true
  }
);

export default Lead;

