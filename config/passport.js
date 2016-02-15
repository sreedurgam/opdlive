var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/models/user.js');
//var Doctor = require('../app/models/doctor.js');
var configAuth = require('./auth');

module.exports = function(passport){

	passport.serializeUser(function(user, done){
			done(null, user.id);
	});
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){		
			done(err, user);
		});
	});
	

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done){
		process.nextTick(function(){
			User.findOne({'patient.username': username}, function(err, user){
				
				if(err){					
				  return done(err);
				}
				if(user){					
					return done(null, false);
				}		
				else{					
					var newUser = new User();
					newUser.patient.username = username;
					newUser.patient.password = newUser.generateHash(password);		
					
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}		
			})
		});	
	}));

	passport.use('local-doc-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done){	
		process.nextTick(function(){
			User.findOne({'doctor.local.username': username}, function(err, user){				
				if(err){					
				  return done(err);
				}
				if(user){					
					return done(null, false);
				}		
				else{
				
					var newUser = new User();
					newUser.doctor.local.username = username;
					newUser.doctor.local.password = newUser.generateHash(password);						
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}		
			})
		});	
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done){	
		process.nextTick(function(){			
			User.findOne({'patient.username': username}, function(err, user){				
				if(err){				
					return done(err);
				}
				if(!user){				
					return done(null, false);
				}
				if(!user.validpatientPassword(password))
				{		
					return done(null, false);
				}			
				return done(null, user);
			});
		})
	}));

	passport.use('local-doc-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done){
		process.nextTick(function(){			
			User.findOne({'doctor.local.username': username}, function(err, user){				
				if(err){					
					return done(err);
				}
				if(!user){					
					return done(null, false);
				}
				if(!user.validdoctorPassword(password))
				{					
					return done(null, false);
				}
				return done(null, user);
			});
		})
	}));


	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['id','emails','name']
	},
	function(accessToken, refreshToken, profile, done){	
		process.nextTick(function(){
			User.findOne({'facebook.id' : profile.id}, function(err, user){
				if(err){
					return done(err);
				}
				if(user){					
					return done(null, user);
				}
				else{
					var newUser = new User();					
					newUser.facebook.id = profile.id;
					newUser.facebook.token = accessToken;
					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.facebook.email = profile.emails[0].value;
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}
	));

	passport.use(new GoogleStrategy({
		clientID: configAuth.googleAuth.clientID,
		clientSecret: configAuth.googleAuth.clientSecret,
		callbackURL: configAuth.googleAuth.callbackURL,
        profileFields: ['id', 'email', 'gender']
	},
    function(accessToken, refreshToken, profile, done){    	
    	process.nextTick(function(){
    		User.findOne({'google.id': profile.id}, function(err, user){
    			if(err){    				
    				return done(err);
    			}
    			if(user){    				
    				return done(null, user);
    			}
    			else{    				
    				var newUser = new User();
    				newUser.google.id = profile.id;
    				newUser.google.token = accessToken;
    				newUser.google.name = profile.displayName;    				
    				newUser.google.email = profile.emails[0].value;   				

    				newUser.save(function(err){
    					if(err)
    						throw err;
    					return done(null, newUser);
    				});	  				
    			}
    		});
    	});
    }
	));

}