var express =require('express');
var route = express.Router();

module.exports = function(client){
    route.get('/',function(req,res) {
        var categori=req.query.categori;
        var pageNum=req.query.page;
        var pageNum_product =pageNum
        var page_btn_num=parseInt(pageNum);
        console.log(categori, pageNum);
        
        var categoriNum="'__"+categori+"%'";
        if (!pageNum) {
            pageNum_product= 0;
        } else {
            pageNum_product=(pageNum_product-1)*15;
        }
        var sql_categori ="select * from products WHERE product_id LIKE "+categoriNum +"ORDER BY id DESC LIMIT "+pageNum_product+",15;"
        var sql_products ="select * from products where product_id like "+categoriNum

        if (req.user && req.user.login_id){
            var replace_login_code = [{
                'logout' : `<li><a href="/views/login/logout">로그아웃</a></li>`,
                'user_info' : `<li><a href="/views/mypage">마이페이지</a></li>`,
                // 'Service_center' :`<li><a href="/views/service_center">고객센터</a></li>`,
                'status' : 'ok'
            }];
            var login_id=req.user.login_id;
            var sql_wishlist= "select * from wishlist where login_id = ?;";
            var check_wishlist=[]
            
            
            client.query(sql_categori+sql_wishlist+sql_products,login_id,function(err,results,field){
                var store_result =results[0];
                var wishlist_result= results[1];
                var all_product= results[2]
                var product_count=all_product.length
                var max_page= parseInt(product_count / 15)
                var last_page_products= product_count % 15
                console.log(store_result)
                console.log(last_page_products)
                if (parseInt(product_count %15) !=0 ){
                    max_page+=1;
                    if (!wishlist_result){
                        if (pageNum == max_page){
                            for (var i =0; i <last_page_products; i++){
                                store_result[i].heart = 'no';
                            }
                        } else {
                            for (var i =0; i <15; i++){
                                store_result[i].heart = 'no';
                            }
                        }     
                    } else {    
                        for (var data of wishlist_result){      
                            check_wishlist.push(data.name);
                        };
                        if (pageNum == max_page){
                            console.log('마지막페이지')
                            for (var i = 0; i<last_page_products; i++) {
                                var check_main=check_wishlist.includes(store_result[i].name)
                                if ( check_main == true){
                                    store_result[i].heart = 'ok';
                                } else {
                                    store_result[i].heart = 'no';
                                }
                            }
                        } else {
                            for (var i = 0; i<15; i++) {
                                var check_main=check_wishlist.includes(store_result[i].name)
                                if ( check_main == true){
                                    store_result[i].heart = 'ok';
                                } else {
                                    store_result[i].heart = 'no';
                                }
                            }
                        }
                    
                    }
                } else {
                    if (!wishlist_result){
                        for (var i =0; i <15; i++){
                            store_result[i].heart = 'no';
                        }
                    } else {    
                        for (var data of wishlist_result){      
                            check_wishlist.push(data.name);
                        };
                        for (var i = 0; i<15; i++) {
                            var check_main=check_wishlist.includes(store_result[i].name)
                            if ( check_main == true){
                                store_result[i].heart = 'ok';
                            } else {
                                store_result[i].heart = 'no';
                            }
                        }
                    
                    }
                }   
                    res.render('store',{
                        store_data: store_result,
                        login_status : replace_login_code,
                        categori_code: categori,
                        max_page : max_page,
                        page_num : page_btn_num,
                        last_products : last_page_products
                    })
                })
        }else {
            replace_login_code = [{
                'logout' : `<li><a href="/views/login">로그인</a></li>`,
                'user_info' : `<li><a href="/views/signup">회원가입</a></li>`,
                // 'Service_center' :`<li><a href="/views/service_center"">고객센터</a></li>`,
                'status' : 'no'
            }];

            client.query(sql_categori+sql_products,function(err,results){
                var store_result =results[0];
                var all_product= results[1]
                var product_count=all_product.length
                console.log(product_count)
                var max_page= parseInt(product_count / 15)
                var last_page_products= product_count % 15

                if (parseInt(product_count %15) !=0 ){
                    max_page+=1;
                }

                res.render('store',{
                    store_data: store_result,
                    login_status : replace_login_code,
                    categori_code: categori,
                    max_page : max_page,
                    page_num : page_btn_num,
                    last_products : last_page_products
                })
            })
        }
    })
    return route;
}