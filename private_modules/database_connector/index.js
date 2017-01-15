"use strict";
/* database_connector private module
* -Contain Mongodb connection pool
* -Created by : Erenox the : 06/07/2016
* -Last update : 14/01/2017
*/

/*
* Modules
*/
var mongoose = require('mongoose');
var env = require('../../app.js').env;

/*
* CONST
*/
const connection_string = 'mongodb://localhost:27017/scanity';

/*
* mongoose configuration
*/
mongoose.Promise = global.Promise;

//<editor-fold desc="module.exports.connect">
/*
* instance a connection to mongodb
*/
module.exports.connect = function(callback)
{
    var db = mongoose.createConnection(connection_string);

    db.once('open', function ()
    {
        if (env === 'development')
            console.log('[OK] - Open connection with database.');
        
        callback(db);
    });

    db.on('error', function (err)
    {
        if (env === 'development')
            console.log('[ERROR] - Open connection with database.');
        
        callback(err);
    });

};
//</editor-fold>

//<editor-fold desc="module.exports.disconnect">
/*
* safely close mongodb connection
*/
module.exports.disconnect = function(db)
{
    if(db.close())
    {
        if (env === 'development')
            console.log("[OK] - Close connection with database.");
    }
    else
    {
        if (env === 'development')
            console.log("[ERROR] - Close connection with database.");
    }
};
//</editor-fold>