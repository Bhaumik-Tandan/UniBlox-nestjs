import { Injectable, UseGuards } from '@nestjs/common';
import OrderSchema from './order.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import CartitemsSchema from 'src/cartitems/cartitems.schema';
import ProductSchema from 'src/utility/seedData';
import DiscountSchema from 'src/discount/discount.schema';

@UseGuards(new JwtAuthGuard('jwt'))
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrderSchema.name)
    private orderModel: Model<{
      userId: ObjectId;
      items: Array<{ productId: ObjectId; quantity: number }>;
      total: number;
      discountId?: ObjectId;
    }>,
    @InjectModel(CartitemsSchema.name)
    private cartItemModel: Model< {
      userId: ObjectId;
      productId: string;
      quantity: number;
    }>,
    @InjectModel(ProductSchema.name)
    private productModel: Model< {
      _id: string;
      price: number;
    }>,
    @InjectModel(DiscountSchema.name)
    private discountModel: Model< {
      userId: ObjectId;
      code: number;
      used: boolean;
    }>,
  ) {}

  async create(userId: string, discountCode?: number) {
    const cartItems = await this.cartItemModel.find({ userId }).exec();

    if (!cartItems.length) {
      throw new Error('No items in the cart');
    }

    const productIds = cartItems.map(item => item.productId);

    const products = await this.productModel.find({ _id: { $in: productIds } }).exec();

    const productMap = products.reduce((map, product) => {
      map[product._id] = product;
      return map;
    }, {});

    let total = 0;
    const items = cartItems.map(item => {
      const product = productMap[item.productId];
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const productPrice = product.price;
      total += item.quantity * productPrice;

      return {
        productId: item.productId,
        quantity: item.quantity
      };
    });
    const orderObject={
      userId,
      items,
      total
    };
    if(discountCode) {
      const discount = await this.discountModel.findOne({ code: discountCode, used: false,userId }).exec();
      if (!discount) {
        throw new Error('Invalid discount code');
      }
      orderObject["total"] = total * 0.9;
      orderObject["discountId"] = discount._id;
      discount.used = true;
      await discount.save();
    }

    const order = new this.orderModel(orderObject);

    await order.save();

    await this.cartItemModel.deleteMany({ userId }).exec();

    return order;
  }

  async getOrdersAndDiscounts(userId) {
    try {
      const [orders, discounts] = await Promise.all([
        this.orderModel.find({ userId }).exec(),
        this.discountModel.find({ userId }).exec()
      ]);
      return { orders, discounts };
    } catch (error) {
      console.error('Error fetching orders and discounts:', error);
      throw error;
    }
  }

  async getTotalPurchaseAmount(orders) {
    let totalPurchaseAmount = 0;
    orders.forEach(order => {
      totalPurchaseAmount += order.total;
    });
    return totalPurchaseAmount;
  }

  async getCountOfPurchaseItems(orders) {
    let totalItemsPurchased = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        totalItemsPurchased += item.quantity;
      });
    });
    return totalItemsPurchased;
  }

  async totalDiscountAmount(orders) {
    let totalDiscountAmount = 0;
    orders.forEach(order => {
      if (order.discountId) {
        const markedPrice = order.total / 0.9;
        const discountAmount = markedPrice - order.total;
        totalDiscountAmount += discountAmount;
      }
    });
    return totalDiscountAmount;
  }

  async getStats(userId) {
    try {
      const { orders, discounts } = await this.getOrdersAndDiscounts(userId);
      const [totalItemsPurchased, totalPurchaseAmount, totalDiscountAmount] = await Promise.all([
        this.getCountOfPurchaseItems(orders),
        this.getTotalPurchaseAmount(orders),
        this.totalDiscountAmount(orders)
      ]);

      return {
        totalItemsPurchased,
        totalPurchaseAmount,
        discountCodes: discounts,
        totalDiscountAmount
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
}
