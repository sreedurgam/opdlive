var User = require('./models/user.js');
var DelhiDoctors = require('./models/delhidoctors.js');
var Doctors_list = [];
var profileUpdateCount;
var path = require('path');
var loggedInUserId;
var localdoctorId;
var patient;
var doctor;
var patientName;
var doctorName;

module.exports = function(app, passport){

app.get('/', function(req, res){
	//res.render('../views/login.ejs');
    //console.log(path.join(__dirname + '/../index.html'));  
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/doctor_login', function(req, res){
   // console.log("I m in get of doctor login"); 
    res.render('../views/doctor_login.ejs');
});

app.post('/signup', passport.authenticate('local-signup', {
    	successRedirect: '/delhidoctors',
    	failureRedirect: '/',
    	//failureFlash: true
    }));

app.get('/login', function(req, res){
    //console.log("I m in login");
    res.render('../views/login.ejs');
})

/*app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/delhidoctors',
        failureRedirect: '/',
        //failureFlash: true
    }));*/

app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/localdoctors',
        failureRedirect: '/',
        //failureFlash: true
    }));


app.post('/doctor_login', passport.authenticate('local-doc-login', {
        successRedirect: '/profile',
        failureRedirect: '/doctor_login',
        //failureFlash: true
}));

app.post('/doctor_signup', passport.authenticate('local-doc-signup', {
        successRedirect: '/profile',
        failureRedirect: '/doctor_login',
        //failureFlash: true
}));

app.get('/profile', isLoggedIn, function(req, res){
    patient = false;
    doctor = true;
    doctorName = req.user.doctor.local.username;
    //console.log("I m in profile"); 
    //console.log(req.user.doctor.profileUpdateCount);
    if (req.user.doctor.profileUpdateCount == undefined){
        //console.log("doc-profile");
        res.redirect('/doc_profile');        
    }
    else
    {
        //console.log("doc-dashboard");
        res.redirect('/doc_dashboard');        
    }       
});


app.get('/doc_dashboard', isLoggedIn, function(req, res){
//console.log("I m in doc_dashboard");
res.render('doctor_dashboard.ejs', {doc: req.user});

});

app.get('/doc_profile', isLoggedIn, function(req, res){
//console.log("I m in doc_profile");
res.render('doctor_profile.ejs', {doc: req.user});
});


app.post('/profile', function(req, res){
    //console.log("I m in post of profile");
    //console.log(req.user._id);
    profileUpdateCount = req.user.doctor.profileUpdateCount;   
    if (req.user.doctor.profileUpdateCount == undefined){       
        profileUpdateCount = 0;
    }
    profileUpdateCount++;  
    User.update({_id: req.user._id}, 
    {
        "doctor.profileUpdateCount": profileUpdateCount,
        "doctor.Address.FullAddress":req.body.fulladdress,
        "doctor.Address.Pin":req.body.pin,
        "doctor.Address.City":req.body.city,
        "doctor.Address.Country":req.body.country,
        "doctor.Address.Latitude":req.body.latitude,
        "doctor.Address.Longitude":req.body.longitude,
        "doctor.Award.Name":req.body.awardname,
        "doctor.Award.Year":req.body.awardyear,
        "doctor.Details.Name":req.body.docname,
        "doctor.Details.Email":req.body.docemail,
        "doctor.Details.password":req.body.docpassword,
        "doctor.Details.PhoneHome":req.body.docphonehome,
        "doctor.Details.PhoneOffice":req.body.docphoneoffice,
        "doctor.Details.Mobile":req.body.docmobile,
        "doctor.Details.City":req.body.doccity,
        "doctor.Details.Country":req.body.doccountry,
        "doctor.Details.Photo":req.body.docphoto,
        "doctor.Details.Fee":req.body.docfee,
        "doctor.Membership.Name":req.body.membershipname,
        "doctor.Organisation.Name":req.body.orgname,
        "doctor.Organisation.Phone":req.body.orgphone,
        "doctor.Organisation.Mobile":req.body.orgmobile,
        "doctor.Organisation.Logo":req.body.orglogo,
        "doctor.Qualification.Degree":req.body.degree,
        "doctor.Qualification.College":req.body.college,
        "doctor.Qualification.Year":req.body.year,
        "doctor.Registration.RegNumber":req.body.regno,
        "doctor.Registration.Name":req.body.regname,
        "doctor.Registration.Year":req.body.regyear,
        "doctor.Service.Name":req.body.servicename,
        "doctor.Specialization.Name":req.body.specializationname
    }, function(err){
        if(err) res.json(err);
        else res.redirect('/doc_profile');
    });
});

app.get('/localdoctors', isLoggedIn, function(req, res){
    doctor = false;
    patient = true;
    patientName = req.user.patient.username;
   // console.log("i m in local doctors get");
    //console.log(req.user.id);
  
    User.find({}, function(err, docs){
        //console.log(docs);
      //  console.log("I m in user.find");
      
        if(err) res.json(err);
        else res.render('local_doctors.ejs', {doctors: docs});
    });
});


app.get('/callocaldoctor/:id', function(req, res){
     User.find({'_id': req.params.id}, function(err, docs){
       // console.log(req.params.id);
        localdoctorId = req.params.id;
       
       // console.log(docs);
        //console.log(docs);
        res.render('cal_local_doctor.ejs', {doctor: docs});
    });
})

app.get('/delhidoctors',isLoggedIn, function(req, res){

    //console.log("req.user:"+req.user);

        DelhiDoctors.find({}, function(err, docs){
            //console.log(docs);
            if(err) res.json(err);
            //else res.render('delhidoctors.ejs');
            else res.render('home.ejs', {doctors: docs});
        }); 
 });

 app.post('/delhidoctors', function(req, res){     
        //Doctor.find({'name': {'$regex': '.*'+req.body.search+'.*'}}, function(err, docs){ 
        //Doctor.dropIndex("$**_text");
        //Doctor.createIndex({"$**": "text"});
        //console.log(req.body.search);
        DelhiDoctors.find({$text: {$search: req.body.search}}, function(err, docs){      
            Doctors_list = docs;
            //console.log(Doctors_list);
            if(err) res.json(err);
            else {                
                res.render('posthome.ejs', {doctors: docs});
            }
        });       
        //Doctor.dropIndex("$**_text");

 });

 app.get('/search', function(req, res){
  

 });

 app.post('/search', function(req, res){
    var result = [];
    var finalresult = [];
    
    for (var i=0; i<Doctors_list.length; i++){      
        result = Doctors_list[i];      
        if (result.toString().indexOf(req.body.search) != -1){
            finalresult.push(result);
        }
        else{
          
        }       

    }
    if (finalresult.length == 0){
        //console.log("No match found for "+req.body.search);
    }
 
    res.render('search.ejs', {doctors: finalresult});

 })

 app.get('/caldoctor', isLoggedIn, function(req, res){
    //console.log("doctor name"+doctorName);
    //console.log("patient name"+patientName);
    //console.log(loggedInUserId);
    //console.log(localdoctorId);
    //res.send("I want to cal doctor irrespective of fee");
    //video calling with local doctor
    if(patient){
      //  console.log("i m patient");
        res.render('video.ejs', {name: patientName, id: localdoctorId, callername: doctorName});
    }
    else{
      //  console.log("I m doctor");
        res.render('video.ejs', {name: doctorName, id: req.user.id, callername: patientName});
    }
       
    //video calling with delhi doctor
    /*DelhiDoctors.find({'_id': loggedInUserId}, function(err, docs){
        res.render('video.ejs', {doctor: docs});
    });*/
 });

 
app.get('/call/:id', function(req, res){
   
    DelhiDoctors.find({'_id': req.params.id}, function(err, docs){
      //  console.log(req.params.id);
        //loggedInUserId = req.params.id;
        //console.log(loggedInUserId);
        //console.log(docs);
        res.render('call.ejs', {doctor: docs});
    });
    
});
 

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/delhidoctors',
        failureRedirect: '/'
       // passReqToCallback:true
})); 



app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/delhidoctors',
        failureRedirect: '/'
       // passReqToCallback:true
})); 

app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
});

};

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        //console.log("logged in user");
        return next();
    }
    else{
        //console.log("user is not authenticated");
    }
    res.redirect('/');
}

