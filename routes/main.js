var express =require('express');
var route = express.Router();

module.exports = function(client){
    route.get('/',function(req,res){ // 메인 페이지 접속
        console.log('메인페이지 접속')
        var sql_main_products ="select * from products ORDER BY id DESC LIMIT 0,8; " //ORDER BY id DESC LIMIT 8; 최신 상품을 들고온다. 뒤에서 8개를 뽑는다.
        var sql_pick_products="select * from pick where brand = '에몬스가구';";  
    
    
        if (req.user && req.user.login_id) {
            var replace_login_code = [{
                'logout' : `<li><a href="/views/login/logout">로그아웃</a></li>`, 
                'user_info' : `<li><a href="/views/mypage">마이페이지</a></li>`,
                'status' : 'ok'
            }];
            
            var login_id = req.user.login_id;
            var sql_wishlist= "select * from wishlist where login_id = ?";
            
            client.query(sql_main_products+sql_pick_products+sql_wishlist,login_id, function(error, results, field){
                var main_result=results[0];
                var pick_result=results[1];
                var wishlist_result=results[2];
                var check_wishlist =[];
                if (!wishlist_result){
                    
                    for (var i =0; i <4; i++){
                        pick_result[i].heart = 'no';
                    }
    
                    for (var i =0; i <8; i++){
                        main_result[i].heart = 'no';
                    }
                    
                }  else {
                    for (var data of wishlist_result){      
                        check_wishlist.push(data.name);
                    };
                    
                    for (var i = 0; i<8; i++) {
                        var check_main=check_wishlist.includes(main_result[i].name)
                        if ( check_main == true){
                            main_result[i].heart = 'ok';
                        } else {
                            main_result[i].heart = 'no';
                        }
                    }
    
                    for (var i = 0; i<4; i++) {
                        var check_pick=check_wishlist.includes(pick_result[i].name)
                        if ( check_pick == true){
                            pick_result[i].heart = 'ok';
                        } else {
                            pick_result[i].heart = 'no';
                        }
                    }
    
                }
                console.log('메인 최신 상품 : '+main_result)
                res.render('mainindex',{
                    main_data : main_result,
                    pick_data : pick_result,
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
    
            client.query(sql_main_products+sql_pick_products, function(error, results, field){
                var sql1_result=results[0];
                var sql2_result=results[1];
                console.log(replace_login_code[0].status)
                res.render('mainindex',{
                    main_data : sql1_result,
                    pick_data : sql2_result,
                    login_status : replace_login_code
                })
            })
        }
    })
    return route;
};