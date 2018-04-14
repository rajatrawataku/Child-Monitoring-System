$(document).ready(function(){

  $('.modal').modal();

  // login post request

  $('#login').ajaxForm({

    beforeSubmit : function(formData, jqForm, options){

      $('#loader').css('display','block');

      return true;

    },
    success	: function(responseText, status, xhr, $form){

      console.log(responseText);

      $('#loader').css('display','none');

      if(responseText == 'Captcha_not_selected')
      {
        $('.heading_data').html('Captch Issues');
        $('.result_data').html('Captcha Not Selected');
        $('.modal').modal('open');
      }

      if(responseText == 'captcha_not_validated')
      {
        $('.heading_data').html('Captch Issues');
        $('.result_data').html('Captcha Not Validated');
        $('.modal').modal('open');
      }


      if(responseText == 'open_active_mail_jade')
      {
        // mail not approved bro
      }

      if(responseText == 'open_dasboard')
      {
        window.location.href='/dashboard';
      }

      if(responseText == 'open_2fa')
      {
        window.location.href='/twofa';
      }

      // if (status == 'success') window.location.href = '/dashboard';

    },
    error : function(e){

      $('#loader').css('display','none');

      $('.heading_data').html('Wrong Credentials');
      $('.result_data').html('Either Username/Password is wrong');
      $('.modal').modal('open');

    }
  });


  // register

  $('#register').ajaxForm({

    beforeSubmit : function(formData, jqForm, options){

      $('#loader').css('display','block');


      var pass=$('#icon_pass').val();
      var conf_pass=$('#icon_pass_conf').val();


      if(pass != conf_pass)
      {

        console.log('differ');
        $('#loader').css('display','none');
        $('.heading_data').html('Wrong Credentials');
        $('.result_data').html('Oops !!! Password do not match');
        $('.modal').modal('open');

        return false;
      }

      console.log('all fine');
      return true;

    },
    success	: function(responseText, status, xhr, $form){

      $('#loader').css('display','none');

      if(responseText == 'Captcha_not_selected' )
      {
        $('.heading_data').html('Captch Issues');
        $('.result_data').html('Captcha Not Selected');
        $('.modal').modal('open');

      }

      if(responseText == 'captcha_not_validated')
      {
        $('.heading_data').html('Captch Issues');
        $('.result_data').html('Captcha Not Validated');
        $('.modal').modal('open');
      }

      if(responseText == 'ok')
      {
        console.log('account created');
        $('.heading_data').html('Registration Successful');
        $('.result_data').html('Welcome to Child Care Home Automation System <br> <br> Redirecting to Login Page ......');
        $('.modal').modal('open');

        setTimeout(function(){
          window.location.href='/';
        },3000);
      }

      console.log('hey sucess');

      // if (status == 'success') window.location.href = '/dashboard';

    },
    error : function(e){

      $('#loader').css('display','none');
      console.log('error occured');

    }

  });

  // 2FA post request

  $('#two2Fa').ajaxForm({
    beforeSubmit : function(formData, jqForm, options){

      $('#loader').css('display','block');

      return true;

    },
    success	: function(responseText, status, xhr, $form){

      console.log('hey sucess');

      // if (status == 'success') window.location.href = '/dashboard';

    },
    error : function(e){


    }
  });


  //  twoFA

  $('#twofaForm').ajaxForm({
    beforeSubmit : function(formData, jqForm, options){

      $('#loader').css('display','block');

      return true;

    },
    success	: function(responseText, status, xhr, $form){

      console.log(responseText);

      $('#loader').css('display','none');

      if(responseText == 'Captcha_not_selected')
      {
        $('.heading_data').html('Captch Issues');
        $('.result_data').html('Captcha Not Selected');
        $('.modal').modal('open');
      }

      if(responseText == 'captcha_not_validated')
      {
        $('.heading_data').html('Captch Issues');
        $('.result_data').html('Captcha Not Validated');
        $('.modal').modal('open');
      }


      if(responseText == 'open_active_mail_jade')
      {
        // mail not approved bro
      }

      if(responseText == 'open_dasboard')
      {
        window.location.href='/dashboard';
      }

      if(responseText == 'open_2fa')
      {
        window.location.href='/twofa';
      }

      // if (status == 'success') window.location.href = '/dashboard';

    },
    error : function(e){

      $('#loader').css('display','none');

      $('.heading_data').html('Wrong Credentials');
      $('.result_data').html('Either Username/Password is wrong');
      $('.modal').modal('open');

    }
  });




});
