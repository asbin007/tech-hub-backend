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

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId || !quantity || !size || !color || !RAM || !ROM) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.inStock) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    // 🔍 Validate selected variants
    const validRAMs = product.RAM;
    const validROMs = product.ROM;
    const validSizes = product.size;
    const validColors = product.color;

    if (!validRAMs.includes(RAM)) {
      return res.status(400).json({ message: `Invalid RAM selected: ${RAM}` });
    }
    if (!validROMs.includes(ROM)) {
      return res.status(400).json({ message: `Invalid ROM selected: ${ROM}` });
    }
    if (!validSizes.includes(size)) {
      return res
        .status(400)
        .json({ message: `Invalid size selected: ${size}` });
    }
    if (!validColors.includes(color)) {
      return res
        .status(400)
        .json({ message: `Invalid color selected: ${color}` });
    }

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

    const cart = await Cart.create({
      userId,
      productId,
      quantity,
      size,
      color,
      RAM,
      ROM,
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
      include: [
        { model: Product, attributes: ["image", "price", "name", "id"] },
      ],
    });
    res.status(200).json({
      message: "Cart fetched successfully",
      data: carts,
    });
  }

  async deleteCart(req: IAuth, res: Response) {
    const userId = req.user?.id;
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!productId) {
      return res.status(400).json({
        message: "Product Id required",
      });
    }
    await Cart.destroy({
      where: {
        userId,
        productId,
      },
    });
    return res.status(200).json({
      message: "Product removed from the cart successfully",
    });
  }

  async updateCart(req: IAuth, res: Response) {
  const userId = req.user?.id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity) {
    return res.status(400).json({
      message: "Please provide quantity",
    });
  }

  const cartItem = await Cart.findOne({
    where: {
      productId,
      userId,
    },
  });

  if (!cartItem) {
    return res.status(400).json({
      message: "Cart item not found",
    });
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  return res.status(200).json({
    message: "Cart updated successfully",
    cart: cartItem,
  });
}

}

export default new CartController();
