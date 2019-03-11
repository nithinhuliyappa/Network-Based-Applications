var fs=require('fs');
var userData=fs.readFileSync('../model/userDB.json');
var itemData=fs.readFileSync('../model/itemDB.json');

var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/bookswap');

var userItemsSchema = new mongoose.Schema({
  userId:String,
  itemCode:String,
  item:String,
  rating:String,
  status:String,
  swapItem:String,
  swapItemRating:String,
  swapperRating:String
},{collection: 'useritem'});

var registeredUser = new mongoose.Schema({
  firstName:String,
  lastName:String,
  email:String,
  password:String
},{collection: 'registeredUser'});

var userItemsModel = mongoose.model('useritem', userItemsSchema);
var registeredUserModel = mongoose.model('registeredUser', registeredUser);

//user Object
module.exports.User=function(userId,firstName,lastName,emailAddress,address1Field,address2Field,city,state,zipCode,country){
  this.userId=userId;
  this.firstName=firstName;
  this.lastName=lastName;
  this.emailAddress=emailAddress;
  this.address1Field=address1Field;
  this.address2Field=address2Field;
  this.city=city;
  this.state=state;
  this.zipCode=zipCode;
  this.country=country;
};


// Feedback Schema and add me
//var offerFeedbackSchema = new Schema({
//      offerID:"string",
//      userID1:"string",
//      userID2:"string",
//      rating:"string"
//});

//var offerFeedback =mongoose.model('offerFeedback',offerFeedbackSchema);

//var addOfferFeedback = offerFeedback({
//      offerID:"5be8a96781e390a560236c3a",
//      userID1:"user1",
//      userID2:"user2",
//      rating:"3/5"
//}).save(function(err){
//  if(err) throw err;
//  console.log('offerFeedback saved');
//});

//userProfile Object
module.exports.UserProfile=function(userId,userItem){
  this.userId=userId;
  this.userItem=userItem;
};

//the below method will return all users
module.exports.getUser=function() {
  var output=JSON.parse(userData);
  var i=output.user;
  return i;
};

//returns all the profile for the given userid
module.exports.getUserProfile=function(id){
  var output=JSON.parse(userData);
  for(i=0;i<output.userProfile.length;i++){
     if(id===output.userProfile[i].userId){
       var res=i;
     }
   };
  if(res>=0)
  {
    return output.userProfile[res];
  }
  else
  {
    return -1;
  }
};

module.exports.authUser=function(uname, psw ){
  var query=registeredUserModel.findOne({email:uname, password:psw});
  return query;
}

module.exports.getOtherItems=function(item){
  var query=userItemsModel.find({$and: [{item:{$nin:item}},{status:{$in:'Available'}}]});
  return query;
}

//the below method will find and update the useritem status
module.exports.updateUserItemStatus=function(userId, userItem, status){
  console.log(userId+userItem+status);
  var query=userItemsModel.findOneAndUpdate({userId:userId, item:userItem},{$set:{status:status}});
  return query;
};

//returns all the items for the given userid
module.exports.getUserItems=function(id){
  var query=userItemsModel.find({userId:id});
  return query;
};

module.exports.removeUserItem = function (useritemlist,item) {
  var query=userItemsModel.deleteOne({userId:useritemlist, item:item});
  return query;
};

module.exports.getStatus=function (itemname) {
  var query=userItemsModel.findOne({item:itemname});
  return query;
};

module.exports.getAllUserItems=function (itemname) {
  var query=userItemsModel.find();
  return query;
};

module.exports.getItemcode=function(itemname){
  var input=JSON.parse(itemData);
  for(var i=0;i<input.items.length;i++){
    if(itemname===input.items[i].itemName){
      return input.items[i].itemCode;
    }
  }
}

//clears the profile of the given userid
module.exports.emptyProfile=function (id) {
  var output=JSON.parse(userData);
  for(i=0;i<output.userProfile.length;i++){
     if(id===output.userProfile[i].userId){
       var res=i;
     }
   };
   if (res>=0){
     output.userProfile.splice(res,1);
     return output.userProfile;
   }
   else{
     return false;
   }
};

//returns user related info for the given id
module.exports.getUsers=function(id) {
  var output=JSON.parse(userData);
  for(i=0;i<output.user.length;i++){
     if(id===output.user[i].userId){
       var res=i;
     }

  };
  if(res>=0){
    return output.user[res];
  }
  else{
    return false;
  }
};

module.exports.getSwapItems=function(id)
{
var output=JSON.parse(userData);
var list=[];
for(i=0;i<output.userItem.length;i++){
  if(output.userItem[i].userId===id)
  {
    list.push(output.userItem[i]);
  }
}
return list;
};

module.exports.getCategoryBasedOnItem = function (itemName) {
  var input=JSON.parse(itemData);
  for(var i=0;i<input.items.length;i++){
      if(itemName===input.items[i].itemName){
        return input.items[i];
      }
  }
};

//module.exports = User;
