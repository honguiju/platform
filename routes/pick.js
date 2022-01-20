var express =require('express');
var route = express.Router();

module.exports = function(client){
route.post('/',function(req,res){
    var brand_name= req.body.brand_name;
    console.log(brand_name)
    var sql ='select * from pick where  brand= ?;';
    if (req.user && req.user.login_id){
        var login_id=req.user.login_id;
        var sql_wishlist= "select * from wishlist where login_id = ?;";
        var check_wishlist=[]
        client.query(sql+sql_wishlist,[brand_name,login_id],function(err,results,field){
            var pick_result=results[0];
            var wishlist_result= results[1];
            if (!wishlist_result){
                
                for (var i =0; i <4; i++){
                    pick_result[i].heart ='<button class="wishlist_btn" name="add"><img src="img/empty_heart.svg" name='+i +'></button>';
                }
               
            }else{
                for (var data of wishlist_result){      
                    check_wishlist.push(data.name);
                }

                for (var i = 0; i<4; i++) {
                    var check_pick=check_wishlist.includes(pick_result[i].name)
                    if ( check_pick == true){
                        pick_result[i].heart = '<button class="wishlist_btn" name="del"><img src="img/heart.svg" name='+ i+'></button>';
                    } else {
                        pick_result[i].heart ='<button class="wishlist_btn" name="add"><img src="img/empty_heart.svg" name='+i +'></button>';
                    }
                }
            }
            console.log(pick_result)
            res.json(pick_result)

        })

    } else {
        client.query(sql,brand_name,function(err,result){
            for (var i =0; i <4; i++){
                result[i].heart ='<button class="wishlist_btn" name="heart"  onclick="Access_msg()"><img src="img/empty_heart.svg" ></button>';
            }
            console.log(result)
            res.json(result)
        })
    }
})
return route;
}