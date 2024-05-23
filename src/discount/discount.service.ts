import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import DiscountSchema from './discount.schema';
import { Model } from 'mongoose';
import OrderSchema from 'src/order/order.schema';
import { NUMBER_OF_ORDERS_FOR_DISCOUNT } from 'src/constants';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(DiscountSchema.name)
    private discountModel: Model<typeof DiscountSchema>,
    @InjectModel(OrderSchema.name)
    private orderModel: Model<typeof OrderSchema>,
  ){}
  async create(userId) {
    const numberOfOrders = await this.orderModel.countDocuments({ userId });
    if(numberOfOrders%NUMBER_OF_ORDERS_FOR_DISCOUNT === 0) {
      const code = Math.floor(1000 + Math.random() * 9000);
      const existingDiscount = await this.discountModel.findOne({ userId, used: false });
      if(existingDiscount) {
        return `You already have a discount code: ${existingDiscount["code"]}`
      }
      return this.discountModel.create({ userId, code,used:false});
    }
    return `You currently have ${numberOfOrders} orders. You need ${NUMBER_OF_ORDERS_FOR_DISCOUNT - numberOfOrders%NUMBER_OF_ORDERS_FOR_DISCOUNT} more orders to get a discount.`
  }

}
