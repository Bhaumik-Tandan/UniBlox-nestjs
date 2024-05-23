import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    total: {
      type: Number,
      required: true
    },
    discountId: {
        type: Schema.Types.ObjectId,
        ref: 'Discount',
        required: false
    }
  },
  {
    timestamps: true
  }
);

export default { name: 'Orders', schema: OrderSchema };
