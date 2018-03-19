const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose= require('mongoose');

require('../models/User');

const users= mongoose.model('users');

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        faliureFlash:true
    })(req,res,next);
})



router.post('/register',(req,res)=>{
    if(req.body.password===req.body.password2){
        users.findOne({
            username:req.body.username,
        }).then((result)=>{
            if(result){
                req.flash('error_msg','User Already Exsists');
                res.redirect('/users/login');
            }
            else{
                const NewUser={
                    name:req.body.name,
                    username:req.body.username,
                    password:req.body.password
                }
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(NewUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        NewUser.password= hash;
            
                        new users(NewUser).save()
                        .then(()=>{
                            req.flash('success_msg','User Registered');
                            res.redirect('/users/login')
                        }).catch((err)=>{
                            console.log(err);
                        })
                    })
                })
            }
        })


}
else{
    req.flash('error_msg','Password doesnt match');
    res.redirect('/users/register');
}
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are looged out');
    res.redirect('/users/login');
})

module.exports= router;