const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate");

require('../db/conn');
const User = require('../model/userSchema');

router.get('/', (req, res) => {
    res.send(`Hello world from the server rotuer js`);
});

router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({error: "All Fields are mandatory"});
    }

    try{
        const userExist = await User.findOne({email:email});

        if (userExist) {
            return res.status(422).json({error:"Email already exist"});
        } else if(password != cpassword){
            return res.status(422).json({error: 'confirm password is different from password'});
        }else{
            const user = new User({ name, email, phone, work, password, cpassword });
        
            await user.save();

            res.status(201).json({message:"user registered successfully"});
        }
        
    } catch(err) {
        console.log(err);
    }
    
});

//login route

router.post('/signin', async (req, res) => {
    // console.log(req.body);
    // res.json({message: "awesome"});
    try{
        let token;
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({error: "fill the all data"});
        }
        const userLogin = await User.findOne({email: email});
        // console.log(userLogin);
        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });
            
        if (!isMatch){
            res.status(400).json({error: "invalid paasword Credential"});
        } else {
            res.json({message:"user logged in successfully"});
        }
        } else {
            res.status(400).json({error: "invalid Credentials"});
        }
        
        

    } catch (err) {
        console.log(err);
    }
})

//surveyform
router.get('/survey', authenticate, (req,res) =>{
    res.send(`hello buddy, this is this is survey form`);
    res.send(req.rootUser);
});
//using promises
// router.post('/register', (req, res) => {

//     const { name, email, phone, work, password, cpassword } = req.body;

//     if(!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({error: "Fill the all field"});
//     }
//     User.findOne({email:email})
//     .then((userExist)=>{
//         if (userExist) {
//             return res.status(422).json({error:"Email already exist"});
//         }
//         const user = new User({ name, email, phone, work, password, cpassword });

//         user.save().then(()=> {
//             res.status(201).json({ message: "user registered successfully"});
//         }).catch((err) => res.status(500).json({ error:"failed to register"}));
//     }).catch(err=>{console.log(err);});
// });

module.exports = router;