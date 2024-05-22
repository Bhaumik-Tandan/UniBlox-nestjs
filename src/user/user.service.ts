import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import UserSchema from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchema.name)
    private userModel: Model<typeof UserSchema>,
  ) {}
  async create(createUserBody) {
    const createdUser = new this.userModel(createUserBody);
    return createdUser.save();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(id) {
    return await this.userModel.findById(id).exec();
  }
}
