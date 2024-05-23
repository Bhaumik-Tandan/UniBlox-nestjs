import { Injectable } from '@nestjs/common';
@Injectable()
export class OrderService {
  create(createOrderDto) {
    return 'This action adds a new order';
  }

}
