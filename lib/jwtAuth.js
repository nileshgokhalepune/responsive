var userLib = require('./userlib');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

module.exports = function (req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['authorization'];

    if (token) {
        if (token.indexOf('Bearer') !== -1)
            token = token.split(' ')[1];
        try {
            var decoded = jwt.decode(token, config.s4ecret);
            userLib.find({ _id: decoded.id }, function (success, user) {
                if (success) {
                    req.user = user;
                    if (!user.image) user.image = "/user/image/noimage.png"
                    req.isauthenticated = true;
                    return next();
                } else {
                    res.send(401);
                }
            }, { password: 0 });
        } catch (err) {
            return next();
        }
    } else {
        return next();
    }
}