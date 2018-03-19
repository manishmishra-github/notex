if(process.env.NODE_ENV=== 'production'){
    module.exports={
        mongoUri:'mongodb://manish:fury180597@ds117739.mlab.com:17739/vidjot-prod'
    }
}else{
    module.exports={
        mongoUri:'mongodb://localhost/notes'
    }
}