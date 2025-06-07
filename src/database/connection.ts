import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Product from "./model/productModel";
import Category from "./model/categoryModel";

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

// product x category

Product.belongsTo(Category,{foreignKey:'categoryId', as: 'category'});
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

export default sequelize;
