import { Injectable, UseGuards } from '@nestjs/common';
import OrderSchema from './order.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import CartitemsSchema from 'src/cartitems/cartitems.schema';
import ProductSchema from 'src/utility/seedData';

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
    }>
  ) {}

  async create(userId: string) {
    // Retrieve all cart items for the user
    const cartItems = await this.cartItemModel.find({ userId }).exec();

    if (!cartItems.length) {
      throw new Error('No items in the cart');
    }

    // Get all unique product IDs from the cart items
    const productIds = cartItems.map(item => item.productId);

    // Fetch product details for all product IDs
    const products = await this.productModel.find({ _id: { $in: productIds } }).exec();

    // Create a product map for quick lookup
    const productMap = products.reduce((map, product) => {
      map[product._id] = product;
      return map;
    }, {});

    // Calculate the total price and prepare order items
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

    // Create an order document
    const order = new this.orderModel({
      userId,
      items,
      total
    });

    // Save the order document
    await order.save();

    // Delete the cart items for the user
    await this.cartItemModel.deleteMany({ userId }).exec();

    return order;
  }
}
