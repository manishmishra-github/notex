const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session= require('express-session');
const flash = require('connect-flash');
const mongoose= require('mongoose');
const passport=require('passport')

const app = express();

const ideas = require('./routes/ideas');
const user = require('./routes/user');
require('./config/passport')(passport);

const db = require('./config/database');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user||null;

    next();
});

mongoose.connect(db.mongoUri)
.then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err)
});



app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/about',(req,res)=>{
    res.render('about');
});

app.use('/ideas',ideas);
app.use('/users',user);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('server running');
})