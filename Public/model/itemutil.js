var fs =  require('fs');
var itemData = fs.readFileSync('../model/itemDB.json');

var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/bookswap');

var categorySchema = new mongoose.Schema({
  categoryCode: String,
  categoryName: String
},{collection: 'categories'});

var itemsSchema = new mongoose.Schema({
  itemCode: String,
  itemName: String,
  catalogCategory: String,
  description: String,
  rating: String,
  imageURL: String
},{collection:'items'});

var categoryModel = mongoose.model('categories', categorySchema);
var itemsModel = mongoose.model('items', itemsSchema);


module.exports.getItemAll=function() {
  var query=itemsModel.find();
  return query;
};

module.exports.getItemByName=function(itemName) {
  var query=itemsModel.findOne({itemName:itemName});
  return query;
};

module.exports.getItemsNinUserProfile=function(useritem) {
  var userItemName=[];
  for (i=0; i<useritem.length; i++){
      userItemName.push(useritem[i].item);
  }
  var query=itemsModel.find({itemName:{$nin:userItemName}});
  return query;
};

module.exports.getItem=function (id) {

  var query=itemsModel.findOne({itemCode:id});
  return query;
  //var output=JSON.parse(itemData);
  //for(i=0;i<output.items.length;i++){
  //  if(id==output.items[i].itemCode){
  //    var res=i;
  //  }
  //};
  //if(res>=0){
  //  return(output.items[res]);
  //}
  //else {
  //  return false;
  //}
};

module.exports.getCategories=function() {
  //var output=JSON.parse(itemData);
  //var i=output.categories;
  //return i;
  var query=categoryModel.find();
  return query;
};

module.exports.getUsers=function(){
  var output=JSON.parse(itemData);
  var i=output.users;
  return i;
};
