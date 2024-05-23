import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartitemsModule } from './cartitems/cartitems.module';
import { OrderModule } from './order/order.module';
import { DiscountModule } from './discount/discount.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    AuthModule,
    CartitemsModule,
    OrderModule,
    DiscountModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
