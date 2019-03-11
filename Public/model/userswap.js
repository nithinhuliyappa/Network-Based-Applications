
var userSwap = function(UserItem, Rating, Status, SwapItem, SwapItemRating, SwapperRating) {
    var userSwapObj = {
      UserItem:UserItem,
      Rating:Rating,
      Status:Status,
      SwapItem:SwapItem,
      SwapItemRating:SwapItemRating
      SwapperRating:SwapperRating};

        return userSwapObj;
  };

  module.exports.userSwap = userSwap;
