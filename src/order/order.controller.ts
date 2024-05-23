import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(new JwtAuthGuard('jwt'))
  @Post()
  create(@Req() req: Request) {
    return this.orderService.create(req["user"].id);
  }

}
