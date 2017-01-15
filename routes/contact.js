"use strict";
/* contact.js
 * Contain routes for main '/' page
 * Created by : Erenox the : 05/07/2016
 * Last update : 14/01/2017
 */


/*
* Modules
*/
var express = require('express');
var router = express.Router();


/*
* Private modules
*/
var private_message = require('../private_modules/private_message');


//<editor-fold desc="GET /contact/ page">
router.get('/', function(req, res, next)
{
  res.render('contact');
});
//</editor-fold>

//<editor-fold desc="POST /contact/ page">
router.post('/',function(req,res,next)
{
    var message = req.body.input;
    
    private_message.send(message, function(result)
    {
        if(result instanceof Error)
        {
            /* instance message in flash session */
            req.flash('name', result.type);
            req.flash('message', result.message);
        }
        else
        {
            /* instance  message in flash session */
            req.flash('name', 'Success');
            req.flash('message', 'The message was sent successfully.');
        }
    
        res.statusCode = 301;
        res.redirect('/');
        res.end();
    });

});
//</editor-fold>


/* Exports */
module.exports = router;