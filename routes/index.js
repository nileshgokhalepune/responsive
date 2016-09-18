var express = require('express');
var router = express.Router();
var request = require('request');
var database = require('../config/config');
var userlib = require('../lib/userlib');

router.get('/', function (req, res, next) {
    console.log(Date.now());
    next();
});

router.post('/user/save', function (req, res, next) {
    userlib.save(req.body.userInfo, function (err, msg) {
        if (err) {
            return res.json({ success: false, message: msg });
        } else {
            return res.json({ success: true, message: 'Ready to rock' });
        }
    });
});

router.get('/user/exists/:search', function (req, res, next) {
    userlib.find({ userName: req.params.search }, function (result) {
        if (result) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    })
});

router.get('/user/email/exists/:email', function (req, res, next) {
    userlib.find({ email: req.params.email }, function (result) {
        if (result) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    });
});

router.get('/locations/find/:search', function (req, res, next) {
    var searctText = req.params.search;
    console.log(database.googleApiKey);
    var placesApi = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=';
    console.log(placesApi + searctText + '&types=(cities)&key=' + database.googleApiKey);
    //'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Nashv&types=(cities)&key=AIzaSyCyDpWxW1as1FPyuJ7kcgr7FzJUKWcENNo'
    request({
        url: placesApi + searctText + '&key=' + database.googleApiKey,
        method: 'GET'
    },
        function (e, r, body) {
            var places = JSON.parse(body);
            console.log(places);
            res.json(places.predictions);
        });
});

router.get('/matches', function (req, res, next) {
    userlib.getMatchList(req.user, function (nearbyusers) {
        res.json(nearbyusers);
    });
});

router.get('/userInfo', function (req, res, next) {
    if (req.user) {
        res.json(req.user);
    } else {
        res.send(404);
    }
});

router.get('/distictplaces/:type', function (req, res, next) {
    var params = req.params["type"];
    if (params === "Country") {
        userlib.distinct("location.terms.value", null, function (data) {
            res.json({ success: true, countries: data });
        });
    }
});

module.exports = router;