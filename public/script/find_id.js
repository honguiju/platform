var email_auth_check =false;
var user_email = '';
var authnum=68751219687415;   // 초기값을 정할게 필요함. 인증번호를 보낼 때 db에 저장을 해야하는지 모르겠음. 
var getCheck=/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;  

    function email_check() {
        if (!getCheck.test($("#user_email").val())) {
            $(".overlap_message").text("이메일을 형식에 맞게 입력해주세요") 
            $(".overlap_message").css('color','red')
            return false
        } else{
            var email = $('input[name=email]').val();  
            $.ajax({                            
                url : "/views/find_id/find_info_email_check",       
                type : "post",         
                dataType : "JSON",
                data : {"email" : email}
            })

            .done(function (json){
                if (json.check =='ok'){
                    // 인증번호 받기 버튼 활성화
                    user_email= email
                    $(".overlap_message").text("이메일로 인증코드를 받아주세요!")
                    $(".overlap_message").css('color','green')
                } else {
                    $(".overlap_message").text("등록되지 않은 이메일입니다.")
                    $(".overlap_message").css('color','red')
                }
            })
            .fail(function (xhr, status, errorThrown){  
                console.log(errorThrown) 
                alert("Ajax failed")
                });
        }
    }

    function send_mail(){   

         if (user_email !=''){
            var email = user_email;  
            $.ajax({                            
                url : "/views/signup/email_auth",       
                type : "post",                  
                dataType : "JSON",             
                data : {"email" : email}        
            })


            .done(function (json){
                $("#send_mail_btn").replaceWith('<input type="button" id="check_number" value="인증완료" onclick="auth_number_check()"/>')
                $(".overlap_message").after('<span class="box int_email_2"><input type="text" id="auth_email" class="auth_email_box" maxlength="10" placeholder="인증번호 입력"><input type="button" id="re_send_btn" value="재전송" onclick="re_send_email()"><span id="ViewTimer"></span></span><span class="message_box send_auth_mail_check_message"></span>')
                $(".send_auth_mail_check_message").text("이메일을 전송했습니다! 인증번호를 확인해주세요.")
                $(".send_auth_mail_check_message").css('color','green')
                
                authnum=json.number;
                timer_start=auth_email_timer()
            })
            .fail(function (xhr, status, errorThrown){  
                console.log(errorThrown) 
                alert("Ajax failed")
                });
        } else {
            $(".overlap_message").text("이메일 확인을 해주세요.")
            $(".overlap_message").css('color','red')
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
        $("#auth_email").css('background','white') 
        var email = $('input[name=email]').val();  
        $.ajax({                            
            url : "/views/find_id",       
            type : "post",                  
            dataType : "JSON",             
            data : {"email" : email}        
        })
        .done(function (json){
            if (json.check == "ok") {
                alert("메일로 아이디가 전송되었습니다.")
            } else {
                alert("등록된 아이디가 없습니다.")
            }
            
        })
        .fail(function (xhr, status, errorThrown){  
            console.log(errorThrown) 
            alert("Ajax failed")
            });
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

// function find_ID() {   
//     if (email_auth_check == false) {
//         $(".send_auth_mail_check_message").text("이메일 인증을 하지 않았습니다.")
//         $(".send_auth_mail_check_message").css('color','red') 
//         $("#auth_email").focus()
//     } else if (email_auth_check == true) {
//         var email = user_email;  
//         $.ajax({                            
//             url : "/find_id",       
//             type : "post",                  
//             dataType : "JSON",             
//             data : {"email" : email}        
//         })


//         .done(function (json){
//             if (json.check == "ok") {
//                 alert("메일로 아이디가 전송되었습니다.")
//             } else {
//                 alert("등록된 아이디가 없습니다.")
//             }
            
//         })
//         .fail(function (xhr, status, errorThrown){  
//             console.log(errorThrown) 
//             alert("Ajax failed")
//             });
//     } 
// }