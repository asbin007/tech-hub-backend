import { Request, Response } from "express";
import Payment from "../database/model/paymentMode";
import Order from "../database/model/orderModel";
import OrderDetails from "../database/model/orderDetaills";
import Cart from "../database/model/cartModel";
import { PaymentMethod } from "../services/types";
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
class OderController {
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
      !street
    ) {
      res.status(400).json({
        message: "Please fill up all required fields",
      });
      return;
    }

    // for payment
    let data;
    const paymentData = await Payment.create({
      paymentMethod: paymentMethod,
    });
    const orderData = await Order.create({
      userId: userId,
      phoneNumber,
      firstName,
      lastName,
      email,
      city,
      addressLine,
      state,
      street,
      zipcode,
      totalPrice,
      paymentId: paymentData.id,
    });

    // for orderDetaills
    products.forEach(async function(items){
        data= await OrderDetails.create({
            quantity:items.productQty,
            productId:items.productId,
            orderId:orderData.id
        })
        await Cart.destroy({
            where:{
                productId:items.productId,
                userId:userId
            }
        })
    })
    // for payment
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
      res.status(201).json({
        message: "order created successfully",
        data,
        url: khaltiResponse.payment_url,
        pidx: khaltiResponse.pidx,
      });
    } else if (paymentMethod == PaymentMethod.Esewa) {
      // TODO: Implement Esewa payment flow
    } else {
      res.status(200).json({
        message: "Order created successfully",
        data,
      });
    }

  }

}

export default new OderController();
