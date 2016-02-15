var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var doctorSchema = mongoose.Schema({ 
        phone: Array, 
        address: String,
        specilisation: Array,
        location: String,
        name: String,
        email: String,
        fee: Number
});

module.exports = mongoose.model('Doctor', doctorSchema);

//appID = 430193130520332
//appSecret = 4e3f8e017b965f2ef745f896a8c792d4