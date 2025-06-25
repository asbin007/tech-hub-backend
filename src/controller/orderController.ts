import { Request, Response } from "express";
import Payment from "../database/model/paymentMode";
import Order from "../database/model/orderModel";
import OrderDetails from "../database/model/orderDetaills";
import Cart from "../database/model/cartModel";
import Product from "../database/model/productModel";
import Category from "../database/model/categoryModel";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../services/types";
import axios from "axios";

interface IAuth extends Request {
  user?: {
    id: string;
  };
}

interface IProduct {
  productId: string;
  productQty: number;
}

class OrderWithPaymentId extends Order {
  declare paymentId: string | null;
}

class OrderController {
  async postOrder(req: IAuth, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      phoneNumber,
      firstName,
      lastName,
      email,
      city,
      addressLine,
      state,
      zipcode,
      totalPrice,
      paymentMethod,
      street,
    } = req.body;
    const products: IProduct[] = req.body.products;
    console.log(req.body);

    // Validate inputs
    if (
      !phoneNumber ||
      !firstName ||
      !lastName ||
      !city ||
      !email ||
      !state ||
      !addressLine ||
      !zipcode ||
      !totalPrice ||
      !paymentMethod ||
      !street ||
      products.length === 0
    ) {
      res.status(400).json({
        message:
          "Please fill up all required fields and add at least one product",
      });
      return;
    }

    // for order
    let data;
    const paymentData = await Payment.create({
      paymentMethod: paymentMethod,
    });

    // Create order
    const orderData = await Order.create({
      userId,
      phoneNumber,
      firstName,
      lastName,
      email,
      city,
      addressLine,
      state,
      zipcode,
      street,
      totalPrice,
      paymentId: paymentData.id,
    });

    // Create order details and remove from cart
    // for orderDetails
    products.forEach(async function (product) {
      data = await OrderDetails.create({
        quantity: product.productQty,
        productId: product.productId,
        orderId: orderData.id,
      });

      await Cart.destroy({
        where: {
          productId: product.productId,
          userId: userId,
        },
      });
    });

    // Handle Khalti
    if (paymentMethod === PaymentMethod.Khalti) {
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalPrice * 100,
        purchase_order_id: orderData.id,
        purchase_order_name: "order_" + orderData.id,
      };

      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "Key 5d818e0244bd414f99ad73e584d04e11",
          },
        }
      );

      const khaltiResponse = response.data;
      paymentData.pidx = khaltiResponse.pidx;
      await paymentData.save();
      // 🚨 Assuming success here (risky)
      await Payment.update(
        { pidx: khaltiResponse.pidx, paymentStatus: PaymentStatus.Paid },
        { where: { id: paymentData.id } }
      );

      await Order.update(
        { orderStatus: OrderStatus.Preparation },
        { where: { id: orderData.id } }
      );

      res.status(200).json({
        message: "Order created successfully",

        url: khaltiResponse.payment_url,
        pidx: khaltiResponse.pidx,
        data,
      });
      return;
    } else if (paymentMethod == PaymentMethod.Esewa) {
      res.status(200).json({
        message: "Order created successfully",
        data,
      });
    } else {
      res.status(200).json({
        message: "Order created successfully",
        data,
      });
    }
  }

  async verifyTransaction(req: IAuth, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {
      res.status(400).json({ message: "Please provide pidx" });
      return;
    }

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "Key 5d818e0244bd414f99ad73e584d04e11",
        },
      }
    );

    const data = response.data;

    if (data.status === "Completed") {
      await Payment.update(
        { paymentStatus: PaymentStatus.Paid },
        { where: { pidx } }
      );
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(200).json({ message: "Payment not verified or cancelled" });
    }
  }

  async fetchMyOrder(req: IAuth, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const orders = await Order.findAll({
        where: { userId },
        attributes: ["totalPrice", "id", "orderStatus", "createdAt"],
        include: [
          {
            model: Payment,
            attributes: ["id", "paymentMethod", "paymentStatus"],
          },

          {
            model: OrderDetails,
            attributes: ["quantity"],
          },
        ],
      });

      if (orders.length > 0) {
        res.status(200).json({
          message: "Order fetched successfully",
          data: orders,
        });
      } else {
        res.status(404).json({ message: "No order found", data: [] });
      }
    } catch (error) {
      console.error("Fetch My Orders Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async fetchMyOrderDetail(req: IAuth, res: Response): Promise<void> {  
    const orderId = req.params.id;

    const orders = await OrderDetails.findAll({
      where: { orderId },
      include: [
        {
          model: Order,
          include: [
            {
              model: Payment,
              attributes: ["paymentMethod", "paymentStatus"],
            },
          ],
          attributes: [
            "orderStatus",
            "addressLine",
            "city",
            "state",
            "totalPrice",
            "phoneNumber",
            "firstName",
            "lastName",
            "userId",
          ],
        },
        {
          model: Product,
          include: [{ model: Category }],
          attributes: ["image", "name", "price"],
        },
      ],
    });

    if (orders.length > 0) {
      res.status(200).json({
        message: "Order details fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({ message: "No order found", data: [] });
    }
  }

  async fetchAllOrders(req: IAuth, res: Response): Promise<void> {
    const orders = await Order.findAll({
      attributes: ["totalPrice", "id", "orderStatus", "createdAt", "paymentId"],
      include: [
        {
          model: Payment,
          attributes: ["paymentMethod", "paymentStatus", "id"],
        },
        {
          model: OrderDetails,
          attributes: ["quantity", "id"],
          required: false,
        },
      ],
    });

    res.status(orders.length > 0 ? 200 : 404).json({
      message:
        orders.length > 0 ? "Order fetched successfully" : "No order found",
      data: orders,
    });
  }

  async cancelOrder(req: IAuth, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const orderId = req.params.id;

      const [order] = await Order.findAll({
        where: { userId, id: orderId },
      });

      if (!order) {
        res.status(404).json({ message: "No order with that ID" });
        return;
      }

      if (
        order.orderStatus === OrderStatus.Ontheway ||
        order.orderStatus === OrderStatus.Preparation
      ) {
        res.status(403).json({
          message:
            "You cannot cancel an order that's in preparation or on the way",
        });
        return;
      }

      await Order.update(
        { orderStatus: OrderStatus.Cancelled },
        { where: { id: orderId } }
      );

      res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
      console.error("Cancel Order Error:", error);
      res.status(500).json({ message: "Error cancelling order" });
    }
  }

  async changeOrderStatus(req: IAuth, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const { orderStatus } = req.body;

      if (!orderId || !orderStatus) {
        res
          .status(400)
          .json({ message: "Please provide orderId and orderStatus" });
        return;
      }

      await Order.update({ orderStatus }, { where: { id: orderId } });

      res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
      console.error("Change Order Status Error:", error);
      res.status(500).json({ message: "Error updating order status" });
    }
  }

  async deleteOrder(req: IAuth, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const order: OrderWithPaymentId = (await Order.findByPk(
        orderId
      )) as OrderWithPaymentId;

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      await OrderDetails.destroy({ where: { orderId } });
      await Payment.destroy({ where: { id: order.paymentId } });
      await Order.destroy({ where: { id: orderId } });

      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Delete Order Error:", error);
      res.status(500).json({ message: "Error deleting order" });
    }
  }
}

export default new OrderController();
