"use strict";
/* logs_writer private module
 * -Log client and server error on logs directory
 */

/*
* Modules
*/
var path = require('path');
var fs = require('fs');


//<editor-fold desc="Number.prototype.pad">
/*
* pad a number with zero (for 2 digits log entries)
* https://stackoverflow.com/questions/3313875/javascript-date-ensure-getminutes-gethours-getseconds-puts-0-in-front-i
*/
Number.prototype.pad = function (len)
{
    return (new Array(len+1).join("0") + this).slice(-len);
};
//</editor-fold>

//<editor-fold desc="function : log_instance">
/*
* create/check a log file, return log file path.
*/
var log_instance = function(date, log_type, callback)
{
    // build log path
    var log_dir = path.resolve('../', 'logs').concat('/');
    var log_file = log_dir.concat(log_type +  '.log');

    // check if file exit or create it
    fs.exists(log_file, function(exists)
    {
        if (!exists)
        {
            //noinspection JSDeprecatedSymbols
            fs.writeFile(log_file,'', function(err) // create a new log file
            {
                if(!err)
                {
                    callback(log_file); // callback file path
                }
                else
                {
                    callback(null); // error in file creation
                }
            });
        }
        else // file already exist
        {
            callback(log_file); // callback file path
        }
    });
};
//</editor-fold>

//<editor-fold desc="module.exports.write">
module.exports.write = function(log_type, text)
{
    var date = new Date();

    log_instance(date, log_type, function(log_path)
    {
        if(log_path)
        {
            // text to dated log entry
            var data = String(date.getFullYear() + '-' + (date.getMonth()+1).pad(2) + '-' + date.getDate().pad(2) + '-' + date.getHours().pad(2) + ':' + date.getMinutes().pad(2) + ':' + date.getSeconds().pad(2)) + " - " + text + '\n';
            fs.appendFile(log_path, data, function (err) {});
        }
    });
};
//</editor-fold>
