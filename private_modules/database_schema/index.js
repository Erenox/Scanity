"use strict";
/* database_schema private module
 * -Contain all schemas of database
 */

/*
* Modules
*/
var mongoose = require('mongoose');

/*
* Const
*/
const Schema = mongoose.Schema;   // define Schema type

//<editor-fold desc="audits schema & model region">
var audits = new Schema({

    // about the audit
    user_uid:       { type: String,  trim: true,  required: true,  unique: true,  dropDups: true  },
    date:           { type: Date,    trim: false, required: true,  unique: false, dropDups: false },
    display:        { type: Boolean, trim: false, required: true,  unique: false, dropDups: false },
    main_target:    { type: String,  trim: false, required: true,  unique: false, dropDups: false },

    // about the audit target
    target:
    {
        domain:     {type: String, trim: true,  required: false, unique: false, dropDups: false },
        host:       {type: String, trim: true,  required: false, unique: false, dropDups: false },
        location:   {type: String, trim: false, required: false, unique: false, dropDups: false }
    },

    // about the result
    results:
    [{
        tool:   {  type:String, trim:true, required:true, unique:false, dropDups:false },
        status: {  type:Number, trim:true, required:true, unique:false, dropDups:false, min:0, max:1}
    }]

});
var audits_model = mongoose.model('audits',audits);
exports.audits = audits;
exports.audits_model = audits_model;
//</editor-fold>