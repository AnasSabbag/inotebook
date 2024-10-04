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

// get all user
router.get('/get-all-users',async (_req,res)=>{
    try {
        // const userId = req.user.id;
        const users = await User.find({});
        // console.log(users);
        res.json(users);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({message:"Internala server error"});
    }

})


// update user

router.put('/update-user',[
    body('name','Enter valid name').isLength({min:3}),
    body('email','Enter valid email').isEmail(),
    body('password','Password atleast valid 5 character long').isLength({min:5})
    ],
    getUserFromMiddleware,async(req,res)=>{
        const success =false;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success,errors:errors.array()});
        }
        try {
            
            const {name,email,password}= req.body;
            
            const newUser = {};
            const salt = await bcrypt.genSalt(10);
            const secPass = await  bcrypt.hash(password,salt)
            newUser.name= name;
            newUser.email= email;
            newUser.password=secPass;
            newUser.id = req.user.id;
            let user ={};
            user = await User.findOne({_id:req.user.id});
            if(user === null){
                return res.status(400).json({success,errors:"user does not exists. "})
            }

            // check email is already exist for that user 
            if(email !== user.email){

                let chek= await User.find({
                    email: {$eq:email},
                    _id : {$ne:req.user.id}
                })
                
                if(chek.length !==0 ){
                    return res.status(400).json({success,errors:"email already exists. "})
                }
            }

            user = await User.findByIdAndUpdate(req.user.id,{$set:newUser});
            res.json({success:true,newUser});

        } catch (error) {
            console.error(error.message);
            res.status(500).send({success,msg:"Internal server error"});   
        }

})





// delete user by id 

router.delete('/delete-user/:id',getUserFromMiddleware,async(req,res)=>{
    let success = false;
    try {
    
        let user = await User.findById(req.params.id)

        if(!user){
            console.log("user not found");
            return res.status(400).send({success,msg:"User not Found"});
        }
        
        // if(user._id.toString() !== req.user.id){
        //     console.log("user :",user);
        //     console.log("req.user.id: ",req.user.id);
        //     return res.status(401).send({success,msg:"Not Allowed"});
        // }
         
        user = await User.findByIdAndDelete(req.params.id,)
        success=true;
        res.json({success,user});

    } catch (error) {
        console.error(error.message);
        res.status(500).send({success,msg:"Internal server error"});   
    }

})




module.exports=router;


