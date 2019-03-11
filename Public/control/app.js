//var student = require ('../models/student');
var express = require ('express');
var app = express();
var items =require('../model/itemutil');
var userProfile=require('../control/ProfileController');
var users =require('../model/user');
var validator=require('express-validator');

//session handling
var session = require('express-session');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(validator());

//Disabling the X-Powered-By Header

app.disable('x-powered-by');

//mongoose-mongodb connection
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/bookswap');

app.use(cookieParser());
app.use(session({secret: "nbad session secret"}));

app.set('view engine', 'ejs');
app.set('views', '../view');

app.use('/resources', express.static('../resources'));

app.get('/signin', function(req,res){
  res.render('login',{msg:"", sessioninfo:req.session});
});

app.post('/signin', urlencodedParser,function(req,res){
  var authUser=req.body;
  req.checkBody('uname','Invalid Email').isEmail();
  req.checkBody('psw','Only Alphabhet, Number and !@#$%^& is allowed in password').trim().matches(/^[a-zA-Z0-9!@#$%^&]+$/i);
  var errors=req.validationErrors();
  if (errors){
    res.render('login',{sessioninfo:req.session, msg:"Please enter valid email or Only Alphabhet, Number and $%&* is allowed"});
  }
  else{
    users.authUser(authUser.uname, authUser.psw).exec(function(err,doc){
        if (err) throw err;
        else if (doc==null){
          res.render('login',{msg:"Entered User Name or Password is Incorrect!", sessioninfo:req.session});
        }
        else {
          req.session.authUserInfo=doc;
          res.redirect('/myItems');
        }
    });
  }
});

app.get('/Index', function(req, res){
  res.render('index',{sessioninfo:req.session});
});

app.get('/myItems',userProfile);
app.post('/myItems*',urlencodedParser,userProfile);

app.get('/signout',function (req,res) {
    req.session.destroy();
    //res.render('categories', {catCategory:req.query.catalogCategory, item: items, use:req.query.itemCode});
    items.getCategories().exec(function(err,category){
        if (err) throw err;
        else{
          items.getItemAll().exec(function(err,items){
          if (err) throw err;
          else{
            res.render('categories', {catCategory:req.query.catalogCategory, category:category, item:items, sessioninfo:req.session});
          }
        });
      }
    });
});

app.get('/swap', function(req, res){
  if (req.session.authUserInfo==null){
      res.redirect('/signin');
  }
  else{
      res.render('swap', {sessioninfo:req.session});
  }
});

app.post('/swap*',urlencodedParser, userProfile);

app.get('/categories', function(req, res){
  //res.render('categories', {catCategory:req.query.catalogCategory, item: items});
  items.getCategories().exec(function(err,category){
      if (err) throw err;
      else{
        users.getAllUserItems().exec(function(err,useritems){
        if (err) throw err;
        else{
          if (req.session.authUserInfo==null){
            res.redirect('/signout');
          }
          else{
          items.getItemsNinUserProfile(useritems).exec(function(err,items){
            if (err) throw err;
            else {
              res.render('categories', {catCategory:req.query.catalogCategory, category:category, item:items, useritems:useritems, sessioninfo:req.session});
            }
          });
        }
      }
      });
    }
  });
});

app.get('/items', function(req, res){
  if (req.session.authUserInfo==null){
    res.redirect('/signin');
  }
  else{
  if (Object.keys(req.query).length==0){
      //res.render('categories', {catCategory:req.query.catalogCategory, item: items, use:req.query.itemCode});
      items.getCategories().exec(function(err,category){
          if (err) throw err;
          else{
            items.getItemAll().exec(function(err,items){
            if (err) throw err;
            else{
              users.getAllUserItems().exec(function(err,useritems){
                if (err) throw err;
                else {
                  res.render('categories', {catCategory:req.query.catalogCategory, category:category, item:items, useritems:useritems, sessioninfo:req.session});
                }
              });
            }
          });
        }
      });
  }else if (items.getItem(req.query.itemCode)==false) {
    //res.render('items', {itemCode:req.query.itemCode, item : items, use:req.query.itemCode});
    items.getItem(req.query.itemCode).exec(function(err,items){
    if (err) throw err;
    else{
      res.render('items', {itemCode:req.query.itemCode, item : items, use:req.query.itemCode, sessioninfo:req.session});
    }
  });
  }else {
      //res.render('items', {itemCode:req.query.itemCode, item : items, use:req.query.itemCode});
      items.getItem(req.query.itemCode).exec(function(err,items){
      if (err) throw err;
      else{
        res.render('items', {itemCode:req.query.itemCode, item : items, use:req.query.itemCode, sessioninfo:req.session});
      }
    });
  }
}
});

app.get('/about', function(req, res){
  res.render('about',{sessioninfo:req.session});
});

app.get('/contact', function(req, res){
  res.render('contact',{sessioninfo:req.session});
});

app.get('/mySwaps',function(req,res){
  if(req.session.authUserInfo==null){
    res.redirect('/signin');
  }
  else{
    res.render('mySwaps',{usercurrentitem:'1', sessioninfo:req.session})
  }
});

app.listen(8080);
