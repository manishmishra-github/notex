const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const {ensureAuthenticated}= require('../helpers/auth')

require('../models/Idea');
const note= mongoose.model('notes');

router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add');
});

router.get('/',ensureAuthenticated,(req,res)=>{
    note.find({user:req.user.id})
    .sort({date:'desc'})
    .then((result)=>{
        res.render('ideas/index',{
            result,

        })
    })    
})

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    note.findOne({
        _id:req.params.id

    }).then((e)=>{
        if(e.user!=req.user.id){
            req.flash('error_msg','Not Authorized');
            res.redirect('/ideas')
        }else{
        res.render('ideas/edit',{
            e
        })
    }
    })
})

router.post('/',ensureAuthenticated,(req,res)=>{

    const newNote ={
        title:req.body.title,
        details:req.body.details,
        user:req.user.id
    }
    new note(newNote).save()
    .then((s)=>{
        req.flash('success_msg','Note has been added');
        res.redirect('/ideas')
    })
});

router.put('/:id',ensureAuthenticated,(req,res)=>{
   note.findOne({
       _id:req.params.id
   })
   .then((r)=>{
       r.title= req.body.title;
       r.details= req.body.details;

       r.save()
       .then((i)=>{
        req.flash('success_msg','Note has been updated');
           res.redirect('/ideas')
       })
   })
})

router.delete('/:id',ensureAuthenticated,(req,res)=>{
    note.remove({
        _id:req.params.id
    }).then(()=>{
        console.log();
        req.flash('error_msg','Note has been deleted');
        res.redirect('/ideas')
    })
})





module.exports=router;