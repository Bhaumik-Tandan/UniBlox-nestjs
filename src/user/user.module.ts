import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import UsersSchema from './users.schema';
@Module({
  imports: [MongooseModule.forFeature([UsersSchema])],
  providers: [UsersService],
})
export class UserModule {}
