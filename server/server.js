const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const app = express();

mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());

// Product Schema
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

app.get('/api/products', async (req, res) => {
    const search = req.query.search || '';
    const sort = req.query.sort || 'title';
    const products = await Product.find({ title: new RegExp(search, 'i') }).sort(sort);
    res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('There was an error registering the user!', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.json({ token });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
