"use strict";
/* audit.js
 * Contain routes for main '/audit' page
 */

/*
* Modules
*/
var express = require('express');
var router = express.Router();
var async = require('async');
var objectID = require('mongodb').ObjectID;

/*
* Privates modules
*/
var user_manager        = require('../private_modules/user_manager');
var check_inputs        = require('../private_modules/check_inputs');
var instance_manager    = require('../private_modules/instance_manager');
var check_blacklist     = require('../private_modules/check_blacklist');
var audit_profile       = require('../private_modules/audit_profile');
var dns_resolver        = require('../private_modules/dns_resolver');
var get_location        = require('../private_modules/get_location');
var audit_manager       = require('../private_modules/audit_manager');
var anti_spam           = require('../private_modules/anti_spam');
var socketio_manager    = require('../private_modules/socketio_manager');
var process_manager     = require('../private_modules/process_manager');
var logs_writer         = require('../private_modules/logs_writer');

//<editor-fold desc="function  : custom_error">
/*
* custom error
*/
function custom_error(message, type)
{
    this.message = message;
    this.type = type;
}
//</editor-fold>

//<editor-fold desc="GET /audit/:id page">
router.get('/:id', function(req, res, next)
{
    var audit_id = req.params.id;

    if(objectID.isValid(audit_id))
    {
       audit_manager.get_audit_data(audit_id, function(err, audit)
       {
           if (err) // on error
           {
               next(err);
           }
           else
           {
               res.render('audit', {'id': audit_id, 'audit': audit});
               res.end();
           }
       });
    }
    else
    {
       var err = new Error('Bad Request');
       err.status = 400;
       next(err);
    }

});
//</editor-fold>

//<editor-fold desc="POST /audit/ page">
router.post('/', function(req, res, next)
{
    //<editor-fold desc="get parameters and define containers">
    const inputs    = req.body.input;
    const submits   = req.body.submit;
    const settings  = req.body.setting;

    var user = // an user data container
    {
        ip  : req.headers.host,    //- store briefly the user ipv4
        uid : null                 //- store the user uid
    };

    var parameters = // an parameters container
    {
        display     :   null,       //- set audit display parameter
        type        :   null,       //- set the audit type parameter
        profile     :   null,       //- set the audit profile
        location    :   null        //- define the target location
    };
    //</editor-fold>

    async.series(
    {
        //<editor-fold desc="step 0 : prevent audit form spam.">
        x0: function (callback)
        {
            // prevent audit form spam
            anti_spam.check(user.ip, function (allow)
            {
                if (allow) // OK
                {
                    callback(null); // go to x1
                }
                else  // flash an error 
                {
                    callback(new custom_error('Unprocessable request, retry in few seconds.', 'Error'));
                }
            });
        },
        //</editor-fold>

        //<editor-fold desc="step 1 : check user request inputs, set audit type.">
        x1: function (callback)
        {
            // check the post parameters, set submit type
            check_inputs.check(inputs, submits, settings, function (type)
            {
                if (type) // (host, domain)
                {
                    parameters.type = type;
                    
                    // set the display parameter
                    check_inputs.display(settings, function (display)
                    {
                        parameters.display = display;
                        callback(null); // --> go to x2
                    });
                }
                else // flash an error
                {
                    callback(new custom_error('The form inputs are invalid!', 'Error'));
                }
            });
        },
        //</editor-fold>

        //<editor-fold desc="step 2 : switch to ultra-fast parallel processing.">
        x2: function (callback)
        {
            async.parallel({

                //<editor-fold desc="async : generate user unique id.">
                x2_1: function (callback)
                {
                    // generate an user uid based on ip
                    user_manager.generate_uid(user.ip, function (result)
                    {
                        delete user.ip; // no need user ip anymore
                        user.uid = result;
                        
                        callback(null); // --> error : null
                    });
                },
                //</editor-fold>

                //<editor-fold desc="async : disallow user audit in shorter interval.">
                x2_2: function (callback)
                {
                    anti_spam.check_user_interval(user.uid, function (result)
                    {
                        if (result)
                        {
                            callback(null); // // --> error : null
                        }
                        else // flash an error
                        {
                            callback(new custom_error('A single audit per user and per hour is allowed!', 'Warning'));
                        }
                    });
                },
                //</editor-fold>

                //<editor-fold desc="async : disallow duplicate target audit in shorter interval.">
                x2_3: function (callback)
                {
                    anti_spam.check_target_interval(inputs[parameters.type], function (result)
                    {
                        if (!result)
                        {
                            callback(null); // --> error : null
                        }
                        else // flash an error
                        {
                            callback(new custom_error('Wait a day before audit this target again!', 'Warning'));
                        }
                    });
                },
                //</editor-fold>

                //<editor-fold desc="async : check current audit instances.">
                x2_4: function (callback)
                {
                    instance_manager.check(function (result)
                    {
                        if (result)
                        {
                            callback(null); // --> error : null
                        }
                        else // flash an error
                        {
                            callback(new custom_error('The audits processes are busy, retry later!', 'Warning'));
                        }
                    });
                },
                //</editor-fold>

                //<editor-fold desc="async : check the target blacklist.">
                x2_5: function (callback)
                {
                    check_blacklist.check(parameters.type, inputs, function (result)
                    {
                        if (!result)
                        {
                            callback(null); // --> error : null
                        }
                        else // flash an error
                        {
                            callback(new custom_error('The submitted target is private or blacklisted!', 'Warning'));
                        }
                    });
                },
                //</editor-fold>

                //<editor-fold desc="async : check server, define audit profile.">
                x2_6: function (callback)
                {
                    audit_profile.check_server(parameters.type, inputs, function (result)
                    {
                        if (result)
                        {
                            parameters.profile = result;
                            callback(null); // --> error : null
                        }
                        else // flash an error
                        {
                            callback(new custom_error('The specified target is offline or invalid!', 'Warning'));
                        }
                    });
                },
                //</editor-fold>

                //<editor-fold desc="async : call to the DNS.">
                x2_7: function (callback)
                {
                    dns_resolver.resolve(inputs, parameters.type, function (err, result)
                    {
                        if (parameters.type === 'domain')
                        {
                            inputs['host'] = result;
                            callback(null); // --> error : null
                        }
                        else if (parameters.type === 'host')
                        {
                            inputs['domain'] = result;
                            callback(null); // --> error : null
                        }
                    });
                },
                //</editor-fold>

                //<editor-fold desc="async : define target location.">
                x2_8: function (callback)
                {
                    get_location.ip_api_localise(inputs[parameters.type], function (result)
                    {
                        parameters.location = result;
                        callback(null); // --> error : null
                    });
                }
                //</editor-fold>
            },
            function(err)
            {
                if (err) // on error
                {
                    callback(err); // err : go to final
                }
                else
                {
                    callback(null); // ok : go to final
                }
            });
        }
        //</editor-fold>
    },
    //<editor-fold desc="final : start the audit, manage redirection or error.">
    function (final) // at end
    {
        if (final) // on error
        {
            // push error in flash session
            req.flash('name', final.type);
            req.flash('message', final.message);

            // add an entry in log
            logs_writer.write('client','[client] : leave an alert - ' + final.message);

            // redirect to index
            res.statusCode = 301;
            res.redirect('/');
            res.end();
        }
        else // ok
        {
            //process
            audit_manager.new_audit(user, inputs, parameters, function (audit_id)
            {
                if(audit_id)
                {
                    // socket.io emit archive update
                    socketio_manager.archive_update();

                    // start the audit processes
                    process_manager.start(audit_id, inputs[parameters.type], parameters.profile);

                    // redirect to audit page
                    res.statusCode = 301;
                    res.redirect('/audit/' + audit_id);
                    res.end();
                }
                else
                {
                    var err = new Error('Internal server error');
                    err.status = 500;
                    next(err,null);
                }
            });
        }
    });
    //</editor-fold>
});
//</editor-fold>

/* Exports */
module.exports = router;