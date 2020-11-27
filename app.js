const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyPaser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
 
mongoose.connect('mongodb+srv://pro:'+
        process.env.MONGO_ATLAS_PW +
         '@pro.caldm.mongodb.net/<dbname>?retryWrites=true&w=majority',
       {
           useMongoClient: true
       }
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyPaser.urlencoded({extended: false}));
app.use(bodyPaser.json());

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-width, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT','GET', 'PATCH', 'DELETE', 'POST');
        return res.status(200).json({});
    }
    next();
});

//routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) =>{
    const error = new Error('not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});


module.exports =app;