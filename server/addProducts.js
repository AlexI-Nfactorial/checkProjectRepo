const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String
});

const Product = mongoose.model('Product', productSchema);

const products = [
    {
        name: 'Product 1',
        description: 'Description for product 1',
        price: 19.99,
        image: 'https://via.placeholder.com/150'
    },
    {
        name: 'Product 2',
        description: 'Description for product 2',
        price: 29.99,
        image: 'https://via.placeholder.com/150'
    },
    {
        name: 'Product 3',
        description: 'Description for product 3',
        price: 39.99,
        image: 'https://via.placeholder.com/150'
    }
];

Product.insertMany(products)
    .then(() => {
        console.log('Products added successfully!');
        mongoose.connection.close();
    })
    .catch((error) => {
        console.error('Error adding products:', error);
        mongoose.connection.close();
    });
