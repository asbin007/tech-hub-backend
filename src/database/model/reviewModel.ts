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
  tableName: "reviews",
  modelName: "Review",
  timestamps: true,
})
class Review extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
    allowNull: false,
  })
  declare rating: number;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      len: [10, 500],
    },
  })

  declare comment: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
  })
  declare productId: string;
  
}

export default Review;
