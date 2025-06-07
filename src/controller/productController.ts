import { Request, Response } from "express";
import Product from "../database/model/productModel";
class ProductController {
  async postProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        brand,
        price,
        originalPrice,
        inStock,
        isNew,
        sizes,
        colors,
        categoryId,
        specs,
        discount,
        badge,
      } = req.body;

      if (!name || !brand || !price || !originalPrice || !categoryId) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const filename = req.file?.filename || "";

      const product = await Product.create({
        name,
        brand,
        price,
        originalPrice,
        image: filename,
        sizes:
          typeof sizes === "string"
            ? sizes.split(",")
            : Array.isArray(sizes)
            ? sizes
            : [],
        colors:
          typeof colors === "string"
            ? colors.split(",")
            : Array.isArray(colors)
            ? colors
            : [],
        specs:
          typeof specs === "string"
            ? specs.split(",")
            : Array.isArray(specs)
            ? specs
            : [],
        inStock: inStock === "true" || inStock === true,
        isNew: isNew === "true" || isNew === true,
        categoryId,
        discount: discount ?? 0,
        badge: badge || "",
      });

      res.status(200).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await Product.findAll();
      res.status(200).json({
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getProductById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  }
  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {
      name, 
      brand,
      price,
      originalPrice,
      inStock,
      isNew,
      sizes,
      colors,
      categoryId,
      specs,
      discount,
      badge,
    } = req.body;

    if (!name || !brand || !price || !originalPrice || !categoryId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    const filename = req.file?.filename || product.image;
    await product.update({
      name,
      brand,
      price,
      originalPrice,
      image: filename,
      sizes:
        typeof sizes === "string"
          ? sizes.split(",")
          : Array.isArray(sizes)
          ? sizes
          : [],
      colors:
        typeof colors === "string"
          ? colors.split(",")
          : Array.isArray(colors)
          ? colors
          : [],
      specs:
        typeof specs === "string"
          ? specs.split(",")
          : Array.isArray(specs)
          ? specs
          : [],
      inStock: inStock === "true" || inStock === true,
      isNew: isNew === "true" || isNew === true,
      categoryId,
      discount: discount ?? 0,
      badge: badge || "",
    });
    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  }
  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    await product.destroy();
    res.status(200).json({
      message: "Product deleted successfully",
    });
  }
}

export default new ProductController();
