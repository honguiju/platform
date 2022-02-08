var fs =require('fs');
var express= require('express');
var ejs=require('ejs')
var mysql=require('mysql'); 
var bodyParser=require('body-parser');
var session= require('express-session');              
var MySQLStore = require('express-mysql-session')(session);  
var nodemailer = require('nodemailer');                   
var crypto = require('crypto');                           
var flash = require('connect-flash');                     
var passport = require('passport')                      
  , LocalStrategy = require('passport-local').Strategy;    

var path=require('path');
const { connect } = require('http2');

var app= express()
                    
try {
    var client = mysql.createConnection({   //데이터 베이스 설정.
        host: '',         // 호스트 설정
        port: 1234,      // 포트 설정(자신이 사용하는 데이터베이스의 포트번호)
        user:'',     // 유저 설정
        password:'', // 비밀번호 설정
        database : '', // 데이터베이스 이름
        multipleStatements: true // 다중쿼리를 사용하기 위해 TRUE로 설정
    });
}catch(e){
    console.log(e.name);
    console.log(e.message);
}
client.connect((err) => {
    if(err) throw err;
    console.log('Connetcted!!!');
});     

app.use(express.static(path.join(__dirname, '/public')));    // 정적파일인 css,js 파일 접근을 위해 설정함. 
app.set('views', __dirname + '/views');                      // view엔진 설정.
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({                           // 세션 설정 --> 로그인시 데이터베이스에 저장됨.
    secret:'',            //★★★ 노출시 위험.  ★★★
    resave: false,  //resave 세션아이디를 접속할때마다 발급하지 않는다
    saveUninitialized: true,
    store: new MySQLStore({ 
        host: '',         // 호스트 설정
        port: 1234,      // 포트 설정(자신이 사용하는 데이터베이스의 포트번호)
        user:'',     // 유저 설정
        password:'', // 비밀번호 설정
        database : '', // 데이터베이스 이름
    })
}));
app.use(flash());               //로그인시 실패 메시지 때문에 1회성 메시지 사용
app.use(passport.initialize());
app.use(passport.session());


app.listen(80,function(){
    console.log("Connected 80 port");
})

//////////////////////////// 메인 페이지 라우터/////////////////////////////////////
//main 라우터
var main = require('./routes/main')(client);
app.use('/',main);

// pick ajax 라우터
var pick = require('./routes/pick')(client);
app.use('/pick',pick);

// 더보기 ajax 처리 라우터
var pageing = require('./routes/pageing')(client);
app.use('/more_product',pageing);

// 찜하기 ajax 처리 라우터 
var wishlist = require('./routes/wishlist')(client);
app.use('/wishlist',wishlist);

///////////////////////////////////////////////////////////////////////////////////



//////////////////////////// 스토어  라우터 ///////////////////////////////////////
// 스토어 라우터  
var store = require('./routes/store')(client);
app.use('/views/store',store);

///////////////////////////////////////////////////////////////////////////////////



//////////////////////////// 상세 페이지 라우터/////////////////////////////////////
// 상세 페이지 라우터
var detail = require('./routes/detail')(client);
app.use('/detail',detail);

///////////////////////////////////////////////////////////////////////////////////



///////////////////////////// 검색 라우터 ////////////////////////////////////////// 
// 검색 라우터 
var search = require('./routes/search')(client);
app.use('/views/search',search);

////////////////////////////////////////////////////////////////////////////////////



///////////////////////////// 회원가입 라우터 ////////////////////////////////////////
var signup = require('./routes/signup')(client);
app.use('/views/signup',signup);

/////////////////////////////////////////////////////////////////////////////////////




////////////////////////// id 찾기 라우터 ////////////////////////////////////////////
// 아이디 찾기 라우터
var find_id = require('./routes/find_id')(client);
app.use('/views/find_id',find_id);


/////////////////////////////////////////////////////////////////////////////////////



//////////////////////////// pw 찾기 라우터 /////////////////////////////////////////
// 아이디 찾기 라우터
var find_pw = require('./routes/find_pw')(client);
app.use('/views/find_pw',find_pw);

/////////////////////////////////////////////////////////////////////////////////////



//////////////////////////// 마이페이지 라우터 ///////////////////////////////////////
// 마이페이지 라우터 
var mypage = require('./routes/mypage')(client);
app.use('/views/mypage',mypage);

/////////////////////////////////////////////////////////////////////////////////////

///////////////////////////// 로그인 라우터 ////////////////////////////////////////
app.get('/views/login',function(req,res){
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
app.post('/views/login',
  passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/views/login',
        failureFlash: true 
    })
);

// 로그아웃 라우터
app.get('/views/logout',function(req,res){
    req.logout();
    req.session.save(function(){
        res.redirect('/');
    });
});

/////////////////////////////////////////////////////////////////////////////////////