module.exports={
    
    ensureAuthenticated:(req,res,next)=>{
    if(req.isAuthenticated()){
        next();

    }
    else{
        req.flash('error_msg','Not Authorised');
        res.redirect('/users/login')
    }
}

}