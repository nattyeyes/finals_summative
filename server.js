const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/userModel')
const Product = require('./models/productModel')
const Order = require('./models/orderModel')
const res = require('express/lib/response')
const app = express()
const port = 3000

let loggedUser;

app.use(express.json())
app.use(express.urlencoded({extended: false}))

//routes

app.get('/', (req, res) => {
    res.send('Hello NODE API')
})

//fetch all users
app.get('/user', async(req, res) => {
    try {
        const user = await User.find({});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//fetch all products
app.get('/product', async(req, res) => {
    try {
        const product = await Product.find({});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//fetch all active products
app.get('/product/active', async(req, res) => {
    try {
        const product = await Product.find({isActive: true});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//fetch single product by name
app.get('/product/single', async(req, res) => {
    try {
        const product = await Product.find({name: req.body.name});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//fetch product by id
app.get('/product/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    } 
})

//fetch user by id
app.get('/user/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message})
    } 
})

//fetch logged user's order
app.get('/user/order', async(req, res) => {
    try {
        const order = await Order.find({userId: loggedUser._id});
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//fetch all orders
app.get('/order', async(req, res) => {
    try {
        if(loggedUser.isAdmin === true){
            const order = await Order.find({});
            res.status(200).json(order);
        } else {
            res.send(`Not an Admin.`)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//create a new user (registration)
app.post('/user', async(req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json(user);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//create a new product
app.post('/product', async(req, res) => {
    try {
        if(loggedUser.isAdmin === true){
            const product = await Product.create(req.body)
            res.status(200).json(product);
        } else {
            res.send(`Not an Admin.`)
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//create a new order (add to cart)
app.post('/order', async(req, res) => {
    try {
        const order = await Order.create(req.body)
        res.status(200).json(order);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//login
app.post('/user/login', async(req, res) => {
    try {
        const user = await User.find({email: req.body.email, password: req.body.password})
        //user can't be found in database
        if(!user){
            return res.status(404).json({message: `User cannot be found.`})
        }
        loggedUser = user;
        res.status(200).json({message: `Logged in.`});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//update a user
app.put('/user/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        //user can't be found in database
        if(!user){
            return res.status(404).json({message: `User ID ${id} cannot be found.`})
        }
        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//update a product
app.put('/product/:id', async(req, res) => {
    try {
        if(loggedUser.isAdmin === true){
            const {id} = req.params;
            const product = await Product.findByIdAndUpdate(id, req.body);
            //product can't be found in database
            if(!product){
                return res.status(404).json({message: `Product ID ${id} cannot be found.`})
            }
            const updatedProduct = await Product.findById(id);
            res.status(200).json(updatedProduct);
        } else {
            res.send(`Not an Admin.`)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//delete a user
app.delete('/user/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message: `User ID ${id} cannot be found.`})
        }
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//delete a product
app.delete('/product/:id', async(req, res) => {
    try {
        if(loggedUser.isAdmin === true){
            const {id} = req.params;
            const product = await Product.findByIdAndDelete(id);
            if(!product){
                return res.status(404).json({message: `Product ID ${id} cannot be found.`})
            }
            res.status(200).json(product)
        } else {
            res.send(`Not an Admin.`)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//delete a order
app.delete('/order/:id', async(req, res) => {
    try {
        if(loggedUser.isAdmin === true){
            const {id} = req.params;
            const order = await Order.findByIdAndDelete(id);
            if(!order){
                return res.status(404).json({message: `Order ID ${id} cannot be found.`})
            }
            res.status(200).json(order)
        } else {
            res.send(`Not an Admin.`)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://admin:12345@amatafinalsapi.oa4xpam.mongodb.net/Finals-API?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, ()=> {
        console.log(`Node API app is running on port ${port}`)
    })
}).catch(() => {
    console.log(error)
})