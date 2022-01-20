var password_2_check = false;
var password_check = false;
var email_auth_check =false;
var user_email = '';
var user_id= '';
var authnum=68751219687415;   // 초기값을 정할게 필요함. 인증번호를 보낼 때 db에 저장을 해야하는지 모르겠음. 
var getCheck=/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;  
var nameCheck=RegExp(/^[A-Za-z]{1}[A-Za-z0-9]{3,19}$/); //4~20자리 영(대, 소) , 숫자  첫글자는 숫자 사용불가

         // 비밀번호 정규식 검사.

         function id_check() {
            if (!nameCheck.test($("user_id").val())) {
                $(".id_check_message").text("아이디를 형식에 맞게 입력해주세요") 
                $(".id_check_message").css('color','red')
                return false
            } else{
                var id = $('input[name=id]').val();  
                $.ajax({                            
                    url : "/views/find_pw/find_info_id_check",       
                    type : "post",                  
                    dataType : "JSON",             
                    data : {"id" : id}        
                })

                .done(function (json){
                    if (json.check =='ok'){
                        // 인증번호 받기 버튼 활성화
                        user_id = id;
                        $("#check_id").attr("disabled",true)
                        $("#user_id").attr("readonly",true)
                        $("#check_id").css("cursor","Default")
                        $("#user_id").css("cursor","Default")
                        $("#user_email").attr("disabled",false)
                        $("#check_email").attr("disabled",false)
                        $("#check_email").css("cursor","pointer")
                        $("#check_id").css("background-color","green")
                        $(".id_check_message").text("본인 인증시 사용하는 이메일을 적어주세요")
                        $(".id_check_message").css('color','green')
                    } else {
                        $(".id_check_message").text("등록되지 않은 아이디입니다.")
                        $(".id_check_message").css('color','red')
                    }
                })
                .fail(function (xhr, status, errorThrown){  
                    console.log(errorThrown) 
                    alert("Ajax failed")
                    });
            }
        }

            function email_check() {
                if (!getCheck.test($("#user_email").val())) {
                    $(".overlap_message").text("이메일을 형식에 맞게 입력해주세요") 
                    $(".overlap_message").css('color','red')
                    return false
                } else{
                    var email = $('input[name=email]').val(); 
                    $.ajax({                            
                        url : "/views/find_pw/find_info_email_check",       
                        type : "post",                  
                        dataType : "JSON",             
                        data : {"user_email" : email,
                                 "user_id" : user_id
                                }        
                    })
    
                    .done(function (json){
                        if (json.check =='ok'){
                            // 인증번호 받기 버튼 활성화
                            user_email = email;
                            $("#check_email").attr("disabled",true)
                            $("#user_email").attr("readonly",true)
                            $("#send_mail_btn").attr("disabled",false)
                            $("#send_mail_btn").css("cursor","pointer")
                            $("#check_email").css("cursor","Default")
                            $("#check_email").css("background-color","green")
                            $(".overlap_message").text(json.msg)
                            $(".overlap_message").css('color','green')
                        } else {
                            $(".overlap_message").text(json.msg)
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
                if (user_email =='') {
                    $(".overlap_message").text("이메일을 확인해 주세요") 
                    $(".overlap_message").css('color','red')
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
                        $("#auth_email").attr("disabled",false)
                        $("#re_send_btn").attr("disabled",false)
                        $("#re_send_btn").css("cursor","pointer")
                        $("#send_mail_btn").replaceWith('<input type="button" id="check_number" value="인증완료" onclick="auth_number_check()"/>')
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
                $("#re_send_btn").attr("disabled",true)
                $("#re_send_btn").css("cursor","Default")
                $("#auth_email").attr("readonly",true)
                $("#check_number").attr("disabled",true)
                $("#check_number").css("cursor","Default")
                $("#new_pw").attr("disabled",false)
                $("#new_pw_check").attr("disabled",false)
                $("#new_pw_btn").attr("disabled",false)
                $("#new_pw_btn").css("cursor","pointer")
                $("#re_send_btn").css("background-color","green")
                $("#check_number").css("background-color","green")
                $("#auth_email").css('border','1px solid green')
                $("#auth_email").css('background','white') 
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
// jquary로 추가해서 넣은 놈은 키업 이벤트가 왜 안먹을까 씨빨 몰라
    $(document).on("keyup","#new_pw",function(){
         //최소 8 자,최대 14자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
         var pwCheck= RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,14}$/);
         if($("#new_pw").val() == ""){       
             $("#new_pw").css('border','1px solid red')
             $("#new_pw").css('background','white')      
             $(".pw_check_message").text('8~14자, 영어, 숫자, 특수 문자를 포함하게 입력해주세요.') 
             $(".pw_check_message").css('color','red') 
             password_check = false;
         } else if(!pwCheck.test($("#new_pw").val())){
             $("#new_pw").css('border','1px solid red') 
             $("#new_pw").css('background','white')  
             $(".pw_check_message").text('8~14자, 영어, 숫자, 특수 문자를 포함하게 입력해주세요.') 
             $(".pw_check_message").css('color','red') 
             password_check = false;
         } else {
             $("#new_pw").css('border','1px solid green') 
             $("#new_pw").css('background','white') 
             $(".pw_check_message").text('사용가능한 비밀번호 입니다.') 
             $(".pw_check_message").css('color','green') 
             password_check =true;
         }
    })
    $(document).on("keyup","#new_pw_check",function(){
            if (password_check == true){
                if($("#new_pw_check").val() == ""){   // 비밀번호 확인 란이 공백이라면 알림이 뜬다.
                    $("#new_pw_check").css('border','1px solid red')
                    $("#new_pw_check").css('background','white') 
                    $(".pw_check_2_message").text('입력한 비밀번호를 한번 더 입력해 주세요.') 
                    $(".pw_check_2_message").css('color','red') 
                    password_2_check = false;
                } else if ($("#new_pw").val() == $("#new_pw_check").val()) {
                    $("#new_pw_check").css('border','1px solid green')
                    $("#new_pw_check").css('background','white') 
                    $(".pw_check_2_message").text('비밀번호가 일치합니다.') 
                    $(".pw_check_2_message").css('color','green') 
                    password_2_check = true;
                } else {
                    $("#new_pw_check").css('border','1px solid red')
                    $("#new_pw_check").css('background','white') 
                    $(".pw_check_2_message").text('입력한 비밀번호가 일치하지 않습니다.') 
                    $(".pw_check_2_message").css('color','red')
                    password_2_check = false;
                }
            } else {
                $("#new_pw_check").css('border','1px solid red')
                $("#new_pw_check").css('background','white') 
                $(".pw_check_2_message").text('비밀번호를 확인해주세요 ') 
                $(".pw_check_2_message").css('color','red') 
                password_2_check = false;
            }

        })

    
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
    // 이과정을 거치지 않고 그냥 바꿔버림 이유는 모름...
    function change_pw() {
            if (password_check == false) {
                alert("비밀번호를 확인해 주세요");
                $("#new_pw").focus() 
                return false;
            } else if (password_2_check == false) {
                alert("비밀번호를 한번더 입력해주세요.")
                $("#new_pw_check").focus() 
                return false;
            } else if (password_check == true && password_2_check == true){
                alert("비밀번호를 변경했습니다!.")
                return true;
            }
        }