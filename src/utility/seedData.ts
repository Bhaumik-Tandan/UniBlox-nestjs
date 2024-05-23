import { connect, model, Schema } from 'mongoose';
require('dotenv').config(); // Load environment variables

const MONGO_URI = process.env.DATABASE_URL; // Get the connection URI

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = model('Product', ProductSchema); // Create the Product model

const productData = [
  {
    name: 'Product 1',
    description: 'A detailed description of Product 1',
    price: 19.99,
  },
  {
    name: 'Product 2',
    description: 'A detailed description of Product 2',
    price: 24.50,
  },
  {
    name: 'Product 3',
    description: 'A detailed description of Product 3',
    price: 32.99,
  },
  {
    name: 'Product 4',
    description: 'A detailed description of Product 4',
    price: 15.75,
  },
  {
    name: 'Product 5',
    description: 'A detailed description of Product 5',
    price: 48.50,
  },
];

const seedProducts = async () => {
  try {
    // Connect to the MongoDB database
    await connect(MONGO_URI);

    // Clear existing products (optional)
    await Product.deleteMany({});

    // Insert seed data
    await Product.insertMany(productData);

    console.log('Products successfully seeded!');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1); // Exit process on error (optional)
  } 
};

seedProducts();
