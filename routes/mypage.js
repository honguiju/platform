var express =require('express');
var route = express.Router();

module.exports = function(client){
    route.get('/',function(req,res){
        if (req.user && req.user.login_id) {
            var sql_user = 'select * from users where login_id = ?;'
            var sql_wishlist = 'select * from wishlist where login_id = ?;'
            var user_id= req.user.login_id;
            var replace_login_code = [{
                'logout' : `<li><a href="/views/login/logout">로그아웃</a></li>`,
                'user_info' : `<li><a href="/views/mypage">마이페이지</a></li>`,
                'status' : 'ok'
            }];
        
            client.query(sql_user+sql_wishlist,[user_id,user_id],function(err,results){
                var user_result =results[0];
                var wishlist_result= results[1];
                console.log(wishlist_result)
                console.log(user_result)
                res.render('mypage',{
                    user_info : user_result,
                    wishlist_data : wishlist_result,
                    login_status : replace_login_code
                })
            })
        } else {
            alert('세션이 만료되었습니다. 로그인을 다시 해주세요')
            res.redirect('/')
        }   
    })
    // id 변경하기 라우터 
    route.get('/mypage_change_id',function(req,res){
        if (req.user && req.user.login_id) {
            var replace_login_code = [{
                'logout' : `<li><a href="/views/logout">로그아웃</a></li>`,
                'user_info' : `<li><a href="/views/mypage">마이페이지</a></li>`,
                'status' : 'ok'
            }];

            res.render('mypage_change_id',{
                login_status : replace_login_code
            })
        } else {
            alert('세션이 만료되었습니다. 로그인을 다시 해주세요')
            res.redirect('/')
        }
    })
    //아이디 변경 본인인증 이메일 확인 라우터
    route.post('/chagne_id_email_check',function(req,res){
        if (req.user && req.user.login_id){
            var email=req.body.email;  
            var resdata={};
            var login_id = req.user.login_id; 
            resdata.email=email;
            console.log(resdata);

            var sql = 'select email,login_id from users'
            client.query(sql, function(_err,result){
                function find_email(element)  {
                if(element.email === email) return true;
                    }
                var user_email_index=result.findIndex(find_email)
                if (user_email_index == -1) {
                    resdata.check="fail";
                    res.json(resdata);
                } else if (user_email_index >-1) {
                    if (login_id == result[user_email_index].login_id){
                        resdata.check="ok";
                        res.json(resdata);
                    } else{
                        resdata.check="fail";
                        res.json(resdata);
                    }
                    
                }
            })
        }  else {
            alert('세션이 만료되었습니다. 로그인을 다시 해주세요')
            res.redirect('/')
        }
    })

    // 아이디 수정 라우터
    route.post('/mypage_change_id',function(req,res){
        if (req.user && req.user.login_id){
            var new_id= req.body.new_id;
            var login_id = req.user.login_id;
            var sql = 'UPDATE users SET login_id = ? WHERE login_id = ?'
        
            client.query(sql,[new_id,login_id],function(err,result){
                if (err){
                    console.log(err);
                    res.status(500); 
                }else {
                    res.redirect('/');
                }
            })
        } else {
            alert('세션이 만료되었습니다. 로그인을 다시 해주세요')
            res.redirect('/')
        }
    
    })

    // pw 변경 라우터 
    // 새롭게 설정한 pw를 암호화해서 유저 정보를  수정한다.
    route.get('/mypage_change_pw',function(req,res){
        if (req.user && req.user.login_id) {
            var replace_login_code = [{
                'logout' : `<li><a href="/views/logout">로그아웃</a></li>`,
                'user_info' : `<li><a href="/views/mypage">마이페이지</a></li>`,
                'status' : 'ok'
            }];

            res.render('mypage_change_pw',{
                login_status : replace_login_code
            })
        } else {
            alert('세션이 만료되었습니다. 로그인을 다시 해주세요')
            res.redirect('/')
        }
    })
    // 비밀번호 수정 라우터
    route.post('/mypage_change_pw',function(req,res){
        var id=req.user.login_id;             
        var new_pw=req.body.pw;
        console.log(new_pw)
        var salt= crypto.randomBytes(64).toString('base64');
        crypto.pbkdf2(new_pw, salt, 99093, 64, 'sha512', (err, key) => {
            var hash=key.toString('base64');
            var user={
                id : id,
                password : hash,
                salt : salt
            }
            console.log(user);
            var sql= 'UPDATE users SET password = ?, salt= ? WHERE login_id = ?';
            client.query(sql,[user.password, user.salt, user.id],function(err,result){
                if (err){
                    console.log(err);
                    res.status(500); 
                }else {
                    res.redirect('/');     // 변경 완료 후 어디로 보낼지 수정해야함.
                }
            });
        });
    })
    return route;
}