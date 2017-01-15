"use strict";
/* anti_spam private module
 * -Security module, prevent spam, restrict service misuse.
 * -Created by : Erenox the : 07/10/2016
 * -Last update : 17/12/2016
 */

/*
* Modules
*/
var ObjectID = require('mongodb').ObjectId;

/*
* Private Modules
*/
var database_queries = require('../database_queries');

/*
* CONST
*/
const SUBMIT_INTERVAL = 250;                // 250 ms
const AUDIT_INTERVAL = 1000 * 3600;         // 1 hour
const TARGET_INTERVAL = 1000 * 3600 * 24;   // 1 day

var anti_spam = []; // ephemeral ip container

//<editor-fold desc="module.exports.check">
/*
* check ip container
*/
module.exports.check = function(client_ip, callback)
{
    if(!anti_spam.includes(client_ip)) // not found on ip container
    {
        client_manager(client_ip, false); // enable anti_spam protection
        callback(true); // OK
    }
    else // ip is on ip container
    {
        client_manager(client_ip, true); // reset the prevent timer
        callback(false); // error
    }

};

/*
* add on ip container
*/
function client_manager(client_ip, reset)
{
    if(reset) // in case of reset prevent time
    {
        anti_spam.splice(anti_spam.indexOf(client_ip), 1);
    }

    anti_spam.push(client_ip); // add on container

    setTimeout // set the timeout
    (
        function()
        {
            //remove from container after timeout
            anti_spam.splice(anti_spam.indexOf(client_ip), 1);
            
        }, SUBMIT_INTERVAL
    );
}
//</editor-fold>

//<editor-fold desc="module.exports.check_user_interval">
/*
* restrict audit by user (one audit per hour per uid)
*/
module.exports.check_user_interval = function(uid, callback)
{
    database_queries.get_user_by_uid(uid, function(user)
    {
        if (!user)
        {
            callback(true);
        }
        else
        {
            database_queries.get_audit_by_interval_and_user_id(new ObjectID(user._id), AUDIT_INTERVAL, function (result)
            {
                callback(!result);
            });
        }
    });
};
//</editor-fold>

//<editor-fold desc="module.exports.check_target_interval">
/*
 * restrict audit by target (one target audit per day)
 */
module.exports.check_target_interval = function(target_main, callback)
{
    database_queries.count_audit_by_interval_and_target_main(target_main, TARGET_INTERVAL, function(result)
    {
        callback(result);
    });
};
//</editor-fold>
