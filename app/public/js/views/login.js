
$(document).ready(function(){

	var lv = new LoginValidator();
	var lc = new LoginController();

// main login form //

	$('#login').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			$('.loader-5').css('display','block');
			$('.singInbutton').css('pointer-events','none');
			if (lv.validateForm() == false){
			$('.loader-5').css('display','none');
			$('.singInbutton').css('pointer-events','block');
				return false;
			} 	else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value:$('.button-rememember-me-glyph').hasClass('glyphicon-ok')});
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			// removing the loader inside

			if(responseText=='Captcha_not_selected')
			{
				$('.loader-5').css('display','none');
				$('.singInbutton').css('pointer-events','auto');

				$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
				var ul = $('.modal-form-errors .modal-body ul');
					ul.empty();
					ul.append('<li> Captcha Not Selected </li>')
				//
				// for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
				// this.alert.modal('show');
				//
				//
				// $('.modal-form-errors .modal-body p').text('Captch Not Selected');
				$('.modal-form-errors').modal('show');
				console.log("Captha not selected");

			}

			if(responseText=='captcha_not_validated')
			{
				$('.loader-5').css('display','none');
				$('.singInbutton').css('pointer-events','auto');

				$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
				var ul = $('.modal-form-errors .modal-body ul');
					ul.empty();
					ul.append('<li> Captcha Not Validated <br> Please try again after some time </li>')

				$('.modal-form-errors').modal('show');

				// $('.modal-form-errors .modal-body p').text('Captch Not Validated.<br> Try Again After some time');
				// $('.modal-form-errors').modal('show');
				console.log('captcha not validated ');
				grecaptcha.reset();
			}

			if(responseText=='open_2fa')
			{
				window.location.href = '/twofa';
			}

			if(responseText=='open_dasboard')
			{
				window.location.href = '/dashboard';
			}

			if(responseText=='open_active_mail_jade')
			{
				window.location.href = '/ActiveMail';
			}

			// if (status == 'success') window.location.href = '/dashboard';
		},
		error : function(e){
			// removing the loader
			$('.loader-5').css('display','none');
			$('.singInbutton').css('pointer-events','auto');
			lv.showLoginError('Login Failure', 'Please check your username and/or password');
			grecaptcha.reset();

		}
	});
	$('#user-tf').focus();

// login retrieval form via email //

	var ev = new EmailValidator();

	$('#get-credentials-form').ajaxForm({
		url: '/lost-password',
		beforeSubmit : function(formData, jqForm, options){
			if (ev.validateEmail($('#email-tf').val())){
				ev.hideEmailAlert();
				return true;
			}	else{
				ev.showEmailAlert("<b>Error!</b> Please enter a valid email address");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			$('#cancel').html('OK');
			$('#retrieve-password-submit').hide();
			ev.showEmailSuccess("Check your email on how to reset your password.");
		},
		error : function(e){
			if (e.responseText == 'email-not-found'){
				ev.showEmailAlert("Email not found. Are you sure you entered it correctly?");
			}	else{
				$('#cancel').html('OK');
				$('#retrieve-password-submit').hide();
				ev.showEmailAlert("Sorry. There was a problem, please try again later.");
			}
		}
	});


	$('#sendResendMail').ajaxForm({
		url: '/resendActivation',
		beforeSubmit : function(formData, jqForm, options){
			$('.loader-6').css('display','block');
		},
		success	: function(responseText, status, xhr, $form){
			console.log(responseText);

			if(responseText=='ok')
			{
				$('#myModal').modal('hide');
				$('.responseText').html('Please check your registered email to verify your account');
				$('.topText').html('Verification Mail Sent Sucessfully');
				$('#successModal').modal('show');
				$('.loader-6').css('display','none');

			}else {
				$('#myModal').modal('hide');
				$('.responseText').html('Please enter correct user name');
				$('.topText').html('Verification Mail not Sent');
				$('#successModal').modal('show');
				$('.loader-6').css('display','none');

			}

		},
		error : function(e){
			alert(e);
		}
	});




});
