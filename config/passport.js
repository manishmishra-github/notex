const local = require('passport-local').Strategy;
const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

const user = mongoose.model('users');



module.exports=(passport)=>{
    passport.use(new local((username,password,done)=>{
        user.findOne({
            username:username
        }).then((user)=>{
            if(!user){
                console.log('not found')
                return done(null,false); 
            }
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null,user)
                }
                else{
                    return done(null,false)
                }
            })
        })
    }));

    passport.serializeUser((user,done)=>{
        done(null,user.id)
    });

    passport.deserializeUser((id,done)=>{
        user.findById(id,(err,user)=>{
            done(err,user)
        })
    })
}