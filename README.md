
# E-commerce Web Application

This is a simple e-commerce web application built using the MERN stack (MongoDB, Express, React, and Node.js). The application allows users to browse products, leave reviews, and add items to a cart. Users can also register and log in to manage their carts. The products are fetched from [Fake Store API](https://fakestoreapi.com/) and kept up to date with a scheduled job.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Features](#features)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Installation

### Prerequisites

- Node.js and npm
- MongoDB

### Clone the Repository

```sh
git clone https://github.com/yourusername/ecommerce-web-app.git
cd ecommerce-web-app
```

### Install Server Dependencies

```sh
cd server
npm install
```

### Install Client Dependencies

```sh
cd ../client
npm install
```

### Start MongoDB

Make sure MongoDB is running on your local machine. You can start MongoDB using the following command on Windows:

```sh
net start MongoDB
```

Alternatively, you can start MongoDB manually using the `mongod` command.

### Fetch and Store Initial Products

To fetch products from the Fake Store API and store them in the MongoDB database, run the following script:

```sh
cd ../server
node fetchProducts.js
```

### Start the Application

Start the server:

```sh
cd server
node server.js
```

Start the React development server:

```sh
cd ../client
npm start
```

Open your browser and navigate to `http://localhost:3000`.

## Usage

### Browsing Products

On the homepage, you can see a list of products. You can search for products and sort them by name or price.

### Viewing Product Details

Click on a product name to view its details.

### Adding Products to Cart

On the product detail page, click the "Add to Cart" button to add the product to your cart.

### Managing Your Cart

Navigate to the cart page to view and manage the items in your cart.

### User Registration and Login

Register a new account or log in to manage your cart.

## API Endpoints

### Products

- `GET /api/products`: Get all products.
- `GET /api/products/:id`: Get a specific product by ID.

### Users

- `POST /api/register`: Register a new user.
- `POST /api/login`: Log in a user.

## Project Structure

```
ecommerce-web-app/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── AuthContext.js
│   │   ├── Cart.js
│   │   ├── Header.js
│   │   ├── Login.js
│   │   ├── ProductDetail.js
│   │   ├── ProductList.js
│   │   ├── Register.js
│   │   └── index.js
│   ├── package.json
│   └── ...
├── server/
│   ├── fetchProducts.js
│   ├── server.js
│   ├── package.json
│   └── ...
└── ...
```

## Features

- User registration and login.
- Product browsing, searching, and sorting.
- Product detail view.
- Adding products to a cart.
- Managing the cart.
- Periodic updates of products from the Fake Store API.

## Keeping Products Up-to-Date

The application uses a cron job to periodically fetch and update products from the Fake Store API. This ensures that the product data is always current.

### Setting Up the Cron Job

The cron job is set up using the `node-cron` library. The script fetches products from the Fake Store API and updates the MongoDB database every hour.

1. **Install `node-cron`:**

   ```sh
   cd server
   npm install node-cron
   ```

2. **Update the `fetchProducts.js` script:**

   ```js
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
   ```

## Future Enhancements

- Implement user reviews and ratings for products.
- Add more robust user authentication and authorization.
- Improve the UI/UX with better styling and responsive design.
- Integrate with external APIs for dynamic product data.
- Add a payment gateway for completing purchases.

## License

This project is licensed under the MIT License.
