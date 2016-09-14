var express = require('express');
var others = express.Router();

others.get('/', function (req, res, next) {
    res.render('index', { title: 'Network' });
});


module.exports = others;