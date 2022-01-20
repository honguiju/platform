var express =require('express');
var route = express.Router();

module.exports = function(client){
    route.post('/',function(req,res){
        var Num=req.body.startNum;
        var btn_num=req.body.btn_num;
        btn_num=parseInt(btn_num)
        console.log(Num)
        var sql ='select * from products ORDER BY id DESC LIMIT '+Num+','+'8'+';';
        if (req.user && req.user.login_id){
            var login_id=req.user.login_id;
            var sql_wishlist= "select * from wishlist where login_id = ?;";
            var check_wishlist=[]
            client.query(sql+sql_wishlist,login_id,function(err,results,field){
                var plus_result=results[0];
                var wishlist_result= results[1];
                if (!wishlist_result){
                    
                    for (var i =0; i <8; i++){
                        plus_result[i].heart ='<button class="wishlist_btn" name="add"><img src="img/empty_heart.svg" name='+btn_num +'></button>';
                        btn_num+=1
                    }
                
                }else{
                    for (var data of wishlist_result){      
                        check_wishlist.push(data.name);
                    }

                    for (var i = 0; i<8; i++) {
                        var check_plus=check_wishlist.includes(plus_result[i].name)
                        if ( check_plus == true){
                            plus_result[i].heart = '<button class="wishlist_btn" name="del"><img src="img/heart.svg" name='+ btn_num+'></button>';
                            btn_num+=1
                        } else {
                            plus_result[i].heart ='<button class="wishlist_btn" name="add"><img src="img/empty_heart.svg" name='+btn_num +'></button>';
                            btn_num+=1
                        }
                    }
                }
                console.log(plus_result)
                res.json(plus_result)

            })

        } else {
            client.query(sql,function(err,result){
                for (var i =0; i <8; i++){
                    result[i].heart ='<button class="wishlist_btn" name="heart"  onclick="Access_msg()"><img src="img/empty_heart.svg" ></button>';
                }
                console.log(result)
                res.json(result)
            })
        }  
    })
    return route;
}