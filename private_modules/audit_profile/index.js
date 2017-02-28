"use strict";
/* audit_profile private module
 * -Define audit type using some tests
 * -Created by : Erenox the : 21/08/2016
 * -Last update : 14/01/2017
 */

/*
* modules
*/
var net = require('net');
var promise = require('bluebird');
var request = require('request');

/*
 * CONST
 */
const SCANNERS = {
    "host_scanners"             : ['common','nmap'],
    "web_scanners"              : ['common','whatweb','nmap','nikto','arachni'],
    "cms_joomla_scanners"       : ['common','whatweb','nmap','joomlavs'],
    "cms_wordpress_scanners"    : ['common','whatweb','nmap','wpscan'],
    "cms_drupal_scanners"       : ['common','whatweb','nmap','droopescan']
};


const HTTP_TIMEOUT = 1000 * 5;  // HTTP protocol timeout.
const HTTPS_TIMEOUT = 1000 * 5; // HTTPS protocol timeout.

//<editor-fold desc="function : check_profile">
/*
* define the scan profile.
*/
function check_profile (selector, secure)
{
    var profile;

    switch(selector)
    {
        case 0:
            profile = "host_profile";
            break;

        case 1:
            profile = 'web_profile';
            break;
        
        case 2:
            profile = 'cms_joomla';
            break;
        
        case 3:
            profile = 'cms_wordpress';
            break;
        
        case 4:
            profile = 'cms_drupal';
            break;
    }

    if(secure && selector != 0) // if target support https (except for host audit)
    {
        return 'secure_' + profile; // set prefix secure
    }
    else
    {
        return profile;
    }
}
//</editor-fold>

//<editor-fold desc="module.exports.check_server">
/*
* check the target server open ports
*/
module.exports.check_server = function(type, inputs, callback)
{
    if(inputs['selector'] === 0)
    {
        callback("host_profile");
    }
    else
    {
        check_connection(inputs[type],80,HTTP_TIMEOUT).then(function()
        {
            check_connection(inputs[type],443,HTTPS_TIMEOUT).then(function()
            {
                /* respond on 443 : https */
                callback(check_profile(inputs['selector'],true))
            }, function(err)
            {
                /* respond on 80 : http */
                callback(check_profile(inputs['selector'],false))
            })

        }, function(err)
        {
            /* offline or unresponsive domain */
            callback(null);
        })
    }
};
//</editor-fold>

//<editor-fold desc="function : check_connection">
/*
* check if server is online
*/
function check_connection(destination, port, timeout)
{
    return new promise(function(resolve, reject)
    {
        var timer = setTimeout(function()
        {
            reject('timeout');
            socket.end();
        }, timeout);

        var socket = net.createConnection(port, destination, function()
        {
            clearTimeout(timer);
            resolve();
            socket.end();
        });

        socket.on('error', function(err)
        {
            clearTimeout(timer);
            reject(err);
        });
    });
}
//</editor-fold>

//<editor-fold desc="module.exports.get_profile">
/*
* return scanners associated to profile.
*/
module.exports.get_profile = function(audit_profile, callback)
{
    if (audit_profile.includes('secure')) // https audit profile, add "sslyze"
    {
        var secure_array;

        switch (audit_profile)
        {
            case 'secure_web_profile':
                (secure_array = SCANNERS['web_scanners']).splice(2, 0, "sslyze");
                callback(secure_array);
                break;

            case 'secure_cms_joomla':
                (secure_array = SCANNERS['cms_joomla_scanners']).splice(2, 0, "sslyze");
                callback(secure_array);
                break;

            case 'secure_cms_wordpress':
                (secure_array = SCANNERS['cms_wordpress_scanners']).splice(2, 0, "sslyze");
                callback(secure_array);
                break;

            case 'secure_cms_drupal':
                (secure_array = SCANNERS['cms_drupal_scanners']).splice(2, 0, "sslyze");
                callback(secure_array);
                break;

            default: // invalid profile selection.
                callback(null);
        }

    }
    else // http audit profile
    {
        switch(audit_profile)
        {
            case 'host_profile':
                callback(SCANNERS['host_scanners']);
                break;

            case 'web_profile':
                callback(SCANNERS['web_scanners']);
                break;

            case 'cms_joomla':
                callback(SCANNERS['cms_joomla_scanners']);
                break;

            case 'cms_wordpress':
                callback(SCANNERS['cms_wordpress_scanners']);
                break;

            case 'cms_drupal':
                callback(SCANNERS['cms_drupal_scanners']);
                break;

            default: // invalid profile selection.
                callback(null);
        }
    }
};
//</editor-fold>
