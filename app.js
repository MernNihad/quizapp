var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var fileUpload = require('express-fileupload')
var MongoStore = require('connect-mongo')
const { handlebars } = require('hbs');
var app = express();
var db = require('./config/connection')
var session = require('express-session')
// view engine setup

Handlebars.registerHelper('ifEquals',function(v1,v2,options){
  if(v1 === v2 ){
    return options.fn(this)
  }
  return options.inverse(this)
})


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutDir:__dirname+'/views/layouts/',partialsDir:__dirname+'/views/partials/'}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use(session({
  secret:'Key',
  cookie:{
    maxAge: 1000 * 3600 *24 *30 *2  // 60 day ( milliseconds )
  },
  resave:true,
  saveUninitialized:true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost/quizapp',
    autoRemove: 'native', /*'Default' */
    ttl: 3600 * 24 * 30 * 2 // = 60 days. Default  ( second  )
  })
}))

// app.use(session({secret:'Key',cookie:{expires: 86400 ,maxAge: Date.now() + (30 * 864000 )  }})) 
db.connect((err)=>{
  if(err)
  console.log('Connection Error'+err)
  else
  console.log('Connection Success')
})
app.use('/', userRouter);
app.use('/admin', adminRouter);
// app.all('*',(req,res,next)=>{
//   res.redirect('/')
// })
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;