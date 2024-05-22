import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import UsersSchema from './users.schema';
@Module({
  imports: [MongooseModule.forFeature([UsersSchema])],
  providers: [UserService],
})
export class UserModule {}
