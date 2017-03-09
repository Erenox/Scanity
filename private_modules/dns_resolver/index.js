"use strict";
/* dns_resolver private module
 * -Domain lookup or ip reverse
 */

/*
* modules
*/
var dns = require('dns');

/*
* CONST
*/
const TIMEOUT = 3000; // dns timeout

//<editor-fold desc="module.exports.resolve">
/*
* dns call to resolve (lookup or reverse)
*/
module.exports.resolve = function(inputs, type, callback)
{
    var trigger = false; // the callback trigger
    
    var do_callback = function(err, result)
    {
        if(trigger) return;
            trigger = true;

        if(result instanceof Array)
            result = result[0];

        callback(err, result);
    };

    setTimeout(function()
    {
        do_callback(new Error("DNS request timeout."), null);
    }, TIMEOUT);
    
    if(type === "domain")
    {
        dns.lookup(inputs[type], do_callback);
    }
    else if(type === "host") 
    {
        dns.reverse(inputs[type], do_callback);
    }
};
//</editor-fold>