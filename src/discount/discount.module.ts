import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { MongooseModule } from '@nestjs/mongoose';
import DiscountSchema from './discount.schema';
import OrderSchema from 'src/order/order.schema';
@Module({
  imports: [MongooseModule.forFeature([DiscountSchema,OrderSchema])],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
