var express =require('express');
var route = express.Router();
var flash = require('connect-flash');   
var session= require('express-session');
var passport = require('passport')                       //로그인 구성 모듈
  , LocalStrategy = require('passport-local').Strategy;    // 여기까지
var MySQLStore = require('express-mysql-session')(session);  // 데이터베이스 세션으로 로그인상태 체크
var crypto = require('crypto'); 


module.exports = function(client){
    route.use(session({                           // 세션 설정 --> 로그인시 데이터베이스에 저장됨.
        secret:'secret key@1458',            //★★★ 이놈 처리 잘해야함. 노출시 위험. 처리하는거 찾아봐야함 ★★★
        resave: false,  //resave 세션아이디를 접속할때마다 발급하지 않는다
        saveUninitialized: true,
        store: new MySQLStore({
            host: 'localhost',
            port: 3333,
            user: 'root',
            password: '1458',
            database: 'hin'
        })
    }));
    route.use(flash());               //로그인시 실패 메시지 때문에 1회성 메시지 사용
    route.use(passport.initialize());
    route.use(passport.session());
    
    
    route.get('/',function(req,res){
        var fmsg=req.flash();
        var feedback='';
        if (fmsg.error){
            feedback=fmsg.error[0];
        }
        console.log(fmsg);
        res.render('login',{
            feedbackmsg : feedback
        })
    })
    // passport 설정
    passport.serializeUser(function (user,done){
        done(null,user.authId);
    });
    passport.deserializeUser(function(id,done) {
        var sql ='select * from users where authId=?'
        client.query(sql, [id], function (err, results){
            if (err){
                done('There is no user');
            } else {
                done(null, results[0]);
            }
        });
    });
    // 로그인 성공, 실패 설정
passport.use(new LocalStrategy(
    {
        usernameField : 'id',
        passwordField : 'pw'

    },
    function(username, password, done) {
        var uname=username; 
        var pwd=password;
        console.log(uname,pwd);
        var sql = 'select * from users;';
        var sql_session_check = 'select data from sessions;'
        client.query(sql+sql_session_check, function(_err,result){
            var sql1=result[0]
            var sql2=result[1]
            if (_err){
                return done(null,false);
            } else {
                if (sql1.length ===0 ){
                    done(null,false,{ message: '등록된 회원이 1명도 없음. 그래서 쿼리문에서 에러가 남.' });
                } else{
                    console.log(sql2)
                    var sql2_data=[]
                    var online_user=[]
                    for (var i =0; i <sql2.length; i++){
                        sql2_data.push(sql2[i].data)
                    }
                    for (var i =0; i <sql2_data.length; i++){
                        online_user.push(sql2_data[i].passport)
                    }
                    console.log(online_user)

                    function find_online_users(element)  {
                         if(element.user === "local:"+uname) return true;
                    }
            
                    function find_id(element)  {
                        if(element.login_id === uname) return true;
                    }
                    var online_user_id_index=sql2.findIndex(find_online_users)
                    var user_login_id_index= sql1.findIndex(find_id)
                    if (user_login_id_index == -1) {
                        done(null,false,{ message: '등록되지 않은 아이디 입니다.' });
                    }  else if (user_login_id_index >-1) {
                        var user = sql1[user_login_id_index]
                        crypto.pbkdf2(pwd, user.salt, 99093, 64, 'sha512', (_err, key) => {
                            var hash=key.toString('base64');
                            if (hash === user.password) {
                                if (online_user_id_index== -1){
                                    done(null,user);
                                } else{
                                    //현재 사용자를 로그아웃 시키고 로그인.
                                    done(null,user);
                                }
                               
                            } else {
                                done(null,false,{ message: '비밀번호를 확인해 주세요.' });
                            }
                        });
                    }  
                }
            };
    
        })
    }
));
    // 로그인 라우터
    route.post('/',
    passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/views/login',
            failureFlash: true 
        })
    );
    // 로그아웃 라우터
    route.get('/logout',function(req,res){
        req.logout();
        req.session.save(function(){
            res.redirect('/');
        });
    });
    return route;
}
