"use strict";
/* audit manager private module
 * -Manage the audits on database
 */

/*
* Modules
*/
var async = require('async');

/*
* Private Modules
*/
var database_queries = require('../database_queries');
var audit_profile = require('../audit_profile');


//<editor-fold desc="module.exports.new_audit">
/*
*insert audit data on database
*/
module.exports.new_audit = function(user, inputs, parameters, callback)
{
    audit_profile.get_profile(parameters.profile, function (tools)
    {
        if(tools)
        {
            database_queries.insert_audit_get_id(user.uid, inputs, parameters, function(audit_id)
            {
                if(audit_id)
                {
                    async.eachSeries(tools, function (tool, next)
                    {
                        database_queries.add_results(audit_id, tool);
                        next();
                    },
                    function()
                    {
                        callback(audit_id);
                    });
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
};
//</editor-fold>

//<editor-fold desc="module.exports.get_audit_data_header">
/*
* Get audit target headers from database
*/
module.exports.get_audit_data = function(audit_id, callback)
{

    database_queries.get_audit_by_id(audit_id, function(audit) // get audit by id
    {
        if (!audit) // error 422 : audit not exist
        {
            var err = new Error('Unprocessable Entity');
            err.status = 422;
            callback(err, null);
        }
        else
        {
            // append coutry_code using location to audit array
            audit['country_code'] = audit['target'].location.substr(0, 2).toLowerCase();

            // return the audit
            callback(null, audit);
        }
    });
};
//</editor-fold>