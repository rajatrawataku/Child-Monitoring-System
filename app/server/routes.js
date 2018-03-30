process.env.NODE_ENV = "default";

console.log("========================= NODE ENVIRONMENT : " + process.env.NODE_ENV + "============================\n")

//===================== required files ============================================
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var request = require('request');
var Promise = require("bluebird");
var moment 		= require('moment');
var nodemailer = require('nodemailer');
var config = require('config');
var speakeasy = require('speakeasy');
var qrcode = require('qrcode');

//=================================================================================

//=====================config file access==========================================
var Credentials = config.get('Credentials');
var Server = config.get('Server');
var Transporter = config.get('Transporter');
var Captcha = config.get('Captcha');
var Referral = config.get('Referral');

var sipCoinEmailId = Credentials.sipCoinEmailId;
var sipCoinEmailPass = Credentials.sipCoinEmailPass;
var serverIP = Server.IP;
var captchaSecret = Captcha.key;
var adminSponsorCode = Referral.Admin;

//=================================================================================
//=================================================================================

//transporter for nodemailer, check config file for dev / prod configurations
var transporter = nodemailer.createTransport(Transporter);


//===================== Part of HTML for Email Verification - Go to POST /signup ========================================================================
var part1='<head> <title> </title> <style> #one{ position: absolute; top:0%; left:0%; height: 60%; width: 40%; } #gatii{ position: absolute; top:26%; left:5%; height: 20%; width: 20%; } #text_div { position: absolute; top: 10%; left: 5%; } #final_regards { position: absolute; top: 50%; left: 5%; } </style> </head> <body> <div id="text_div"> <b>Welcome, to SIPcoin. You have been successfully registered on SIPcoin.io </b> <br> <br> Please click on the link below to verify your account <br><br>';
var part2=' <br><br> <br> P.S.- You are requested to preserve this mail for future references. <br> <br> </div> <iframe id="gatii" src="https://drive.google.com/file/d/1k99fX9I4HOdhKZA1KwrDflM1W-orCSh0/preview" width="40" height="40"></iframe> <br> <br> <div id="final_regards"> Thank You, <br> <br> Team SIPcoin.io <br> <br> <a href="http://support.sipcoin.io">Support Team</a> <br> <br> </div> </body>'
//===============================================================================================================================================


//secret string generation algorithm
var makeid = function(lengthReqd) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < lengthReqd; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


var getAccountDetails = function(user, email) {
	return new Promise(function(resolve,reject){
		AM.getAccount(user, email, function(o){
			console.log(o);
			if(o) resolve(o);
		});
	});
}


//////////////////////////////OLD ICO///////////////////////////////////////////
// var updateTokenValueOfUser = function(user, email) {
// 	return new Promise(function(resolve,reject){
// 		getTokenValue().then((value)=>{
// 			AM.updateTokenValueOfUserInDB(user,email,value, function(){
// 				console.log("Updated the TOken Value in DB");
// 				resolve();
// 			})
// 		})
// 	})
// }


//current bitcoin value in USD
var btcCheck = function(){
	return new Promise(function(resolve,reject){
		console.log("inside btcCheck");
		request('https://blockchain.info/ticker', { json: true }, (err, res, body) => {
			if (err) { return console.log(err); }
			resolve(body.USD.last);
		});
	});
}

//current ethereum value in USD
var ethCheck = function(){
  return new Promise(function(resolve,reject){
    request("https://api.coinmarketcap.com/v1/ticker/ethereum/",{json:true},(err,res,body)=>{
      if(err) { return console.log(err);}
      //console.log(body);
      resolve(body[0].price_usd);
    })
  })
}

//account balance via blockchain
var acntBalance = function(address){
  return new Promise(function(resolve,reject){
    request({
      headers : {'content-type' : 'application/x-www-form-urlencoded'},
      url : 'http://54.169.149.54:9326/acntBalance',
      method : 'POST',
      form : {
        'apikey' : "ironmandiesininfinityWars",
        'address' : address //"0x57E43858eA63b9e1F8fA21Fa4C6e571195fCf74F"
      }
    },(err,res,body)=>{
      console.log(body)
      resolve(body); //body.etherBalance and body.tokenBalance
    })
  })
}

//create wallet address on ether blockchain
var createAccount = function(username){
  return new Promise(function(resolve,reject){
    request({
      headers : {'content-type' : 'application/x-www-form-urlencoded'},
      url : 'http://54.169.149.54:9326/ethAcnt',
      method : "POST",
      form : {
        'apikey' : "ironmandiesininfinityWars",
        'username' : username
      }
    },(err,res,body)=>{
      //console.log(body)
      resolve(body) //body.address , body.privateKey
    })
  })
}

//////////////////////////////OLD ICO///////////////////////////////////////////

// var getPublicAddress = function(TID){
// 	return new Promise(function(resolve,reject){
//
// 		if(process.env.NODE_ENV == "production")
// 		{
// 			var API = 'https://api.blockchain.info/v2/receive?';
// 			var xPub = 'xpub6D9eFNDYtCsbwd7xQdGDeQX9SejSpAFsBKRNzaViBprjXcoHs6933e9STs61Boo4P3REpeLNRXv1FW9oKWZp43PVTSD5AZbAFny9MFGHMb9';
// 			var callback = 'http%3A%2F%2Fsipcoin.io/getInvoice%3FTID%3D'+TID;
// 			var key = '09195d68-3873-4237-92fd-cdc6bda54aa4'
//
// 			var URL = API + 'xpub=' + xPub + '&callback=' + callback + '&key=' + key;
//
// 			request(URL, {json:true}, (err, res, body)=>{
// 				if(err) { return console.log(err); }
// 				console.log("received Address : "+body.address);
// 				resolve(body.address);
// 			})
// 		}
// 		else {
// 			resolve("12wedfv4rtfgb7ytf56yh98iuhggb");
// 		}
//
// 	});
// }


//get transaction doc with the given invoice id
var getTransactionDoc = function(TID){
	return new Promise(function(resolve,reject){
		AM.getTransaction(TID, function(o){
			resolve(o);
		})
	})
}

///////////////////////////////////////// OLD ICO //////////////////////////////
// var getTokenValue = function(){
// 	//var tokenValue;
// 	return new Promise(function(resolve,reject){
// 		console.log("inside getTokenValue");
// 		AM.currentTokenValue(function(o){
// 			if(o) resolve(o[0].tokenValue);
// 		})
// 	});
// }

// EDITED
 var getTokenValue = function(){
 	//var tokenValue;
 	return new Promise(function(resolve,reject){
 		console.log("inside getTokenValue");
 		AM.currentTokenValue(function(o){
 			if(o) resolve(o[0].tokenValue);
 		})
 	});
 }

//get node info for each parent
var getNodeInfo = function(referral){
	return new Promise(function(resolve,reject){
		AM.getLeftRight(referral, function(res){
			resolve(res);
		})
	})
}


module.exports = function(app) {

	 //main page render
	 app.get('/',function(req,res){
		 if(req.session.user != null)
			 res.redirect('/dashboard');
		 else {
       res.render('main')
		 }
	 });


   app.get('/dashboard',function(req,res){

     if(req.session.user!=null){

       res.render('dashboard');

     }else {
       res.redirect('/');
     }
   });

// resend activation email
	app.post('/resendActivation',function(req,res){
    AM.getDataForResend(req.body['username'],function(data){
      console.log(data);
      if(data != null) {
        var URLforVerification = serverIP +"/verify?secretKey=" + data.secret + "&veri=" + makeid(5);
        var mailOptions = {
          from: sipCoinEmailId,
          to: data.email,
          subject: ' SIPCOIN || Resend Activation Link',
          html: part1 +URLforVerification+part2,
        };
        console.log(mailOptions);
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            console.log("email_not_sent");
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('ok');
          }
        })
      }
      else {
        res.status(200).send('user not valid');
      }
    });
});



// new exchange post login======================================================
	app.post('/', function(req, res){
    console.log("post login");
    var username = req.body['username'];
    var password = req.body['password'];
    req.session.tempUser=username;
    console.log("g recpathca");
    console.log(req.body['g-recaptcha-response'])
    // var twoFAcode = req.body['2faCode'];
    // var userFA = req.body['userFA'];

    console.log("username : " + username);
    // console.log("two fa : " + twoFAcode);
    // console.log("user FA : " + userFA);


    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
      res.status(200).send('Captcha_not_selected');
      console.log("hey captcha not selected");
      // res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
    }else {
      // req.connection.remoteAddress will provide IP address of connected user.
      var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + captchaSecret + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
      // Hitting GET request to the URL, Google will respond with success or error scenario.
      request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
          res.status(200).send('captcha_not_validated');
          // res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
        }else {

          if(username != undefined){
            AM.manualLogin(username, password, function(e,o){
              if(!o){
                res.status(400).send(e);
              }
              else {
                if(o){
                  if(o.accountVerified){
                    if(o.twoFA){
                      //render twofa
                      res.status(200).send('open_2fa');
                      // res.render('fa',{
                      //   username : username
                      // });
                    }
                    else {
                      //if twofa not enabled, create session and direct to dashboard
                      console.log('hey');
                      req.session.user = o;
                      res.status(200).send('open_dasboard');
                      // res.redirect('/dashboard');
                    }
                  }
                  else {
                    //render activeMail.jade if account not yet verified
                    console.log('hey there');
                    res.status(200).send('open_active_mail_jade');
                    // res.render('ActiveMail');
                  }
                }
              }
            })
          }

        }

      });

    }
	});


  // get for 2fa
  app.get('/twofa',function(req,res){

      var userFA= req.session.tempUser;
      if(userFA!=undefined)
      {
        res.render('fa')
      }else {
        res.redirect('/');
      }
  });

  // post for 2fa
  app.post('/twofa',function(req,res){
    var twoFAcode = req.body['2faCode'];
    var userFA= req.session.tempUser;

     if(twoFAcode != undefined && userFA != undefined) {
        //check if twoFA is correct or not, if correct
        console.log(twoFAcode);
        AM.getAccountByUsername(userFA,function(o){
          var verified = speakeasy.totp.verify({
            secret: o.twoFAsecret.base32,
            encoding: 'base32',
            token: twoFAcode
          });

          if(verified){
            req.session.user = o;
            res.redirect('/dashboard');
          }
          else {
            res.render('fa');
          }
        });
      }

  });

  //enable twoFA route for exchange portal =====================================
  app.get('/enable2FA',function(req,res){
    if(req.session.user == null) res.redirect('/');
    else {
      var secret = speakeasy.generateSecret({length:20});
      AM.enable2FA(req.session.user.user, secret, function(result){
        req.session.user = result;
        qrcode.toDataURL(secret.otpauth_url, function(err, imageData){
          res.send({
            image : imageData,
            secret : secret.base32
          })
        })
      })
    }
  })

  //start two FA once the two FA is verified for the first time=================
  app.post('/start2FA',function(req,res){
    if(req.session.user == null) res.redirect('/');
    else {
      console.log("#start 2fa route called")
      var twoFAcode = req.body['twoFAcode'];
      console.log("#two fa code : "+twoFAcode);
      var verified = speakeasy.totp.verify({
        secret: req.session.user.twoFAsecret.base32,
        encoding: 'base32',
        token: twoFAcode
      });
      console.log("#verfied : "+verified);

      if(verified){
        console.log("#verified 2 : "+verified);
        AM.start2FA(req.session.user.user, function(result){
          console.log(result);
          req.session.user = result;
          res.status(200).send("ok");
        })
      }
      else {
        //wrong two fa entered
        res.redirect('/user')
      }
    }
  })

  //disable twoFA route for exchange portal ====================================
  app.post('/disable2FA',function(req,res){

    if(req.session.user == null) res.redirect('/');
    else {
      var twoFAcode = req.body['twoFAcode'];
      console.log('2fa input : '+twoFAcode);
      console.log('base 32 : '+req.session.user.twoFAsecret.base32);
      var verified = speakeasy.totp.verify({
        secret: req.session.user.twoFAsecret.base32,
        encoding: 'base32',
        token: twoFAcode
      });
      console.log('verfied satus : '+verified);

      if(verified){
        AM.disable2FA(req.session.user.user, function(result){
          req.session.user = result;
          res.status(200).send('disabled_2fa');
        })
      }
      else {
        res.status(200).send('wrong_code');
        //wrong two fa entered
      }
    }
  })

//change password via user profile ============================================
app.post('/changePassword',function(req,res){
  if(req.session.user == null) res.redirect('/');
  else {
    var oldPass = req.body['currPassChange'];
    var newPass = req.body['newPassChange'];
    var confirmNewPass = req.body['confPassChange'];
    var PIN = req.body['pinPassChange'];

    AM.checkPin(req.session.user.email, PIN, function(result){
      if(result){
        if(newPass == confirmNewPass){
          AM.changePassword(req.session.user.user, oldPass, newPass, function(result){
            var passwordChangeResult = {
              result : result
            }
            res.status(200).send(passwordChangeResult);
          })
        }
        else {
          var passwordChangeResult = {
            result : "Password Doesn't Match"
          }
          res.status(200).send(passwordChangeResult);
        }
      }
      else {
        var passwordChangeResult = {
          result : "Check Your PIN and Try Again"
        }
        res.status(200).send(passwordChangeResult);
      }
    })
  }
})

//logout, change into post
	app.get('/logout', function(req, res){
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){ res.redirect('/') });
	})


	// creating new accounts //
		app.get('/signup', function(req, res) {
      res.render('signup');
		});


//signup submission of registration form along with referral
app.post('/signup', function(req, res){

		if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
			res.status(200).send('Captcha_not_selected');
			console.log("hey captcha not selected");
			// res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
		}else {

	    // req.connection.remoteAddress will provide IP address of connected user.
			var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + captchaSecret + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
			// Hitting GET request to the URL, Google will respond with success or error scenario.
			request(verificationUrl,function(error,response,body) {
				body = JSON.parse(body);
				// Success will be true or false depending upon captcha validation.
				if(body.success !== undefined && !body.success) {
					res.status(200).send('captcha_not_validated');
					// res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
				}else {

          var newAccount = {
                  	email 	: req.body['emailUser'],
                  	user 	: req.body['username'],
                  	pass	: req.body['passUser'],
                    twoFA : false,
                    twoFAsecret : "TWO FA DISABLED",
                  	secret : makeid(20),
                  	accountVerified : false
                  }

                  //===================== Part of HTML for Email Verification - Go to POST /signup ========================================================================
          var part1='<head> <title> </title> <style> #one{ position: absolute; top:0%; left:0%; height: 60%; width: 40%; } #gatii{ position: absolute; top:26%; left:5%; height: 20%; width: 20%; } #text_div { position: absolute; top: 10%; left: 5%; } #final_regards { position: absolute; top: 50%; left: 5%; } </style> </head> <body> <div id="text_div"> <b>Welcome, to SIPcoin. You have been successfully registered on SIPcoin.io </b> <br> <br> Please click on the link below to verify your account <br><br>';
          var part2=' <br><br> <br> P.S.- You are requested to preserve this mail for future references. <br> <br> </div> <iframe id="gatii" src="https://drive.google.com/file/d/1k99fX9I4HOdhKZA1KwrDflM1W-orCSh0/preview" width="40" height="40"></iframe> <br> <br> <div id="final_regards"> Thank You, <br> <br> Team SIPcoin.io <br> <br> <a href="http://support.sipcoin.io">Support Team</a> <br> <br> </div> </body>'
          //==============================================================================================================================================
          var URLforVerification = serverIP +"/verify?secretKey=" + newAccount.secret + "&veri=" + makeid(5);


          AM.addNewAccount(newAccount, function(e){

            console.log('created');
            console.log(e);

            if(e){
              res.status(400).send(e);
            }else {

              var mailOptions = {
                from: sipCoinEmailId,
                to: newAccount.email,
                subject: 'Child Monitoring || Successful Registration',
                html: part1 +URLforVerification+part2,
              };

              // transporter.sendMail(mailOptions, function(error, info){
              //   if (error) {
              //     console.log("Email Not Sent, Error : " + error);
              //   } else {
              //     console.log('Email Sent: ' + info.response);
              //   }
              //   res.status(200).send('ok');
              // });

              res.status(200).send('ok');

            }



          });

        } //End of else 1

      });
		 }
	 //}
});



// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){

				var part1='<head> <title> </title> <style> #one{ position: absolute; top:0%; left:0%; height: 60%; width: 40%; } #gatii{ position: absolute; top:26%; left:5%; height: 20%; width: 20%; } #text_div { position: absolute; top: 10%; left: 5%; } #final_regards { position: absolute; top: 50%; left: 5%; } </style> </head> <body> <div id="text_div"> <b>Welcome, to SIPcoin.</b> <br> <br> Please click on the link below to change your password <br><br>';
		    var part2=' <br><br> <br> P.S.- You are requested to preserve this mail for future references. <br> <br> </div> <iframe id="gatii" src="https://drive.google.com/file/d/1k99fX9I4HOdhKZA1KwrDflM1W-orCSh0/preview" width="40" height="40"></iframe> <br> <br> <div id="final_regards"> Thank You, <br> <br> Team SIPcoin.io <br> <br> <a href="http://support.sipcoin.io">Support Team</a> <br> <br> </div> </body>'

				var link = serverIP + '/reset-password?e='+o.email+'&p='+o.pass;

        console.log(link);

				var mailOptions = {
					from: sipCoinEmailId,
					to: o.email,
					subject: ' SIPCOIN || Password Reset',
					html: part1+link+part2,
				};

				transporter.sendMail(mailOptions, function(error, info){
				 if (error) {
					 console.log(error);
					 console.log("email_not_sent");
					 //response_value="Not Registred Sucessfully";
					 //res.json({"mail_value" : "mail_not_sent"});
					 res.status(400).send('unable to dispatch password reset')
				 } else {
					 console.log('Email sent: ' + info.response);
					 //res.json({"mail_value" : "mail_sent"});
					 //response_value="Registred Sucessfully";
					 res.status(200).send('ok')
				 }
				});
			}
			else{
				res.status(400).send('email-not-found');
			}

	});
});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/login');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});

	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
    var nPin = req.body['PIN'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
    AM.checkPin(email, nPin, function(result){
      console.log("email : " +email);
      console.log("PIN : "+nPin);
      if(result){
        console.log("result : "+result);
        AM.updatePassword(email, nPass, function(e, o){
          if (o){
            res.status(200).send('ok');
          }	else{
            res.status(400).send('unable to update password');
          }
        })
      }
      else {
        res.status(200).send("Invalid Pin");
      }
    })
	});


//redirect to main page if wrong routes tried
app.get('*', function(req, res) { res.redirect('/') });

};
