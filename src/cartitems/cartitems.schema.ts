import { Schema } from 'mongoose';

const CartItemsSchema = new Schema(
  {
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
        },
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
        },
    quantity:{
        type: Number,
        required: true
        }
  },
  {
    timestamps: true,
  },
);

export default { name: 'CartItems', schema: CartItemsSchema };
