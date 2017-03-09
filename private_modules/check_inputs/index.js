"use strict";
/* check_inputs private module
 * -Check all inputs passed by client
 */

/*
* CONST
*/
const DOMAIN = /^([a-z0-9]([a-z0-9\-]{0,70}[a-z0-9])?\.)+[a-z]{2,6}$/;
const HOST = /^([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])$/;
const SELECTOR = /^[0-4]$/;

//<editor-fold desc="module.exports.check">
/*
* check audit inputs parameters,
* define audit profile
*/
module.exports.check = function(inputs, submits, settings, callback)
{
    // force domain to be in lowercase
    inputs['domain'] = inputs['domain'].toLowerCase();

    if (!inputs || !submits || !settings) // some params missing
    {
        callback(false);
    }
    else
    {
        if ( (inputs['domain'].match(DOMAIN) || inputs['host'].match(HOST) ) && inputs['selector'].match(SELECTOR) && settings['terms'] === 'on')
        {
            inputs['selector'] = parseInt(inputs['selector']);  // int casting

            if (submits['domain']) // domain based audit
            {
                callback('domain');
            }
            else if (submits['host']) // host base audit
            {
                callback('host');
            }
        }
        else // invalid inputs
        {
            callback(false);
        }
    }
};
//</editor-fold>

//<editor-fold desc="module.exports.display">
/*
* check the result scope (public or hidden)
*/
module.exports.display = function(settings, callback)
{
    if(settings['archive'] === 'on') // public
    {
        callback(true);
    }
    else // hidden
    {
        callback(false);
    }
};
//</editor-fold>
