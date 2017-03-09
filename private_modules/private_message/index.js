"use strict";
/* private_message private module
 * -Manage private message send by user
 */

/*
* Modules
*/
var env = require('../../app').env;

/*
* Private Modules
*/
var mailgun = require('mailgun-js');
var settings = require('../../settings');

/*
* CONST
*/
const ANTI_SPAM_LIMIT = 2;

/*
* Global
*/
var counter = 0;


//<editor-fold desc="function : Error">
/*
 * Override base Error class 
 */
function Error(message, type)
{
    this.message = message;
    this.type = type;
}
//</editor-fold>

//<editor-fold desc="module.exports.send">
/*
* Send a email using Mailgun Api
*/
module.exports.send = function(message, callback) // limit scanners instances (Protect system performances)
{
    if (counter < ANTI_SPAM_LIMIT)
    {
        // simple antispam policy
        counter++;
        setTimeout(function () {
            counter--;
        }, 60000);

        // define message subject
        switch (message['about'])
        {
            case '1':
                message['about'] = 'prohibited audit';
                break;

            case '2':
                message['about'] = 'report bug';
                break;

            case '3':
                message['about'] = 'improvement';
                break;

            case '4':
                message['about'] = 'other';
                break;

            default:
                message['about'] = 'unknown';
        }

        //<editor-fold desc="Mailgun SMTP processing">

        //set the domain
        var selected_domain;
        if (env === "production") // case of production
        {
            selected_domain = settings.primary_domain
        }
        else // case of "development"
        {
            selected_domain = settings.sandbox_domain
        }

        // set the instance
        var instance = require('mailgun-js')({apiKey: settings.api_key, domain: selected_domain});

        // set the mail data
        var data =
        {
            from: 'Scanity Private Messaging - <Scanity@samples.mailgun.org>',
            to: settings.recipient,
            subject: message['about'] + ' ' + message['address'],
            text: message['body']
        };

        // send the mail using mailgun SMTP server
        instance.messages().send(data, function (err, body)
        {
            if (!err) // OK
            {
                callback(0);
            }
            else // Fail ---> Length Exceeded
            {
                callback(new Error('Message length exceeded !', 'Error'));
            }
        });
        //</editor-fold>
    }
    else// Fail ---> Antispam Prevent
    {
        callback(new Error('Error retry later !', 'Error'));
    }
};
//</editor-fold>
