import {  Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Product from "./model/productModel";
import Category from "./model/categoryModel";
import Review from "./model/reviewModel";
import User from "./model/userModel";
import Cart from "./model/cartModel";
import Order from "./model/orderModel";
import Payment from "./model/paymentMode";
import OrderDetails from "./model/orderDetaills";

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

Product.belongsTo(Category,{foreignKey:'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

// product x review
Review.belongsTo(Product,{foreignKey:'productId'})
Product.hasMany(Review, { foreignKey: 'productId'})
// user x review
Review.belongsTo(User,{foreignKey:'userId'})
User.hasMany(Review, { foreignKey: 'userId' })

// cart x User
Cart.belongsTo(User,{foreignKey:'userId'})
User.hasMany(Cart, { foreignKey: 'userId' })

// cart x Product
Cart.belongsTo(Product,{foreignKey:'productId'})
Product.hasMany(Cart, { foreignKey: 'productId' })

// order x user
Order.belongsTo(User,{foreignKey:'userId'})
User.hasMany(Order,{foreignKey:"userId"})

// payment X order
Order.belongsTo(Payment,{foreignKey:"paymentId"});
Payment.hasOne(Order,{foreignKey:"paymentId"})


// order x orderDetails
OrderDetails.belongsTo(Order, { foreignKey: "orderId" });
Order.hasOne(OrderDetails, { foreignKey: "orderId" });

// orderDetails x product
OrderDetails.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderDetails, { foreignKey: "productId" });




export default sequelize;
