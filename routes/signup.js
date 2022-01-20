var express =require('express');
var route = express.Router();
var bodyParser=require('body-parser');
var crypto = require('crypto');
var nodemailer = require('nodemailer'); 
var ejs=require('ejs')

route.use(bodyParser.urlencoded({extended:false}));
route.use(bodyParser.json());

module.exports = function(client){
    route.get('/',function(req,res){
        res.render('signup');
    })

    route.post('/',function(req,res){
        var id=req.body.id;
        var pw = req.body.pw;
        var email=req.body.email;
        console.log(id,email,pw)
        var salt= crypto.randomBytes(64).toString('base64');
        crypto.pbkdf2(pw, salt, 99093, 64, 'sha512', (err, key) => {
            var hash=key.toString('base64');
            var user={
                authId :'local:'+id,
                login_id :id,
                email: email,
                password : hash,
                salt : salt,
            }
            console.log(user);
            var sql= 'INSERT INTO users (authId, login_id, email, password, salt) values(?, ?, ?, ?, ?)';
            client.query(sql,[user.authId, user.login_id, user.email, user.password, user.salt],function(err,result){
                if (err){
                    console.log(err);
                    res.status(500); 
                }else {
                        res.redirect('/views/login');
                }
            });
            
          });
    })
    // email 중복 체크
    route.post('/email_check',function(req,res){
        var email=req.body.email;  // 회원가입 창에서 중복 검사를 눌렀을때 입력한 id의 값을 넣는다.
        var resdata={};            // 클라이언트로 보낼정보를담는 딕셔너리다.
        resdata.email=email;       // "email: email"형태로 저장한다.
        console.log(resdata);

        var sql = "select email from users";   // db에서 users테이블의 email을 모두 검색한다. 
        client.query(sql,function(err,result){
            var user_list =[];             // db에 저장된 emil을 넣고 중복을 찾기 위해 배열을 만든다.
            for (var data of result){      // 배열안에 모든 유저 email을 넣는다.
                user_list.push(data.email);
            };     
            console.log(user_list);
            var overlap_check=user_list.includes(email)  // 배열안에 사용자가 입력한 email이 있는지 찾는다. 만약 있다면 true를 없다면 false가 저장된다.
            if (overlap_check != true){     // true가 아니면 배열안에 사용자가 입력한 email이 없는 것이기 때문에 사용가능하다는 메시지를 보낸다.
                resdata.check = "ok";
                resdata.message ="사용 가능한 이메일입니다.";
            }else {
                resdata.check="fail";      // true면 배열안에 사용자가입력한 email이 있기 때문에 사용중 이라고 메시지를 보낸다.
                resdata.message ="이미 사용중인 이메일입니다.";
            }
            console.log(resdata);
            res.json(resdata);          // 클라이언트로 JSOM형태의 데이터를보낸다.
        });
    });

    // id 중복검사
    route.post('/id_check',function(req,res){
        var id=req.body.id;  
        var resdata={};            // 클라이언트로 보낼정보를담는 딕셔너리다.
        resdata.id=id;       // 
        console.log(resdata);

        var sql = "select login_id from users";  
        client.query(sql,function(err,result){
            var user_id_list =[];             // db에 저장된 login_id을 넣고 중복을 찾기 위해 배열을 만든다.
            for (var data of result){      // 배열안에 모든 유저 login_id을 넣는다.
                user_id_list.push(data.login_id);
            };     
            console.log(user_id_list);
            var overlap_check=user_id_list.includes(id)  // 배열안에 사용자가 입력한 login_id이 있는지 찾는다. 만약 있다면 true를 없다면 false가 저장된다.
            if (overlap_check != true){     // true가 아니면 배열안에 사용자가 입력한 login_id이 없는 것이기 때문에 사용가능하다는 메시지를 보낸다.
                resdata.check = "ok";
                resdata.message ="사용 가능한 아이디 입니다.";
            }else {
                resdata.check="fail";      // true면 배열안에 사용자가입력한 login_id이 있기 때문에 사용중 이라고 메시지를 보낸다.
                resdata.message ="이미 사용중인 아이디 입니다.";
            }
            console.log(resdata);
            res.json(resdata);          // 클라이언트로 JSOM형태의 데이터를보낸다.
        });
    })

    // 이메일로 인증코드 보내기
    route.post('/email_auth',async(req, res) => {
        let authNum = Math.random().toString().substr(2,6);
        let emailTemplete;
        var resdata={};
        
        var new_email=req.body.email;


        ejs.renderFile('views/emailtest.ejs', {authCode : authNum}, function (err, data) {
            if(err){console.log('ejs.renderFile err')}
            emailTemplete = data;
        });

        const smtpTransport = nodemailer.createTransport({
            service: "Naver",
            auth: {
                user: "",
                pass: ""
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        const mailOptions = {
            from: '', //전송 이메일
            to: new_email,  //받는 이메일
            subject: 'nodemail test',  //메일 제목
            html : emailTemplete //이메일 내용을 html파일내용으로 씀.
        };
        
        // 실제 메일 전송되는 부분
        smtpTransport.sendMail(mailOptions, (error, info) =>{
            if(error){
                console.log(error)
                res.json(resdata);
            }else{
                resdata.number=authNum;
                res.json(resdata);
            }
            smtpTransport.close();
        });
    })
    return route;
}