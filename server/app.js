const express = require('express');
const dotenv = require('dotenv');
const app = express();


dotenv.config({path: './config.env'});
require('./db/conn');
app.use(express.json());
// const User = require('./model/userSchema');
// we link the router files to make our route easy 
app.use(require('./router/auth'));

const port = process.env.PORT;


// app.get('/', (req, res) =>{
//     res.send(`Hello your api's health is ok.`);
// });

app.get('/survey', (req,res) =>{
    res.send(`hello buddy, this is this is survey form`);
});

app.get('/signin', (req,res) =>{
    res.send(`hello buddy, this is login universe`);
});

app.get('/signup', (req,res) =>{
    res.send(`hello buddy, this is register universe`);
});

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})