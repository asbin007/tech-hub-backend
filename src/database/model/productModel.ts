import {
  Table,
  Column,
  DataType,
  Model,
  Min,
  ForeignKey,
} from "sequelize-typescript";
import Category from "./categoryModel";
@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class Product extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare brand: string;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: number;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare originalPrice: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare image: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare inStock: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isNew: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  declare sizes: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  declare colors: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare badge: string;
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare discount: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  declare RAM: string[];
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  declare ROM: string[];
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  declare specs: string[];

  // @ForeignKey(() => Category)
  // @Column({
  //   type: DataType.STRING,
  // })
  // declare categoryId: string;
}

export default Product;
