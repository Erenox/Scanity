"use strict";
/* database_query private module
 * -Contain all queries of database
 */

/*
* Modules
*/
var ObjectId = require("mongodb").ObjectID;

/*
* Private Modules
*/
var database_connector = require("../database_connector");

//<editor-fold desc="queries region">

    //<editor-fold desc="Zone : manage audit and results">

        //<editor-fold desc="query : insert_audit_get_id">
        module.exports.insert_audit_get_id = function(user_uid, inputs, parameters, callback)
        {
            database_connector.connect(function (db) // instance a database connection
            {
                db.collection('audits').insertOne(
                {
                    // audit sub-document
                    "user_uid"      : user_uid,
                    "date"          : new Date(),
                    "display"       : parameters.display,
                    "main_target"   : inputs[parameters.type],

                    // target sub-document
                    "target" :
                    {
                        "domain"    : inputs.domain,
                        "host"      : inputs.host,
                        "location"  : parameters.location
                    }
                },
                function(err,Obj)
                {
                    database_connector.disconnect(db); // close the DB instance

                    if(!err)
                    {
                        callback(Obj.insertedId);
                    }
                    else
                    {
                        callback(null);
                    }
                });
            });
        };
        //</editor-fold>

        //<editor-fold desc="query : get_audit_by_id">
        module.exports.get_audit_by_id = function(id, callback)
        {
            database_connector.connect(function(db) //  instance a database connection
            {
                db.collection('audits').findOne({_id: ObjectId(id)}, function(err, audit)
                {
                    database_connector.disconnect(db); // close the opened database connection

                    if(!err)
                    {
                        callback(audit);
                    }
                    else
                    {
                        callback(null);
                    }
                })
            });
        };
        //</editor-fold>

        //<editor-fold desc="query : set_results">
        module.exports.add_results = function(audit_id, tool)
        {
            database_connector.connect(function (db) // close the opened database connection
            {
                db.collection('audits').update({_id: audit_id}, { $addToSet: { results: { tool: tool, status: 0 } } }, {upsert: true} , function()
                {
                    database_connector.disconnect(db); // close the DB instance
                });
            });
        };
        //</editor-fold>

        //<editor-fold desc="query : update_results">
        module.exports.update_results = function(audit_id, tool)
        {
            database_connector.connect(function (db) // close the opened database connection
            {
                db.collection('audits').update( {_id: audit_id, "results.tool" : tool }, {$set: { "results.$.status": 1} }, function()
                {
                    database_connector.disconnect(db); // close the DB instance
                });
            });
        };
        //</editor-fold>


    //</editor-fold>

    //<editor-fold desc="Zone : check interval timing">

    //<editor-fold desc="query : check_audit_user_interval">
    module.exports.check_audit_user_interval = function(user_uid, INTERVAL, callback)
    {
        database_connector.connect(function(db) // instance a database connection
        {
            db.collection('audits').count({ user_uid: user_uid , date: { $gt: new Date(new Date().getTime() - INTERVAL) } },function(err, audit)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(audit != 0)
                {
                    callback(true);
                }
                else
                {
                    callback(false);
                }
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="query : check_audit_target_interval">
    module.exports.check_audit_target_interval = function(main_target, INTERVAL,  callback)
    {
        database_connector.connect(function(db) // instance a database connection
        {
            db.collection('audits').count({main_target: main_target, date: { $gt: new Date(new Date().getTime() - INTERVAL) } },function(err, audit)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(audit != 0)
                {
                    callback(true);
                }
                else
                {
                    callback(false);
                }
            });
        })
    };
    //</editor-fold>

    //</editor-fold>

    //<editor-fold desc="Zone : check archives">

    //<editor-fold desc=" query : get_archives">
    module.exports.get_archives = function(callback)
    {
        database_connector.connect(function(db) // instance a database connection
        {
            db.collection('audits').find({}, {__v: 0, user_uid: 0, target: 0, results: 0 }).limit(12).sort({date: -1}).toArray(function (err, archive)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err)
                {
                    callback(archive);
                }
                else
                {
                    callback(null);
                }

            });
        });
    };
    //</editor-fold>

    //<editor-fold desc=" query : get_custom_archives">
    module.exports.get_custom_archives = function(target, callback)
    {
        database_connector.connect(function(db) // instance a database connection
        {
            db.collection('audits').find( {main_target: target}, { __v: 0, user_uid: 0, target: 0, results: 0}).limit(12).sort({date: -1}).toArray(function (err, archive)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err)
                {
                    callback(archive);
                }
                else
                {
                    callback(null);
                }
            });
        });
    };
    //</editor-fold>

    //</editor-fold>

//</editor-fold>
