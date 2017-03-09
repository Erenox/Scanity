"use strict";
/* get_localisation private module
 * -Localise the target via REST api using ip/domain
 */

/*
 * Private Modules
 */
var ip_api = require('./ip-api');

//<editor-fold desc="module.exports.ip_api_localise">
/*
* Get ip/domain location via ip-api.com REST service.
*/
module.exports.ip_api_localise = function(target_main,callback)
{
    ip_api.trace(target_main,function(result)
    {
        var position = JSON.parse(result);

        if(position && position['status'] === 'success')
        {
            var target_location = position['countryCode'] + ' ' + position['regionName'];

            if(position['regionName'] != position['city'])
                target_location += ' ' + position['city'];

            callback(target_location);
        }
        else
        {
            callback('unknown');
        }
    });
};
//</editor-fold>
