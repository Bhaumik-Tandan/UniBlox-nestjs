import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartitemsService } from './cartitems.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(new JwtAuthGuard('jwt'))
@Controller('cartitems')
export class CartitemsController {
  constructor(private readonly cartitemsService: CartitemsService) {}

  @Post()
  create(@Body() createCartitemDto,@Req() req: Request) {
    createCartitemDto.userId=req["user"].id;
    return this.cartitemsService.create(createCartitemDto);
  }

}
