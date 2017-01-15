"use strict";
/* user_uid private module
 * -Create client uid using client's ip
 * -Created by : Erenox the : 23/08/2016
 * -Last update : 14/01/2017
 */

/*
* Modules
*/
var crypto = require('crypto');

/*
* Private Modules
*/
var database_queries = require("../database_queries");
var settings = require('../../settings');

//<editor-fold desc="function : obfuscate">
/*
* function obfuscate
* prevent SHA1 secret reversing using ip range.
*/
function obfuscate(client_ip)
{
    // very simple obfuscation, keep it secret //
    var bytes = client_ip.split(".");

    var obf =  ((bytes[0]*256^3) + bytes[3]).toString() + settings.obfuscate;
        obf += ((bytes[1]*256^2) + bytes[2]).toString() + settings.obfuscate;
        obf += ((bytes[2]*256^1) + bytes[1]).toString() + settings.obfuscate;
        obf += ((bytes[3]*256^0) + bytes[0]).toString() + settings.obfuscate;
    // --------------------------------------- //

    return obf;
}
//</editor-fold>

//<editor-fold desc="module.exports.generate_uid">
/*
* obfuscate and hash client ip for create uid
*/
module.exports.generate_uid = function(client_ip, callback)
{
    callback(crypto.createHmac('SHA1', settings.hash).update(obfuscate(client_ip)).digest('hex'));
};
//</editor-fold>