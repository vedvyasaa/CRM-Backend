
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import sequelize from "./config/database.js";
import "./config/database.js"

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connect Successfully")
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    } catch (err) {
        console.error("Unable to start server", err)
        process.exit(1);
    }
};

start();