"use strict";
/* index.js
* Contain routes for main '/' page
*/

/*
* Modules
*/
var express = require('express');
var router = express.Router();

//<editor-fold desc="GET / page">
router.get('/', function(req, res, next)
{
    res.render('index', {'name' : req.flash('name')[0], 'message' : req.flash('message')[0]});
});
//</editor-fold>

/* Exports */
module.exports = router;
