const express = require('express')
const User = require('../models/User')
const router = express.Router()
const {body, validationResult } = require('express-validator');
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET= 'helloworld';
const getUserFromMiddleware = require('../middleware/fetchuser')

// creater user using : post "/api/auth/". does'nt require auth
router.post('/createuser',[
    body('name','Enter valid name').isLength({min:3}),
    body('email','Enter valid email').isEmail(),
    body('password','Password atleast valid 5 character long').isLength({min:5})
],async(req,res)=>{
    console.log("called");
    let success =false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()});
    }

    try{
        let user = await User.findOne({email:req.body.email});
        if (user){
            return res.status(400).json({success,errors:"email already exists. "})
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await  bcrypt.hash(req.body.password,salt)


        user = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secPass,

        })    
       
        const data ={
            user:{
                id:user.id
            }
        }
        const authToken =  jwt.sign(data,JWT_SECRET);
        success=true;
        res.send({success,authToken});

    }catch(error){
        console.error(error.message)
        res.status(500).send("internal error")
    }
    
})


// Route 2: Authenticate a User using :POST /api/auth/login

router.post('/login',[
    body('email','Enter valid email').isEmail(),
    body('password','password cannnot be blank').exists()
],async(req,res)=>{
    let success =false;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
       return res.status(400).json({
            errors:errors.array,
            message: "bad request"
        })
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success,error:"Invalid credentials email does not exists for user"});
        }

        const comparePassword = await bcrypt.compare(password,user.password);
        if(!comparePassword){
            return res.status(401).json({success,error:"Invalid credentials :incorrect password"});
        }

        const data = {
            user:{
                id:user.id
            }
        }
        success=true;
        const authToken = jwt.sign(data,JWT_SECRET);
        res.json({success,authToken});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})



// Route 3: Get loggedin user details using: post "/api/auth/get-user",login required

router.get('/get-user',getUserFromMiddleware,async (req,res)=>{
    try {
        
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json({user})

    } catch (error) {
        console.error(error.message);
        res.status(500).send({message:"Internala server error"});
    }

})



module.exports=router;


