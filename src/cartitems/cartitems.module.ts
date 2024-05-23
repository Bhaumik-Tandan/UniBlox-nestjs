import { Module } from '@nestjs/common';
import { CartitemsService } from './cartitems.service';
import { CartitemsController } from './cartitems.controller';
import { MongooseModule } from '@nestjs/mongoose';
import CartItemsSchema from './cartitems.schema';
@Module({
  imports: [MongooseModule.forFeature([CartItemsSchema])],
  controllers: [CartitemsController],
  providers: [CartitemsService],
})
export class CartitemsModule {}
