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
var login = require('./routes/login')(client,passport,LocalStrategy);
app.use('/views/login',login);

/////////////////////////////////////////////////////////////////////////////////////