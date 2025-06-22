import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
} from "sequelize-typescript";
import Product from "./productModel";
import User from "./userModel";

@Table({
  tableName: "carts",
  modelName: "Cart",
  timestamps: true,
})
class Cart extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  declare quantity: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare size: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare color: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare RAM: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare ROM: string;

  

  

}

export default Cart;