import { Request, Response } from "express";
import Cart from "../database/model/cartModel";
import Product from "../database/model/productModel";

interface IAuth extends Request {
  user?: {
    id: string;
  };
}
class CartController {
  async postCart(req: IAuth, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {productId, quantity, size, color, RAM, ROM } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!productId || !quantity || !size || !color || !RAM || !ROM) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    if (!product.inStock) {
      res.status(400).json({ message: "Product is out of stock" });
      return;
    }
    if (!product.sizes.includes(size)) {
      res.status(400).json({ message: "Size not available" });
      return;
    }
    if (!product.colors.includes(color)) {
      res.status(400).json({ message: "Color not available" });
      return;
    }
    if (!product.RAM.includes(RAM)) {
      res.status(400).json({ message: "RAM not available" });
      return;
    }
    if (!product.ROM.includes(ROM)) {
      res.status(400).json({ message: "ROM not available" });
      return;
    }
    const cart = await Cart.create({
      userId,
      productId,
      quantity,
      size,
      color,
      RAM,
      ROM,
    });
    res.status(200).json({ message: "Product added to cart", cart });
  }
  async getCart(req: IAuth, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({
        message: "no userId",
      });
      return;
    }
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: Product,
        },
      ],
    });
     res.status(200).json({
      message: "Cart fetched successfully",
      data: cart,
    });

  }

}

export default new CartController();
