"use strict";
/* check_blacklist private module
 * -Check all blacklisted hosts and domains
 */

/*
* Modules
*/
var fs = require("fs");
var range_check = require('range_check');


//<editor-fold desc="module.exports.check">
/*
* check the blacklist by target and type
*/
module.exports.check = function(type, inputs, callback) // check if target is 'blacklisted'
{
    fs.readFile('../data_source/blacklist.json', 'UTF8', function(err, content)
    {
        if(!err)
        {
            var blacklist = JSON.parse(content);
            blacklist = blacklist[type];
            
            // check blacklist result
            for (var cpt = 0; cpt < blacklist.length; cpt++)
            {
                if(type === 'domain') // domain checking
                {
                    // domain based check
                    if(inputs[type].includes(blacklist[cpt]))
                    {
                        callback(true); // domain blacklisted
                        break;
                    }
                }
                else if(type === 'host') // host checking
                {
                    // ipv4 based range
                    if (range_check.inRange(inputs[type], blacklist[cpt]))
                    {
                        callback(true); // host blacklisted
                        break;
                    }
                }

                if (cpt === blacklist.length - 1) // nothing found
                {
                    callback(false); // ok
                }
            }
        }
        else
        {
            callback(true); // set it blacklisted in case of error
        }
    });
};
//</editor-fold>
