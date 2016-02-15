var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userSchema = mongoose.Schema({
	local: {
		username: String,
		password: String
	},
	google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    patient: {
        username: String,
        password: String
    }, 
    doctor: {
        profileUpdateCount: Number,
        local: {
            username: String,
            password: String
            },
        Address: {
            FullAddress: String,
            Pin: String,
            City: String,
            Country: String, 
            Latitude: String,
            Longitude: String
        },
        Award: {
            Name: String,
            Year: String
        },
        Details: {
            Name: String,
            Email: String,
            password: String,
            PhoneHome: String,
            PhoneOffice: String,
            Mobile: String,
            City: String,
            Country: String,
            Photo: String,
            Fee: Number
        },
        Membership: {
            Name: String
        },
        Organisation: {
            Name: String,
            Phone: String,
            Mobile: String,
            Logo: String
        },
        Qualification: {
            Degree: String,
            College: String,
            Year: String
        },
        Registration: {
            RegNumber: String,
            Name: String,
            Year: String
        },
        Service: {
            Name: String
        },
        Specialization: {
            Name: String
        }
    }
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validpatientPassword = function(password){
	return bcrypt.compareSync(password, this.patient.password);
}

userSchema.methods.validdoctorPassword = function(password){
    return bcrypt.compareSync(password, this.doctor.local.password);
}

module.exports = mongoose.model('Users', userSchema);