var express =require('express');
var route = express.Router();
var nodemailer = require('nodemailer'); 
var ejs=require('ejs')
var bodyParser=require('body-parser');
var crypto = require('crypto');

route.use(bodyParser.urlencoded({extended:false}));
route.use(bodyParser.json());

module.exports = function(client){
    route.get('/',function(req,res) {
        replace_login_code = [{
            'logout' : `<li><a href="/views/login">로그인</a></li>`,
            'user_info' : `<li><a href="/views/signup">회원가입</a></li>`,
            'status' : 'no'
        }];
        res.render('find_pw',{
            login_status : replace_login_code
        });
    })

    // 비밀 번호 찾기 pw 변경 라우터 
    route.post('/',function(req,res){
        var id=req.body.id;
        var new_pw=req.body.new_pw;
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
                    res.redirect('/views/login');
                }
            });
        });
    })

    // id 조회 ajax 라우터
    route.post('/find_info_id_check',function(req,res){
        var id= req.body.id;
        var resdata={};
        resdata.id=id;       // "email: email"형태로 저장한다.
        console.log(resdata);

        var sql = 'select login_id from users';
        client.query(sql, function(_err,result){
            function find_id(element)  {
            if(element.login_id === id) return true;
                }
            var user_id_index=result.findIndex(find_id)
            if (user_id_index == -1) {
                resdata.check="fail";
                res.json(resdata);
            } else if (user_id_index >-1) {
                resdata.check="ok";
                res.json(resdata);
            }
        })
    }) 
    // pw 찾을 때 사용하는 라우터 (이메일 인증 코드 전송) 
    route.post('/find_info_email_check',function(req,res){
        var id = req.body.user_id;
        var email=req.body.user_email;  
        var resdata={};            
        resdata.email=email;      
        console.log(resdata);

        var sql = 'select email from users where login_id = ?';
        client.query(sql,[id], function(_err,result){
        
            if (result[0].email != email) {
                resdata.check="fail";
                resdata.msg="아이디에 등록된 이메일이 아닙니다. 이메일을 확인해 주세요";
                res.json(resdata);
            } else {
                resdata.check="ok";
                resdata.msg="이메일로 인증코드를 받아주세요!";
                res.json(resdata);
                }
        });
    })

    return route;
}