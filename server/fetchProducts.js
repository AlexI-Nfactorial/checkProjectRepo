const axios = require('axios');
const mongoose = require('mongoose');
const cron = require('node-cron');

mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String
});

const Product = mongoose.model('Product', productSchema);

const fetchAndStoreProducts = async () => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products');
        const products = response.data;

        for (const product of products) {
            await Product.findOneAndUpdate(
                { id: product.id },
                product,
                { upsert: true }
            );
        }

        console.log('Products fetched and updated successfully!');
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Fetch products immediately on start
fetchAndStoreProducts();

// Schedule the job to run every hour
cron.schedule('0 * * * *', () => {
    console.log('Fetching and updating products...');
    fetchAndStoreProducts();
});
