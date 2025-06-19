import { Request, Response } from "express";
import Cart from "../database/model/cartModel";
import Product from "../database/model/productModel";

interface IAuth extends Request {
  user?: {
    id: string;
  };
}

class CartController {
  async postCart(req: IAuth, res: Response) {
    const userId = req.user?.id;
    const { productId, quantity, size, color, RAM, ROM } = req.body;

    // Check for user authentication
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate required fields
    if (!productId || !quantity || !size || !color || !RAM || !ROM) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch the product
    const product = await Product.findByPk(productId);
    if (!product) {
      console.log(`Product not found for productId: ${productId}`);
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock availability
    if (!product.inStock) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

   

   

    // Check if cart item already exists
    let userKoCartExist = await Cart.findOne({
      where: { userId, productId, size, color, RAM, ROM },
    });

    if (userKoCartExist) {
      userKoCartExist.quantity += quantity;
      await userKoCartExist.save();
      return res
        .status(200)
        .json({ message: "Cart updated", cart: userKoCartExist });
    }

    // Create new cart item
    const cart = await Cart.create({
      userId,
      productId,
      quantity,
     
     
    });

    return res.status(200).json({ message: "Product added to cart", cart });
  }

  async getCart(req: IAuth, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const carts = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }],
    });
    res.status(200).json({
      message: "Cart fetched successfully",
      data: carts,
    });
  }
}

export default new CartController();
