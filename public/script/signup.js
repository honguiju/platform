var email_overlap_check = false;
var id_overlap_check = false;
var password_check = false;
var password_2_check = false;
var email_auth_check= false;
var re_start_timer = false;
var user_email='';
var authnum=68751219687415;   // 초기값을 정할게 필요함. 인증번호를 보낼 때 db에 저장을 해야하는지 모르겠음. 

$(document).ready(function(){


    $('#signup_id').keyup(function(){

    //영문, 숫자만 가능하며 2-10자리 가능.
    var nameCheck=RegExp(/^[A-Za-z]{1}[A-Za-z0-9]{3,19}$/); //4~20자리 영(대, 소) , 숫자  첫글자는 숫자 사용불가

    if($("#signup_id").val() == ""){
        $("#signup_id").css('border','1px solid red') 
        $("#signup_id").css('background','white')        
        $(".id_check_message").text('영문, 숫자만 가능하며 3~19자리로 입력해주세요.(첫글자 숫자 사용불가)') 
        $(".id_check_message").css('color','red') 
        id_overlap_check = false;
    }  else if (!nameCheck.test($("#signup_id").val())){
        $("#signup_id").css('border','1px solid red')
        $("#signup_id").css('background','white') 
        $(".id_check_message").text('영문, 숫자만 가능하며 3~19자리로 입력해주세요.(첫글자 숫자 사용불가)') 
        $(".id_check_message").css('color','red') 
        id_overlap_check = false;
    } else {
        var id = $('input[name=id]').val();  
        $.ajax({                            
            url : "/views/signup/id_check",       
            type : "post",                  
            dataType : "JSON",             
            data : {"id" : id}        
        })

        .done(function (json){          
            if (json.check ==="ok") {
                $("#signup_id").css('border','1px solid green') 
                $("#signup_id").css('background','white')  
                $(".id_check_message").text(json.message) 
                $(".id_check_message").css('color','green') 
                id_overlap_check = true;
            } else{
                $("#signup_id").css('border','1px solid red')
                $("#signup_id").css('background','white')               
                $(".id_check_message").text(json.message)
                $(".id_check_message").css('color','red') 
                id_overlap_check = false;
            }
        })
        .fail(function (xhr, status, errorThrown){  
            console.log(errorThrown) 
            alert("Ajax failed")
            })
    }

    })
    //email 중복 체크
    $('#signup_email').keyup(function(){
        var getCheck=/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;  
        if($("#signup_email").val() == ""){ 
            $("#signup_email").css('border','1px solid red')
            $("#signup_email").css('background','white')              
            $(".overlap_message").text("email을 입력해 주세요")
            $(".overlap_message").css('color','red')   
            email_overlap_check = false;
        } else if(!getCheck.test($("#signup_email").val())){
            $("#signup_email").css('border','1px solid red')
            $("#signup_email").css('background','white')      
            $(".overlap_message").text("email형식에 맞게 입력해 주세요")
            $(".overlap_message").css('color','red') 
            email_overlap_check = false;   
        }else {                                
            var email = $('input[name=email]').val();  
            $.ajax({                            
                url : "/views/signup/email_check",       
                type : "post",                  
                dataType : "JSON",             
                data : {"email" : email}        
            })

            .done(function (json){          
                if (json.check ==="ok") {
                    $("#signup_email").css('border','1px solid green')  
                    $("#signup_email").css('background','white')    
                    $(".overlap_message").text(json.message) 
                    $(".overlap_message").css('color','green') 
                    user_email=email;
                    email_overlap_check=true;       
                } else{
                    $("#signup_email").css('border','1px solid red')  
                    $("#signup_email").css('background','white') 
                    $(".overlap_message").text(json.message)
                    $(".overlap_message").css('color','red') 
                    email_overlap_check=false; 
                }
            })
            .fail(function (xhr, status, errorThrown){  
                console.log(errorThrown) 
                alert("Ajax failed")
                })
            }
    })

    // 비밀번호 정규식 검사.

    $('#signup_pw').keyup(function(){

        //최소 8 자,최대 14자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
        var getCheck= RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,14}$/);

        if($("#signup_pw").val() == ""){          // 비밀번호 입력란이 공백이라면 알림창이 뜬다.
            $("#signup_pw").css('border','1px solid red')
            $("#signup_pw").css('background','white')      
            $(".pw_check_message").text('8~14자, 영어, 숫자, 특수 문자를 포함하게 입력해주세요.') 
            $(".pw_check_message").css('color','red') 
            password_check = false;
        } else if($("#signup_email").val() == $("#signup_pw").val()){
            $("#signup_pw").css('border','1px solid red')
            $("#signup_pw").css('background','white') 
            $(".pw_check_message").text('비밀번호와 아디가 같을 수 없습니다.') 
            $(".pw_check_message").css('color','red') 
            password_check = false;
        } else if(!getCheck.test($("#signup_pw").val())){
            $("#signup_pw").css('border','1px solid red') 
            $("#signup_pw").css('background','white')  
            $(".pw_check_message").text('8~14자, 영어, 숫자, 특수 문자를 포함하게 입력해주세요.') 
            $(".pw_check_message").css('color','red') 
            password_check = false;
        } else {
            $("#signup_pw").css('border','1px solid green') 
            $("#signup_pw").css('background','white') 
            $(".pw_check_message").text('사용가능한 비밀번호 입니다.') 
            $(".pw_check_message").css('color','green') 
            password_check =true;
        }
        
    })

    
    $('#signup_pw_check').keyup(function(){
        if (password_check === true){
            if($("#signup_pw_check").val() == ""){   // 비밀번호 확인 란이 공백이라면 알림이 뜬다.
            $("#signup_pw_check").css('border','1px solid red')
            $("#signup_pw_check").css('background','white') 
            $(".pw_check_2_message").text('입력한 비밀번호를 한번 더 입력해 주세요.') 
            $(".pw_check_2_message").css('color','red') 
            password_2_check = false;
            } else if ($("#signup_pw").val() == $("#signup_pw_check").val()) {
                $("#signup_pw_check").css('border','1px solid green')
                $("#signup_pw_check").css('background','white') 
                $(".pw_check_2_message").text('비밀번호가 일치합니다.') 
                $(".pw_check_2_message").css('color','green') 
                password_2_check = true;
            } else {
                $("#signup_pw_check").css('border','1px solid red')
                $("#signup_pw_check").css('background','white') 
                $(".pw_check_2_message").text('입력한 비밀번호가 일치하지 않습니다.') 
                $(".pw_check_2_message").css('color','red')
                password_2_check = false;
            }
        } else {
            $("#signup_pw_check").css('border','1px solid red')
            $("#signup_pw_check").css('background','white') 
            $(".pw_check_2_message").text('비밀번호를 확인해주세요 ') 
            $(".pw_check_2_message").css('color','red') 
        }
        
    })


})

    function send_check_mail(){   
        if (email_overlap_check == false) {
            $(".send_auth_mail_check_message").text("이메일을 확인해 주세요") 
            $(".send_auth_mail_check_message").css('color','red')
            return false
        }else {
            var email = user_email;  
            $.ajax({                            
                url : "/views/signup/email_auth",       
                type : "post",                  
                dataType : "JSON",             
                data : {"email" : email}        
            })


            .done(function (json){
                $("#send_email").replaceWith(' <input type="button" id="re_send_btn" value="재전송" onclick="re_send_email()">');
                $(".send_auth_mail_check_message").text("이메일을 전송했습니다! 인증번호를 확인해주세요.")
                $(".send_auth_mail_check_message").css('color','green')
                authnum=json.number;
                timer_start=auth_email_timer()
            })
            .fail(function (xhr, status, errorThrown){  
                console.log(errorThrown) 
                alert("Ajax failed")
                });
        }
    };

function re_send_email() {
    re_start_timer = true;
    var email = user_email;  
            $.ajax({                            
                url : "/views/signup/email_auth",       
                type : "post",                  
                dataType : "JSON",             
                data : {"email" : email}
            })


            .done(function (json){
                $(".send_auth_mail_check_message").text("이메일을 재전송했습니다!")
                authnum=json.number;
                timer_start=auth_email_timer();
            })
            .fail(function (xhr, status, errorThrown){  
                console.log(errorThrown) 
                alert("Ajax failed")
                });
}

function auth_number_check () {
    if (authnum == $("#auth_email").val()) {
        email_auth_check =true;
        $("#auth_email").css('border','1px solid green') 
        $("#check_number").attr("disabled",true)
        $("#signup_email").attr("readonly",true)
        $("#re_send_btn").attr("disabled",true)
        $("#check_number").css("cursor","Default")
        $("#check_number").css("background-color","green")
        $("#re_send_btn").css("cursor","Default")
        $("#re_send_btn").css("background-color","green")
        $(".send_auth_mail_check_message").text("인증에 성공했습니다.") 
        $(".send_auth_mail_check_message").css('color','green') 
    } else {
        email_auth_check =false;
        $("#auth_email").css('border','1px solid red')
        $("#auth_email").css('background','white') 
        $(".send_auth_mail_check_message").text("인증번호가 맞지 않습니다.") 
        $(".send_auth_mail_check_message").css('color','red') 
    }
}

// 인증 만료 타이머
function auth_email_timer() {
    var SetTime = 300;

    var tid=setInterval(function(){
           
               // 1초씩 카운트      
            m = parseInt(SetTime / 60);
            s = parseInt(SetTime % 60);
            time= m+" : "+s;  // 남은 시간 계산         
            var msg = "<font color='red'>" + time + "</font>";  
            $("#ViewTimer").html(msg);     // div 영역에 보여줌                  
            SetTime=SetTime-1;                  // 1초씩 감소
            if (SetTime < 0) {          // 시간이 종료 되었으면..        
                clearInterval(tid);     // 타이머 해제
                authnum=68751219687415;  // 저장되어 있던 인증번호를 바꾸던지 삭제해야함.
            } else if (email_auth_check == true) {
                clearInterval(tid);
                $("#ViewTimer").html('')

            } else if (re_start_timer === true) {
                clearInterval(tid);
                re_start_timer = false;
            }
        },1000); 
}

//회원가입시 입력하는 값을 jquery 정규식 유효성 검사를 진행한다.
function final_chek() {

    if ( email_overlap_check == true && id_overlap_check == true && password_check == true && password_2_check == true && email_auth_check == true) {
        alert("회원가입에 성공했습니다.")
        return true;
    } else if (id_overlap_check == false) {
        alert("아이디를 확인해주세요")
        return false;
    } else if (email_overlap_check == false) {
        alert("이메일을 확인해주세요")
        return false;
    }  else if (email_auth_check == false) {
        alert("이메일 인증을 해주세요.")
        return false;
    }  else if (password_check == false) {
        alert("비밀번호를 확인해주세요")
        return false;
    }  else if (password_2_check == false) {
        alert("비밀번호 체크를 확인해주세요")
        return false;
    }
    

}