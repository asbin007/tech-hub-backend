import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Product from "./model/productModel";
import Category from "./model/categoryModel";
import Review from "./model/reviewModel";
import User from "./model/userModel";
import Cart from "./model/cartModel";

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

// product x review
Review.belongsTo(Product,{foreignKey:'productId'})
Product.hasMany(Review, { foreignKey: 'productId'})
// user x review
Review.belongsTo(User,{foreignKey:'userId'})
User.hasMany(Review, { foreignKey: 'userId' })

// cart x User
Cart.belongsTo(User,{foreignKey:'productId'})
User.hasMany(Cart, { foreignKey: 'userId' })

// cart x Product
Cart.belongsTo(Product,{foreignKey:'productId'})
Product.hasMany(Cart, { foreignKey: 'productId' })


export default sequelize;
