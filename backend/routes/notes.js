const express = require('express');
const {body, validationResult } = require('express-validator');
const getUserFromMiddleware = require('../middleware/fetchuser')
const Notes = require('../models/Notes');
const router = express.Router()



// Route 1: fetch all notes of user 
router.get('/get-all-notes-of-user',getUserFromMiddleware,async(req,res)=>{
    
    try {
        const notes = await Notes.find({user:req.user.id});
        res.send(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }


})


// Route 2: add notes of user


router.post('/add-notes',[
    body('title','Enter valid title').isLength({min:3}),
    body('description','Enter valid description').isLength({min:5})
],getUserFromMiddleware,async(req,res)=>{
    let success = false;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).json({success,error: errors.array()});
        }
        const {title,description,tag} = req.body;
        const note = new Notes({
            title,
            description,
            tag,
            user:req.user.id
        })  
        const savedNote = await note.save();
        success = true;
        res.json({success,savedNote});

    } catch (error) {
        console.error(error.message);
        res.status(500).send({success,msg:"Internal server error"});
    }


})


// route 3: update  note by note_id


router.put('/update-note/:id',getUserFromMiddleware,async(req,res)=>{
    const success =false;
    try {
        const {title,description,tag}= req.body;
        
        const newNote = {};
        if(title){
            newNote.title= title;
        }
        if(description){
            newNote.description= description;
        }
        if(tag){
            newNote.tag= tag;
        }

        let note = await Notes.findById(req.params.id)

        if(!note){
            return res.status(401).send({success,msg:"Note not Found"});
        }
        if( note.user.toString() !== req.user.id){
            return res.status(401).send({success,msg:"Not Allowed"});
        }

        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.json({success:true,note});

    } catch (error) {
        console.error(error.errors);
        res.status(500).send({success,msg:"Internal server error"});   
    }

})

// route 4: delete  note by note_id


router.delete('/delete-note/:id',getUserFromMiddleware,async(req,res)=>{
    let success = false;
    try {
    
        let note = await Notes.findById(req.params.id)

        if(!note){
            console.log("note not found");
            return res.status(400).send({success,msg:"Note not Found"});
        }
        
        if(note.user.toString() !== req.user.id){
            return res.status(401).send({success,msg:"Not Allowed"});
        }
        
        // note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});  
        note = await Notes.findByIdAndDelete(req.params.id,)
        success=true;
        res.json({success,note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send({success,msg:"Internal server error"});   
    }

})


module.exports = router;