"use strict";
/* database_query private module
 * -Contain all queries of database
 * -Created by : Erenox the : 06/07/2016
 * -Last update : 14/01/2017
 */

/*
* Modules
*/
var ObjectId = require("mongodb").ObjectID;

/*
* Private Modules
*/
var database_connector = require("../database_connector");
var database_schema = require("../database_schema");


/*
* Queries Zone (organized by region)
*/
//<editor-fold desc="audits queries region">

    //<editor-fold desc="query : insert_audit_get_id">
    module.exports.insert_audit_get_id = function(f_keys, target_main, priv, callback)
    {
        database_connector.connect(function (db) // instance a database connection
        {
            db.collection('audits').insert({user_id: f_keys.user, target_id: f_keys.target, result_id: f_keys.result, target_main: target_main, date: new Date(), private: priv}, function (err, query)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err)
                {
                    callback(query['insertedIds'].shift());
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

    //<editor-fold desc=" query : get_latest_audit_archives">
    module.exports.get_latest_audit_archives = function(callback)
    {
        database_connector.connect(function(db) // instance a database connection
        {
            db.collection('audits').find({}, {user_id: 0, target_id: 0, result_id: 0, __v: 0}).limit(12).sort({date: -1}).toArray(function (err, archive)
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

    //<editor-fold desc=" query : get_latest_audit_by_search">
    module.exports.get_latest_audit_by_search = function(input, callback)
    {
        database_connector.connect(function(db) // instance a database connection
        {
            db.collection('audits').find( {target_main: input}, {user_id: 0, target_id: 0, result_id: 0, __v:0}).limit(12).sort({date: -1}).toArray(function (err, archive)
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

    //<editor-fold desc="query : get_audit_by_interval_and_user_id">
    module.exports.get_audit_by_interval_and_user_id = function(_id, INTERVAL, callback)
    {
        database_connector.connect(function(db) // instance a database connection
        {
            db.collection('audits').aggregate([ {$match : { $and: [{user_id: _id } , { date: { $gt: new Date(new Date().getTime() - INTERVAL) } } ] } },
            {
                $lookup: // join : audits : users via user_id
                {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'users'
                }

            }]).next(function(err, audit)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err && audit != null)
                {
                    callback(true)
                }
                else
                {
                    callback(false);
                }
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="query : count_audit_by_interval_and_target_main">
    module.exports.count_audit_by_interval_and_target_main = function(target_main, INTERVAL,  callback)
    {
        database_connector.connect(function(db) // instance a database connection
        {
            db.collection('audits').count({target_main: target_main, date: { $gt: new Date(new Date().getTime() - INTERVAL) } },function(err, audit)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err && audit != 0)
                {
                    callback(true)
                }
                else
                {
                    callback(false);
                }
            });
        })
    };
    //</editor-fold>

    //<editor-fold desc="query : get_result_id_by_audit_id">
    module.exports.get_result_id_by_audit_id = function(id, callback)
    {
        database_connector.connect(function(db) //  instance a database connection
        {
            db.collection('audits').findOne({_id: ObjectId(id)}, {_id: 0, user_id: 0, target_id: 0, target_main: 0, date: 0, private: 0}, function(err, audit)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err && audit)
                {
                    callback(audit.result_id);
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

//<editor-fold desc="targets queries region">

    //<editor-fold desc=" query : insert_target_get_id">
    module.exports.insert_target_get_id = function(domain, host, location, callback)
    {
        database_connector.connect(function (db) // instance a database connection
        {
            db.collection('targets').insert({domain: domain, host: host, location: location}, function (err, query)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err)
                {
                    callback(query['insertedIds'].shift()); // return the query Objectid
                }
                else
                {
                    callback(null);
                }
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="query : get_target_by_id">
    module.exports.get_target_by_id = function(id, callback)
    {
      database_connector.connect(function(db) // instance a database connection
      {
         db.collection('targets').findOne({_id: id },function(err, target)
         {
            database_connector.disconnect(db); // close the opened database connection

            if(err)
            {
                callback(null);
            }
            else
            {
                callback(target);
            }

         });
      });
    };
    //</editor-fold>

//</editor-fold>

//<editor-fold desc="users queries region">

    //<editor-fold desc="query : insert_user_get_id">
    module.exports.insert_user_get_id = function(uid, callback)
    {
        database_connector.connect(function (db) // instance a database connection
        {
            db.collection('users').insert({uid: uid}, function(err, query)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err)
                {
                    callback(query['insertedIds'].shift()); // return the query Objectid
                }
                else
                {
                    callback(null)
                }
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="query : get user uid by user id">
    module.exports.get_user_uid_by_id = function(id, callback)
    {
        database_connector.connect(function (db) // instance a database connection
        {
            db.collection('users').findOne({_id: id}, {_id: 0, __v : 0}, function(err, user)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err)
                {
                    callback(user);
                }
                else
                {
                    callback(null);
                }
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="query : get_user_by_uid">
    module.exports.get_user_by_uid = function(uid, callback)
    {
        database_connector.connect(function (db) // instance a database connection
        {
            db.collection('users').findOne({uid: uid},{__v: 0}, function (err, user)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err)
                {
                    callback(user);
                }
                else
                {
                    callback(null);
                }
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="query : get_id_by_user_uid">
    module.exports.get_id_by_user_uid = function(uid, callback)
    {
        database_connector.connect(function (db) // instance a database connection
        {
            db.collection('users').findOne({uid: uid}, {uid: 0, __v: 0 }, function (err, user)
            {
                database_connector.disconnect(db); // close the opened database connection

                if (err || !user)
                {
                    callback(null);
                }
                else
                {
                    callback(user._id);
                }
            });
        });
    };
    //</editor-fold>

//</editor-fold>

//<editor-fold desc="results queries region">

    //<editor-fold desc="query : insert_result_get_id">
    module.exports.insert_result_get_id = function(callback)
    {
        database_connector.connect(function (db) // instance a database connection
        {
            db.collection('results').insert({},function(err, query)
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err)
                {
                    callback(query['insertedIds'].shift()); // return the query Objectid
                }
                else
                {
                    callback(null);
                }
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="query : add_result_set_by_id">
    module.exports.add_result_set_by_id = function(id, name, status)
    {
        database_connector.connect(function (db) // close the opened database connection
        {
            db.collection('results').update({_id: id}, {$addToSet: { scanners: { name: name, status: status } } }, {upsert: true},function()
            {
                database_connector.disconnect(db); // return the query Objectid
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="query : update_result_set_by_id">
    module.exports.update_result_by_id = function(id, name, status)
    {
        database_connector.connect(function (db) // close the opened database connection
        {
            db.collection('results').update( {_id: new ObjectId(id), 'scanners.name' : name } , {$set : {'scanners.$.status' : status} }, true, true, function()
            {
                database_connector.disconnect(db);
            });
        });
    };
    //</editor-fold>

    //<editor-fold desc="query : get_result_get_id">
    module.exports.get_result_by_id = function(id, callback)
    {
        database_connector.connect(function (db) // close the opened database connection
        {
            db.collection('results').findOne({_id: id}, {_id: 0}, function(err, result) // .toArray()
            {
                database_connector.disconnect(db); // close the opened database connection

                if(!err)
                {
                    callback(result);
                }
                else
                {
                    callback(null)
                }
            });
        });
    };
    //</editor-fold>

//</editor-fold>
