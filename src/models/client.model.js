import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    // Now it should match Lead's PK (INTEGER)
    originalLeadId: { type: DataTypes.INTEGER, allowNull: true }
  },
  {
    tableName: "clients",
    timestamps: true
  }
);

export default Client;

