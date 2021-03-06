
function AccountValidator()
{
// build array maps of the form inputs & control groups //

	this.formFields = [$('#name-tf'), $('#email-tf'), $('#user-tf'), $('#pass-tf'),$('#passwordconf-tf'),$('#senspin-tf'),$('#senspin-tf-Conf')];
	this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#user-cg'), $('#pass-cg'),$('#passwordconf-cg'),$('#senspin-cg'),$('#senspin-cg-Conf')];

// bind the form-error modal window to this controller to display any errors //

	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});

// validate pin it has to be four digit

	this.validatePin=function(s){
		return s.length==4;
	}

// validate password matching or not

	this.validatePassworEqual=function(pass1,pass2){
		return pass1==pass2;
	}

// validating pin equality

	this.validatePinEqual=function(pin1,pin2){
		return pin1==pin2;
	}

	this.validateName = function(s)
	{
		return s.length >= 3;
	}

	this.validatePassword = function(s)
	{
	// if user is logged in and hasn't changed their password, return ok
		if ($('#userId').val() && s===''){
			return true;
		}	else{
			return s.length >= 6;
		}
	}

	this.validateEmail = function(e)
	{
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(e);
	}

	this.showErrors = function(a)
	{
		$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
		grecaptcha.reset();
	}

}

AccountValidator.prototype.showInvalidEmail = function()
{
	this.controlGroups[1].addClass('error');
	this.showErrors(['That email address is already in use.']);

	$('#account-form-btn2').removeClass("disabled");
	$('#account-form-btn2').css("pointer-events","auto");
}

AccountValidator.prototype.showInvalidUserName = function()
{
	this.controlGroups[2].addClass('error');
	this.showErrors(['That username is already in use.']);

	$('#account-form-btn2').removeClass("disabled");
	$('#account-form-btn2').css("pointer-events","auto");
}

AccountValidator.prototype.validateForm = function()
{
	var e = [];
	for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
	if (this.validateName(this.formFields[0].val()) == false) {
		this.controlGroups[0].addClass('error'); e.push('Please Enter Your Name');
	}

	if (this.validateEmail(this.formFields[1].val()) == false) {
		this.controlGroups[1].addClass('error'); e.push('Please Enter A Valid Email');
	}

	if (this.validateName(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error');
		e.push('Please Choose A Username');
	}

	if (this.validatePassword(this.formFields[3].val()) == false) {
		this.controlGroups[3].addClass('error');
		e.push('Password Should Be At Least 6 Characters');
	}

	if(this.validatePin(this.formFields[5].val())==false){
		this.controlGroups[5].addClass('error');
		e.push('Pin has to be four digit');
	}

	if(this.validatePassworEqual(this.formFields[3].val(),this.formFields[4].val())==false){
		this.controlGroups[4].addClass('error');
		e.push('Password Not Matching');
	}

	if(this.validatePassworEqual(this.formFields[5].val(),this.formFields[6].val())==false)
	{
		this.controlGroups[6].addClass('error');
		e.push('Pin Not Matching');
	}

	if(e.length!=0)
	{
		$('#account-form-btn2').removeClass("disabled");
		$('#account-form-btn2').css("pointer-events","auto");
	}
	if (e.length) this.showErrors(e);
	return e.length === 0;
}
