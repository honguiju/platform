var express =require('express');
var route = express.Router();
var nodemailer = require('nodemailer'); 
var ejs=require('ejs')
var bodyParser=require('body-parser');

route.use(bodyParser.urlencoded({extended:false}));
route.use(bodyParser.json());

module.exports = function(client){
    route.get('/',function(req,res) {
        replace_login_code = [{
            'logout' : `<li><a href="/views/login">로그인</a></li>`,
            'user_info' : `<li><a href="/views/signup">회원가입</a></li>`,
            'status' : 'no'
        }];
        res.render('find_id',{
            login_status : replace_login_code
        });
    })
    route.post('/',function(req,res){
        var email=req.body.email;                 //검색할 이메일을 저장한다.
        var feedback={};                        //결과 (있다,없다)를 담을 변수를 설정한다.
        var id='';
        var sql = 'select * from users';    
        client.query(sql, function(_err,result){           //전체 유저를 검색한다.

            function find_email(element)  {              // (callback) 부분 함수.
                if(element.email === email) return true;  // element.email에  email 정보가 있다면 true를 반환한다.
                }
                                                                //.findIndex(callback) ==> 원하는  정보의 인덱스정보를 찾아준다.
            var user_info_index= result.findIndex(find_email)   // 만약있다면  인덱스정보를 반환하고, 없다면 -1이 나온다.
            if (user_info_index == -1) {              // 인데스 정보가  -1(원하는 정보가 없다)이면 종료.
                feedback.check= "no";
                res.json(feedback);
            }  else if (user_info_index >-1) {     
                id= result[user_info_index].login_id;   // id 변수에 검색한 데이터에서 인덱스정보를 활용해서 id값을 찾아서 넣는다.
                console.log(id)
                feedback.check="ok";
                let emailTemplete;              
                var new_email=req.body.email;           // 이메일을 보내기위해 변수에 저장한다.


                ejs.renderFile('views/user_id_info.ejs', {userid : id}, function (err, data) {  // 만들어둔 탬플릿에 id정보를 넣고 emailTemplete변수에 저장한다.
                    if(err){console.log('ejs.renderFile err')}
                    emailTemplete = data;
                });

                const smtpTransport = nodemailer.createTransport({  //  메일을 보낼 수 있는 계정을 작성한다.
                    service: "Naver",               //네이버 메일을 사용한다.
                    auth: {
                        user: "",     // 네이버 메일
                        pass: ""                // 네이버 계정 비밀번호
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
                        res.json(feedback);               // feedback 정보를 내려준다.
                        res.redirect('/');
                    }else{
                        res.json(feedback);              // feedback 정보를 내려준다.
                        res.redirect('/');
                    }
                    smtpTransport.close();
                });
                
            }
        })
    })
    // 등록되어 있는 이메일인지 확인하는 라우터
    route.post('/find_info_email_check',function(req,res){
        var email=req.body.email;  
        var resdata={};            
        resdata.email=email;      
        console.log(resdata);

        var sql = 'select email from users'
        client.query(sql, function(_err,result){
            function find_email(element)  {
            if(element.email === email) return true;
                }
            var user_email_index=result.findIndex(find_email)
            if (user_email_index == -1) {
                resdata.check="fail";
                res.json(resdata);
            } else if (user_email_index >-1) {
                resdata.check="ok";
                res.json(resdata);
            }
            
        })
    });
    return route;
}
