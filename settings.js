"use strict";
/* settings.js
 * For store some security settings
 * must be reset by server owner
 * Created by : Erenox the : 13/01/2017
 * Last update : 14/01/2017
 */

/*
* secret keys
*/
var secret =
{
    cookie       : 'XXXXXXXXXX',
    session      : 'XXXXXXXXXX',
    obfuscate    : 'XXXXXXXXXX',
    hash         : 'XXXXXXXXXX'
};
exports.cookie      = secret.cookie;
exports.session     = secret.session;
exports.obfuscate   = secret.obfuscate;
exports.hash        = secret.hash;

/*
* TLS certificate path
*/
var secure =
{
    cert    : '/etc/ssl/scanity/crt/scanity_net.crt',
    key     :  '/etc/ssl/scanity/key/scanity_net.key'
};
exports.cert    = secure.cert;
exports.key     = secure.key;

/*
* mailgun api settings
*/
var mailgun =
{
    api_key         : '',
    primary_domain  : '',
    sandbox_domain  : '',
    recipient       : ''
};

exports.api_key         = mailgun.api_key;
exports.primary_domain  = mailgun.primary_domain;
exports.sandbox_domain  = mailgun.sandbox_domain;
exports.recipient       = mailgun.recipient;
