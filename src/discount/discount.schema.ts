import { Schema } from 'mongoose';

const DiscountSchema = new Schema(
  {
    code: {
        type: String,
        required: true,
        },
    used:{
        type: Boolean,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
  },
  {
    timestamps: true
  }
);

export default { name: 'Discount', schema: DiscountSchema };
