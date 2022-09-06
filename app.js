if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

// node module imports
const express = require('express');
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const passport= require('passport');
const LocalStrategy= require('passport-local');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const {MongoStore} = require('connect-mongo');
const MongoDBStore = require("connect-mongo");

// import from another files

const User=require('./models/user.js');
const ExpressError = require('./utils/ExpressError');
const userRoutes=require('./routes/users.js');
const userInfoRoutes=require('./routes/userInfo.js');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/CP-Todo';

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology: true
})

const db=mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const app= express();

app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'/views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret=process.env.SECRET || 'thisshouldbeabettersecret!';
const store= MongoDBStore.create({
    mongoUrl: dbUrl,
    secret:secret,
    touchAfter: 24* 60 * 60,
});
store.on("error", function(e){
    console.log("SESSION STORE ERROR", e);
})
const sessionConfig={
    store: store,
    name:'session',
    secret: secret,
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        //secure: true,
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

// app.use(helmet());


// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com",
//     "https://kit.fontawesome.com",
//     "https://cdnjs.cloudflare.com",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com",
//     "https://stackpath.bootstrapcdn.com",
//     "https://cdn.jsdelivr.net",
//     "https://fonts.googleapis.com",
//     "https://use.fontawesome.com",
// ];
// const connectSrcUrls = [
//     "https://cdn.jsdelivr.net",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             childSrc: ["blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://images.unsplash.com",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    if (!['/login', '/register', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    next();
})


app.use('/',userRoutes);
app.use('/:username',userInfoRoutes);


app.get('/',(req,res)=>{
    res.render('home')
})




app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found!!',404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500}= err;
    if(!err.message) err.message="Something went wrong!!";
    res.status(statusCode).render('error',{err});
})

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('listening!!');
})