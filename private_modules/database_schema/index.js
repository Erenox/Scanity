"use strict";
/* database_schema private module
 * -Contain all schemas of database
 * -Created by : Erenox the : 06/07/2016
 * -Last update : 14/01/2017
 */

/*
* Modules
*/
var mongoose = require('mongoose');

/*
* Const
*/
const Schema = mongoose.Schema;   // define Schema type
const ObjectId = Schema.ObjectId; // define ObjectId type

/*
* Schema & Model
*/

//<editor-fold desc="users schema & model region">
var users = new Schema({
    uid:            { type:String,  trim:true,  required:true,  unique:true,  dropDups:true }
});

var users_model = mongoose.model('users',users);
//</editor-fold>

//<editor-fold desc="audits schema & model region">
var audits = new Schema({
    user_id:        { type:ObjectId }, // FK to link users collection
    target_id:      { type:ObjectId }, // FK to link targets collection
    result_id:      { type:ObjectId }, // FK to link results collection
    target_main:    { type:String,  trim:true,  required:true, unique:false, dropDups:false },
    date:           { type:Date,    trim:false, required:true, unique:false, dropDups:false },
    private:        { type:Boolean, trim:false, required:true, unique:false, dropDups:false }
});
var audits_model = mongoose.model('audits',audits);
//</editor-fold>

//<editor-fold desc="targets schema & model region">
var targets = new Schema({
    domain:   { type:String,  trim:true,  required:false, unique:false, dropDups:false },
    host:     { type:String,  trim:true,  required:false, unique:false, dropDups:false },
    location: { type:String,  trim:false, required:false, unique:false, dropDups:false }
});
var targets_model = mongoose.model('targets',targets);
//</editor-fold>

//<editor-fold desc="results schema & model region">
var results = new Schema({
    scanners:
    {
            name:   {  type:String, trim:true, required:true, unique:false, dropDups:false },
            status: {  type:Number, trim:true, required:true, unique:false, dropDups:false, min:0, max:1 }
    }
});
var results_model = mongoose.model('results',results);
//</editor-fold>

/*
*   Export Zone 
*/

//<editor-fold desc="Export Schemas">
exports.users = users;
exports.audits = audits;
exports.targets = targets;
exports.results = results;
//</editor-fold>

//<editor-fold desc="Export Models">
exports.users_model = users_model;
exports.audits_model = audits_model;
exports.targets_model = targets_model;
exports.results_model = results_model;
//</editor-fold>
