import { Injectable } from '@nestjs/common';
import CartitemsSchema from './cartitems.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class CartitemsService {
  constructor(
  @InjectModel(CartitemsSchema.name)
    private cartItemModel: Model<typeof CartitemsSchema>
  ) {}

  create(createCartitemDto) {
    const createdCartItem = new this.cartItemModel(createCartitemDto);
    return createdCartItem.save();
  }

  async remove(id: string,userId: string) {
    return await this.cartItemModel.deleteOne({ _id: id, userId }).exec();
  }

}
