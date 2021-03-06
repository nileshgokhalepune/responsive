var express = require('express');
var path = require('path');
var router = express.Router();
var request = require('request');
var database = require('../config/config');
var userlib = require('../lib/userlib');

router.get('/', function (req, res, next) {
    console.log(Date.now());
    next();
});

router.post('/user/save', function (req, res, next) {
    getPlaceDetails(req.body.userInfo.location);
    userlib.save(req.body.userInfo, function (err, msg) {
        if (err) {
            return res.json({ success: false, message: msg });
        } else {
            return res.json({ success: true, message: 'Ready to rock' });
        }
    });
});

router.get('/user/image', function (req, res, next) {
    var imagename = req.query.image;
    var imagePath;
    if (req.user) {
        //    imagePath = path.join(__dirname, 'images', imagename);
        imagePath = path.join(__dirname, "../", "images", imagename); //path.join('/', 'images', imagename);
    } else {
        imagePath = path.join(__dirname, "../", "images", "noimage.png"); //path.join('/', 'images', "noimage.png");
        //imagePath = path.join(__dirname, 'images', "noimage.png");
    }
    res.sendFile(imagePath);
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
            if (places && places.predictions && places.predictions.length > 0) {
                getPlaceDetails(places.predictions[0], function (data) {

                });
            }

        });
});

router.get('/matches', function (req, res, next) {
    userlib.getMatchList(req.user, function (nearbyusers) {
        res.json(nearbyusers);
    });
});

router.get('/userInfo', function (req, res, next) {
    if (req.user) {
        var user = req.user.toObject();
        if (!user.image) user.image = encodeURI("/api/user/image?image=noimage.png");
        res.json(user);
    } else {
        res.send(404);
    }
});

router.get('/distictplaces/:type', function (req, res, next) {
    var params = req.params["type"];
    if (params === "Country") {
        userlib.distinct(2, null, function (data) {
            res.json({ success: true, data: data, type: 'Country' });
        });
    } else if (params === "State") {
        userlib.distinct(1, null, function (data) {
            res.json({ success: true, data: data, type: 'State' })
        });
    }
});

function getPlaceDetails(place, callback) {
    var placeDetailApi = "https://maps.googleapis.com/maps/api/place/details/json?";
    var placeid = "placeid=" + place.place_id;
    var apikey = "&key=" + database.googleApiKey;
    request.get({
        url: placeDetailApi + placeid + apikey,
        method: 'GET'
    },
        function (e, r, body) {
            var place = JSON.parse(body);
            callback(place.result.geometry.location);
            debugger;
        });
}

module.exports = router;