var mongoose = require('mongoose');
var database = require('../config/config');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    name:{
        type:String,
        unique: true,
        required:true
    },
    type:{
        type:String,
        required: true
    }
});

var locationModel = mongoose.model('Locations',locationSchema);

module.exports = locationModel;