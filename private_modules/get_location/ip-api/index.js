"use strict";
/* geo-ip private module
 * -Get localisation using 'ip-api.com' service
 * -Created by : Erenox the : 22/08/2016
 * -Last update : 14/01/2017
 */

/*
* module
*/
const http = require('http');

/*
* const
*/
const SERVICE_HOST = 'ip-api.com';
const SERVICE_PATH = '/json/';
const REQUEST_TIMEOUT = 8000;

//<editor-fold desc="module.exports.trace">
/*
* send an request to REST API (ip-api.com)
*/
module.exports.trace = function(target, callback)
{
    var hasTimeout = false;

    const opts = {
        hostname: SERVICE_HOST,
        path: SERVICE_PATH + target,
        method: 'GET',
        port: 80 // SSL not available :(
    };

    var req = http.request(opts, function(res)
    {
        res.setEncoding('utf8');

        res.on('data', function (data)
        {
            res.on('end', function()
            {
                if(!hasTimeout)
                    callback(data);
            });
        });

    });

    req.on('error', function(e)
    {
        if(!hasTimeout)
            callback(null);
    });

    req.setTimeout(REQUEST_TIMEOUT, function()
    {
        hasTimeout=true;
        callback(null);
    });

    req.end();
    return this;
};
//</editor-fold>
