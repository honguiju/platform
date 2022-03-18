var express =require('express');
var route = express.Router();

module.exports = function(client){
    route.get('/',function(req,res){
        var product_id=req.query.id
        var product_kind_code = product_id.substring(2,4);
        var kind_num="'__"+product_kind_code+"%'";
        var sql_similar_product ="select * from products WHERE product_id LIKE "+kind_num +"ORDER BY rand() limit 12;"
        var sql_detail_product="select * from products where product_id = ?;"
        if (req.user && req.user.login_id) {
            var replace_login_code = [{
                'logout' : `<li><a href="/views/login/logout">로그아웃</a></li>`,
                'user_info' : `<li><a href="/views/mypage">마이페이지</a></li>`,
                'status' : 'ok'
            }];
            
            var login_id = req.user.login_id;
            var sql_wishlist= "select * from wishlist where login_id = ?;";
            
            client.query(sql_detail_product+sql_similar_product+sql_wishlist,[product_id,login_id], function(error, results, field){
                var detail_result=results[0];
                var similar_result=results[1];
                var wishlist_result=results[2];
                var check_wishlist =[];
                if (!wishlist_result){
                    detail_result.heart = 'no';
                    
                    for (var i =0; i <12; i++){
                        similar_result[i].heart = 'no';
                    }
                    
                }  else {
                    for (var data of wishlist_result){      
                        check_wishlist.push(data.name);
                    };

                    var check_detail=check_wishlist.includes(detail_result[0].name)
                    if (check_detail == true) {
                        detail_result.heart = "ok";
                    }

                    for (var i = 0; i<12; i++) {
                        var check_similar=check_wishlist.includes(similar_result[i].name)
                        if ( check_similar == true){
                            similar_result[i].heart = "ok";
                        } else {
                            similar_result[i].heart = "no";
                        }
                    }
                    
                }
                console.log(detail_result)
                res.render('detail',{
                    detail_data : detail_result,
                    similar_data : similar_result,
                    wishlist_data : wishlist_result,
                    login_status : replace_login_code
                })
            })
        } else {
            replace_login_code = [{
                'logout' : `<li><a href="/views/login">로그인</a></li>`,
                'user_info' : `<li><a href="/views/signup">회원가입</a></li>`,
                'status' : 'no'
            }];

            client.query(sql_detail_product+sql_similar_product,product_id, function(error, results, field){
                var detail_result=results[0];
                var similar_result=results[1];
                console.log(replace_login_code[0].status)
                res.render('detail',{
                    detail_data : detail_result,
                    similar_data : similar_result,
                    login_status : replace_login_code
                })
            })
        }
    })
    return route;
}