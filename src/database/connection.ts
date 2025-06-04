import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";

const sequelize = new Sequelize(envConfig.dbUrl as string, {
  models: [__dirname + "/model"],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

sequelize.sync({ force: false, alter: true}).then(() => {
  console.log("Database synchronized successfully");
});

export default sequelize;
