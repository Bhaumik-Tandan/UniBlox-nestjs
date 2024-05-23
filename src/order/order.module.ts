import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import OrderSchema from './order.schema';
import CartitemsSchema from 'src/cartitems/cartitems.schema';
import ProductSchema from 'src/utility/seedData';
import DiscountSchema from 'src/discount/discount.schema';
@Module({
  imports: [MongooseModule.forFeature([OrderSchema,CartitemsSchema,ProductSchema,DiscountSchema])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
