var userModel = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var userlib = function () { };

userlib.hashPassword = function (password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password);
    return hash;
}

userlib.comparePassword = function (pwd, actual, callback) {
    bcrypt.compare(pwd, actual, function (err, isMatch) {
        if (err) callback(err);
        callback(null, isMatch);
    });
}

userlib.authenticate = function (username, password, callback) {
    var lib = this;
    var user = userModel.findOne({ userName: username },
        function (err, user) {
            if (err) {
                callback(err, null, false);
            } else {
                if (user) {
                    var hash = lib.hashPassword(password);
                    lib.comparePassword(password, user.password, function (err, isMatch) {
                        if (err) callback(err, null, false);
                        callback(null, user, isMatch);
                    });
                }
            }
        });
}

userlib.validate = function (userInfo, callback) {
    this.find({ email: userInfo.email }, function (err, user) {
        if (err) {
            callback(true, "Email already exists");
        }
        if (userInfo.userName && userInfo.userName.trim().indexOf(' ') > 0) {
            callback(false, "Username may not contain spaces");
        } else if (userInfo.email && userInfo.email.trim().indexOf(' ') > 0) {
            callback(false, "Email may not contain spaces");
        } else if (!userInfo.password) {
            callback(true, "Password may not be empty");
        } else {
            callback(false, "Success");
        }
    });
}

userlib.save = function (userInfo, callback) {
    var thislib = this;
    this.find({ userName: userInfo.userName }, function (err) {
        if (err) {
            return "User already exists";
        } else {
            thislib.validate(userInfo, function (isInvalid, msg) {
                if (isInvalid) {
                    callback(true, msg);
                    return;
                }
                var user = new userModel({
                    userName: userInfo.userName,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    email: userInfo.email,
                    password: thislib.hashPassword(userInfo.password),
                    location: userInfo.location,
                    dateOfBirth: userInfo.dateOfBirth
                });
                user.validate().then(function (response) {
                    user.save(callback);
                });

            });
        }
    });

}

userlib.find = function (condition, callback, projection) {
    if (projection) {
        userModel.findOne(condition, projection,
            function (err, user) {
                if (err) {
                    callback(true);
                } else if (user) {
                    callback(true, user);
                } else {
                    callback(false);
                }
            });
    } else {
        userModel.findOne(condition,
            function (err, user) {
                if (err) {
                    callback(true);
                } else if (user) {
                    callback(true, user);
                } else {
                    callback(false);
                }
            });
    }
}

userlib.getMatchList = function (user, callback) {
    var nearbyUsers = [];
    //get matches based on country
    userModel.find({ 'location.terms.value': user.location.terms[2].value, userName: { $ne: user.userName } }, function (err, users) {
        if (err) return err;
        if (users) {
            nearbyUsers.push({ "Type": "Country", "Name": user.location.terms[2].value, "Users": users });
        }
        userModel.find({ 'location.terms.value': user.location.terms[1].value , userName: { $ne: user.userName } }, function (err, users) {
            if (err) return err;
            if (users) {
                nearbyUsers.push({ "Type": "State", "Name": user.location.terms[1].value, "Users": users });
                userModel.find({ 'location.terms.value': user.location.terms[0].value, userName: { $ne: user.userName }  }, function (err, users) {
                    if (err) return err;
                    nearbyUsers.push({ "Type": "City", "Name": user.location.terms[0].value, "Users": users });
                    callback(nearbyUsers);
                });
            }

        });
    });
}

userlib.getToken = function (user) {
    //Generate the token and send it back.
    var token = jwt.sign({ id: user._id, expires: Math.floor(Date.now() / 1000) - 30 }, config.secret);
    return token;
}

module.exports = userlib;