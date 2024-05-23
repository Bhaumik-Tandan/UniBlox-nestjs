import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(new JwtAuthGuard('jwt'))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Req() req: Request, @Body() {discountCode}: any){
    return this.orderService.create(req["user"].id, discountCode);
  }

  @Get("itemsCount")
  getCountOfPurchaseItems(@Req() req: Request){
    return this.orderService.getCountOfPurchaseItems(req["user"].id);
  }

}
