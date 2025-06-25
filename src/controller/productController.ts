import { Request, Response } from "express";
import Product from "../database/model/productModel";
import Category from "../database/model/categoryModel";

class ProductController {
  // Helper function to transform input to array of strings
  private transformToArray = (value: any): string[] => {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }
    return Array.isArray(value) ? value.map(String).filter((item) => item) : [];
  };

  postProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        name,
        brand,
        price,
        originalPrice,
        inStock,
        isNew,
        categoryId,
        spec,
        keyFeatures,
        color,
        size,
        badge,
        discount,
        totalStock,
        RAM,
        ROM,
        description,
        image: imageUrls, // Optional: image URLs sent in body
      } = req.body;

      // Validate required fields
      if (!name || !brand || !price || !originalPrice || !categoryId) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      // Validate categoryId exists
      const category = await Category.findByPk(categoryId);
      if (!category) {
        res.status(400).json({ message: "Invalid categoryId" });
        return;
      }

      // Handle image field (support both uploaded files and URLs)
      let images: string[] = this.transformToArray(imageUrls);
      if (req.files && Array.isArray(req.files)) {
        // Assuming multer is configured with .array("images")
        images = [
          ...images,
          ...(req.files as Express.Multer.File[]).map(
            (file) => `/uploads/${file.filename}`
          ),
        ];
      }

      // Create product
      const product = await Product.create(
        {
          name,
          brand,
          price: parseFloat(price),
          originalPrice: parseFloat(originalPrice),
          image: images.length ? images : [], // Ensure image is always an array
          totalStock: totalStock ? parseInt(totalStock) : 0,
          size: this.transformToArray(size),
          spec: this.transformToArray(spec),
          color: this.transformToArray(color),
          ROM: this.transformToArray(ROM),
          RAM: this.transformToArray(RAM),
          keyFeatures: this.transformToArray(keyFeatures),
          description: this.transformToArray(description),
          inStock: inStock === "true" || inStock === true,
          isNew: isNew === "true" || isNew === true,
          categoryId,
          discount: discount ? parseInt(discount) : 0,
          badge: badge || "",
        },
        { logging: console.log } // Enable logging for debugging
      );

      res.status(200).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["categoryName"],
          },
        ],
      });
      res.status(200).json({
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const [product] = await Product.findAll({
      where: { id: id },
      include: [
        {
          model: Category,
          attributes: ["categoryName", "id"],
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {
        name,
        brand,
        price,
        originalPrice,
        inStock,
        isNew,
        categoryId,
        spec,
        keyFeatures,
        color,
        size,
        badge,
        discount,
        totalStock,
        RAM,
        ROM,
        description,
        image: imageUrls,
      } = req.body;

      // Validate required fields
      if (!name || !brand || !price || !originalPrice || !categoryId) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      // Validate categoryId exists
      const category = await Category.findByPk(categoryId);
      if (!category) {
        res.status(400).json({ message: "Invalid categoryId" });
        return;
      }

      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      // Handle image field
      let images: string[] = this.transformToArray(imageUrls);
      if (req.files && Array.isArray(req.files)) {
        images = [
          ...images,
          ...(req.files as Express.Multer.File[]).map(
            (file) => `/uploads/${file.filename}`
          ),
        ];
      }
      // If no new images provided, retain existing images
      images = images.length ? images : product.image;

      await product.update(
        {
          name,
          brand,
          price: parseFloat(price),
          originalPrice: parseFloat(originalPrice),
          image: images,
          totalStock: totalStock ? parseInt(totalStock) : 0,
          size: this.transformToArray(size),
          spec: this.transformToArray(spec),
          color: this.transformToArray(color),
          ROM: this.transformToArray(ROM),
          RAM: this.transformToArray(RAM),
          keyFeatures: this.transformToArray(keyFeatures),
          description: this.transformToArray(description),
          inStock: inStock === "true" || inStock === true,
          isNew: isNew === "true" || isNew === true,
          categoryId,
          discount: discount ? parseInt(discount) : 0,
          badge: badge || "",
        },
        { logging: console.log }
      );

      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
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
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default new ProductController();
