var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require("express-session");
var passport = require('passport');
var flash = require('connect-flash');

var patientSocketId;



require('./config/passport.js')(passport);

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(configDB.url, function(err, db){
	if(!err){
		//db.collection("doctors").dropIndex("$**_text");
		//db.collection("doctors").createIndex({name: "text", location: "text", specialisation: "text"},{weights: {location: 5, specialisation: 5, name: 2}, name: "TextIndex"})
		/*db.collection("doctors").ensureIndex({"$**":"text"}, 
        function(err, result) {        
            db.close();
        });*/
        //db.collection("doctors").update({}, {$set: {"fee": 299}}, {multi: true});
		console.log("we are connected to mongodb");
	}
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
                 saveUninitialized: true, 
                 resave: true}));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

require('./app/routes.js')(app, passport);

io.sockets.on('connection', function(socket) {

    //console.log(socket.id);


socket.on('notify', function(msg){
   // console.log("I m in notify on");
    //console.log(msg);
    socket.broadcast.emit('notify', msg);     

    
});

socket.on('unavailable', function(msg){
   // console.log(msg);
   // console.log(socket.id);
   //console.log("patientSocketId"+patientSocketId);
   //console.log(socket.id+"socket.id");
    io.sockets.connected[patientSocketId].emit('unavailable', msg);

})



  //  console.log("I m in socket connection");
   // console.log("socket id: "+socket.id);
    //console.log(socket.toString());

    socket.on('message', function(message) {
        //console.log("socket.on-message");
        socket.broadcast.emit('message', message);
    });

       socket.on('chat', function(message) {
           // console.log("socket.on-chat");
            socket.broadcast.emit('chat', message);
       });

        socket.on('create or join', function(room) {
    	//console.log("create or join");

         var clients = io.sockets.adapter.rooms[room];
         console.log("clients: "+clients);
         var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
         console.log("Number of clients: "+numClients);


        if (numClients === 0) {
            patientSocketId = socket.id;
            //console.log(patientSocketId+"patientSocketId");

           // console.log("num of clients = 0");
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients == 2) {
           // console.log("num of clients = 1");
            io.sockets. in (room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room);
        } else {
            socket.emit('full', room);
        }
        socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
        socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

    });

});


server.listen(port);




