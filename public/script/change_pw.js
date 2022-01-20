 //최소 8 자,최대 14자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
 var pwCheck= RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,14}$/);

function change_pw(){
    var pw=$('#new_pw').val()
    if($("#new_pw").val() == ""){
        alert("비밀번호를 확인해주세요") 
        $("#new_pw").focus()
        return false
    } else if (!pwCheck.test($("#new_pw").val())) {
        alert("비밀번호를 형식에 맞게 입력해주세요") 
        $("#new_pw").focus()
        $('#new_pw').val('')
        return false
    } else {
        if ($("#new_pw_check").val() == "") {
            alert("비밀번호 확인란을 확인해주세요") 
            $("#new_pw_check").focus()
            return false
        } else if ($("#new_pw").val() == $("#new_pw_check").val()) {
            alert("비밀번호가 변경되었습니다.") 
            return true
        } else {
            alert("비밀번호 확인란을 확인해주세요") 
            $("#new_pw_check").focus()
            return false
        }
    }
    

}