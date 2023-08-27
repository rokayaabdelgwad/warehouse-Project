const express = require('express');
const app = express();
const userRouter = require('./routes/userRoutes');
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



app.use('/warehouse/v1/users', userRouter);
module.exports = app;