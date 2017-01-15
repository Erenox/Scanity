"use strict";
/* audit manager private module
 * -Manage the audits on database
 * -Created by : Erenox the : 30/09/2016
 * -Last update : 14/01/2017
 */

/*
* Modules
*/
var async = require('async');
var ObjectID = require('mongodb').ObjectID;

/*
* Private Modules
*/
var database_queries = require('../database_queries');
var audit_profile = require('../audit_profile');


//<editor-fold desc="module.exports.new_audit">
/*
*insert audit data on database
*/
module.exports.new_audit = function(client, inputs, parameters, callback)
{
    var id_collection = // an array of Foreign-keys
    {
        user: null,      // FK of users collection
        target: null,    // FK of targets collection
        result: null     // FK of results collection
    };

    async.parallel(
    [
        //<editor-fold desc="async : get or insert current user.">
        function (callback)
        {
            database_queries.get_id_by_user_uid(client.uid, function (id)
            {
                if (id)
                {
                    id_collection.user = new ObjectID(id);
                    callback(null); // --> err : null
                }
                else 
                {
                    database_queries.insert_user_get_id(client.uid, function (id)
                    {
                        if (id) 
                        {
                            id_collection.user = new ObjectID(id);
                            callback(null); // --> err : null
                        }
                        else 
                        {
                            // error : 500 internal server error
                            callback(new Error(500));
                        }
                    });
                }
            });
        },
        //</editor-fold>

        //<editor-fold desc="async : insert target data.">
        function (callback)
        {
            database_queries.insert_target_get_id(inputs['domain'], inputs['host'], parameters['location'], function (id)
            {
                if (id)
                {
                    id_collection.target = new ObjectID(id);
                    callback(null); // --> err : null
                }
                else
                {
                    // error : 500 internal server error
                    callback(new Error(500));
                }

            });
        },
        //</editor-fold>

        //<editor-fold desc="async : insert result data.">
        function (callback)
        {
            audit_profile.get_profile(parameters.profile, function (scanners)
            {
                if(scanners) 
                {
                    database_queries.insert_result_get_id(function (id) 
                    {
                        if (id) 
                        {
                            id_collection.result = new ObjectID(id);

                            scanners.forEach(function(scanner)
                            {
                                database_queries.add_result_set_by_id(id_collection.result, scanner, 0);
                            });
                            
                            callback(null); // --> err : null
                        }
                        else 
                        {
                            // error : 500 internal server error
                            callback(new Error(500));
                        }
                    });
                }
                else 
                {
                    // error : 500 internal server error
                    callback(new Error(500));
                }
            });
        }
        //</editor-fold>
    ],
    //<editor-fold desc="async : insert audit data. (req none)">
    function(err)
    {
        if(err)
        {
            callback(null);
        }
        else
        {
            database_queries.insert_audit_get_id(id_collection, inputs[parameters.type], parameters.display, function (audit_id) 
            {
                if (audit_id)
                {
                    callback(audit_id);
                }
                else 
                {
                    callback(null);
                }
            });
        }
    });
    //</editor-fold>
};
//</editor-fold>

//<editor-fold desc="module.exports.get_audit_data_header">
/*
* Get audit target headers from database
*/
module.exports.get_audit_data_header = function(audit_id, callback)
{
    var audit_data =
    {
        date:null,          // audit header date
        host:null,          // audit header ip
        domain:null,        // audit header domain
        country_code:null,  // audit header country_code
        location:null,      // audit header location
        user_uid:null,      // audit header user uid
        result:null
    };

    database_queries.get_audit_by_id(audit_id,function(audit) // get audit by id
    {
        if(!audit) // error 422 : audit not exist
        {
            var err = new Error('Unprocessable Entity');
            err.status = 422;
            callback(err,null);
        }
        else
        {
            audit_data.date = audit['date'];

            async.parallel(
            [
                function(callback)
                {
                   // get the target by foreign key
                  database_queries.get_target_by_id(audit['target_id'],function(target)
                  {
                      if(!target) // error 500
                      {
                          callback(500);
                      }
                      else // OK
                      {
                          audit_data.host = target['host'];
                          audit_data.domain = target['domain'];
                          audit_data.location = target['location'];
                          audit_data.country_code = audit_data.location.substr(0, 2).toLowerCase();
                          callback(null);
                      }
                  });
                },
                
                function(callback)
                {
                    // get the user by foreign key
                    database_queries.get_user_uid_by_id(audit['user_id'],function (user)
                    {
                        if(!user) // error 500
                        {
                            callback(500);
                        }
                        else // OK
                        {
                            audit_data.user_uid = user['uid'];
                            callback(null);
                        }
                    });
                },

                // get the results by foreign key
                function(callback)
                {
                    database_queries.get_result_by_id(audit['result_id'],function(result)
                    {
                        if(!result)
                        {
                            callback(500);
                        }
                        else
                        {
                            audit_data.result = result;
                            callback(null);
                        }
                    });
                }

            ],
            function(error)
            {
                if(error) // error 500
                {
                    var err = new Error('Internal server error');
                    err.status = 500;
                    callback(err, null);
                }

                callback(null, audit_data); // OK
            });
        }
    });
};
//</editor-fold>