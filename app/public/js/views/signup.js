
$(document).ready(function(){

	var av = new AccountValidator();
	var sc = new SignupController();

	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){

			$('.loader-5').css('display','block');
			$('#register-form-btn').css('pointer-events','none');

			if(av.validateForm()==false)
			{
				$('.loader-5').css('display','none');
				$('#register-form-btn').css('pointer-events','auto');
				return false;
			}else{
				return true;
			}

			//console.log(formData);


			// $('#register-form-btn').addClass("disabled");
			// $('#register-form-btn').css("pointer-events","none");
			return av.validateForm();
		},
		success	: function(responseText, status, xhr, $form){

			// $('#register-form-btn').removeClass("disabled");
			// $('#register-form-btn').css("pointer-events","auto");

			if(responseText=='Captcha_not_selected')
			{
					$('.loader-5').css('display','none');
					$('#register-form-btn').css('pointer-events','auto');

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
				$('#register-form-btn').css('pointer-events','auto');

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

			if(responseText=='Sponsor_Referral_Code_Invalid')
			{
				$('.loader-5').css('display','none');
				$('#register-form-btn').css('pointer-events','auto');

				$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
				var ul = $('.modal-form-errors .modal-body ul');
					ul.empty();
					ul.append('<li>Sponsor Referral Code Invalid <br> Check Your Sponsor Referral Code </li>')

				$('.modal-form-errors').modal('show');

				// $('.modal-form-errors .modal-body p').text('Captch Not Validated.<br> Try Again After some time');
				// $('.modal-form-errors').modal('show');
				console.log('Sponsor_Referral_Code_Invalid');
			}

			if(responseText=='Link_Invalid')
			{
				$('.loader-5').css('display','none');
				$('#register-form-btn').css('pointer-events','auto');

				$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
				var ul = $('.modal-form-errors .modal-body ul');
					ul.empty();
					ul.append('<li>Link Invalid <br> Check Your Link </li>')

				$('.modal-form-errors').modal('show');

				// $('.modal-form-errors .modal-body p').text('Captch Not Validated.<br> Try Again After some time');
				// $('.modal-form-errors').modal('show');
				console.log('Link_Invalid');
			}

			if(responseText=='Parent_Referral_Code_Invalid')
			{
				$('.loader-5').css('display','none');
				$('#register-form-btn').css('pointer-events','auto');

				$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
				var ul = $('.modal-form-errors .modal-body ul');
					ul.empty();
					ul.append('<li>Parent Referral Code Invalid <br> Check Your Parent Referral Code </li>')

				$('.modal-form-errors').modal('show');

				// $('.modal-form-errors .modal-body p').text('Captch Not Validated.<br> Try Again After some time');
				// $('.modal-form-errors').modal('show');
				console.log('Parent_Referral_Code_Invalid');
			}

			if(responseText=='Link_Already_Occupied')
			{
				$('.loader-5').css('display','none');
				$('#register-form-btn').css('pointer-events','auto');

				$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
				var ul = $('.modal-form-errors .modal-body ul');
					ul.empty();
					ul.append('<li>Link_Already_Occupied <br> Change your link. ( left or right ) </li>')

				$('.modal-form-errors').modal('show');

				// $('.modal-form-errors .modal-body p').text('Captch Not Validated.<br> Try Again After some time');
				// $('.modal-form-errors').modal('show');
				console.log('Link_Already_Occupied');
			}

			if(responseText=='ok')
			{
					window.location.href = '/confirmation?email='+$("#email-tf").val()+'&user='+$("#name-tf").val();
			}
			console.log(responseText);
		},
		error : function(e){

			$('.loader-5').css('display','none');
			$('#register-form-btn').css('pointer-events','auto');

			if (e.responseText == 'email-taken'){
			    av.showInvalidEmail();
					grecaptcha.reset();
			}	else if (e.responseText == 'username-taken'){
			    av.showInvalidUserName();
					grecaptcha.reset();
			}
		}
	});

	$('#name-tf').focus();

// customize the account signup form //

	$('#account-form h2').text('Signup');
	$('#account-form #sub1').text('Please tell us a little about yourself');
	$('#account-form #sub2').text('Choose your username & password');
	$('#account-form-btn1').html('Cancel');
	$('#account-form-btn2').html('Submit');
	$('#account-form-btn2').addClass('btn-primary');
	$("#backButton").remove();
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Account Created!');
	$('.modal-alert .modal-body p').html('Your account has been successfully registered with SIPcoin.io </br>.');

});
