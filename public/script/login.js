function login_check() {
  var getCheck=/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;  
    if ($('input[name=id]').val() =="") {
      $('.feedback_message').text("아이디를 입력해 주세요")
      $('.id-text-field').css('border','red');
      $('.id-text-field').focus();
      return false
    } else if ($('input[name=pw]').val() ==""){
        $('.feedback_message').text("비밀번호를 입력해 주세요")
        $('.pw-text-field').css('border','red');
        $('.pw-text-field').focus();
        return false
    }
  }
    