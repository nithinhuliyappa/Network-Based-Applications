var express=require('express');
var app=express();
var users=require('../model/user.js');
var items=require('../model/itemutil.js');
var validator=require('express-validator');
app.use(validator());

//Disabling the X-Powered-By Header

app.disable('x-powered-by');

module.exports=function (req,res,next) {
  if (req.session.authUserInfo==null){
      res.redirect('/signin');
  }
  else{
  if(req.method==='GET')
  {
    users.getUserItems(req.session.authUserInfo.firstName).exec(function(err,userItems){
        if (err) throw err;
        else{
          items.getItemAll().exec(function(err,itemsCat){
              if (err) throw err;
              else{
                  console.log(req.session);
                  res.render('myItems',{userItems:userItems,itemsCat:itemsCat, check:'1', sessioninfo:req.session});
              }
        });
      }
      });
  }else if (req.method==='POST') {
    var actionParameter=req.body;
    if(actionParameter.update)
    {
      users.getStatus(actionParameter.update).exec(function(err,userItem){
        if(err) throw err;
        else{
          items.getItemByName(actionParameter.update).exec(function(err,item){
            if(err) throw err;
            else{
              if (userItem.status=='Available' || userItem.status=='Swapped')
              {
                res.render('items',{useritem:userItem, item:item, use:null, sessioninfo:req.session});
              }
              else{
                res.render('mySwaps',{usercurrentitem:userItem, sessioninfo:req.session});
              }
            }
          });
        }
      });
    }
    else if(actionParameter.delete)
    {
      users.removeUserItem(req.session.authUserInfo.firstName, actionParameter.delete).exec(function(err,doc){
          if (err) throw err;
          else{
            users.getUserItems(req.session.authUserInfo.firstName).exec(function(err,userItems){
                if (err) throw err;
                else{
                  items.getItemAll().exec(function(err,itemsCat){
                      if (err) throw err;
                      else{
                          res.render('myItems',{userItems:userItems,itemsCat:itemsCat, check:'1', sessioninfo:req.session});
                          }
                        });
                      }
                    });
                  }
                });
    }
    else if (actionParameter.Accept) {
      users.updateUserItemStatus(req.session.authUserInfo.firstName, actionParameter.Accept, 'Swapped').exec(function(err,doc){
          if (err) throw err;
          else{
            users.getUserItems(req.session.authUserInfo.firstName).exec(function(err,userItems){
                if (err) throw err;
                else{
                  items.getItemAll().exec(function(err,itemsCat){
                      if (err) throw err;
                      else{
                          res.render('myItems',{userItems:userItems,itemsCat:itemsCat, check:'1', sessioninfo:req.session});
                          }
                        });
                      }
                    });
                  }
                });
    }
    else if (actionParameter.Reject || actionParameter.Withdraw) {
      users.updateUserItemStatus(req.session.authUserInfo.firstName, actionParameter.Reject||actionParameter.Withdraw, 'Available').exec(function(err,doc){
          if (err) throw err;
          else{
            users.getUserItems(req.session.authUserInfo.firstName).exec(function(err,userItems){
                if (err) throw err;
                else{
                  items.getItemAll().exec(function(err,itemsCat){
                      if (err) throw err;
                      else{
                          res.render('myItems',{userItems:userItems,itemsCat:itemsCat, check:'1', sessioninfo:req.session});
                          }
                        });
                      }
                    });
                  }
                });
    }
    else if (actionParameter.Offer) {
      users.getOtherItems(actionParameter.Offer).exec(function(err,items){
        if (err) throw err;
        else{
          console.log(items);
          res.render('swap',{otherItems:items, sessioninfo:req.session});
        }
      });
    }
  }
  else
  {
    next();
  }
}
}
