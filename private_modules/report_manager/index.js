"use strict";
/* report_manager private module
 * -Convert a report to html format
 * -Created by : Erenox the : 02/10/2016
 * -Last update : 14/01/2017
 */

/*
* Modules
*/
var fs = require('fs');
var path = require('path');

/*
* CONST
*/
//html skeleton of any report
const OPEN_TAG = "<!doctype html>\n<html>\n<head> <link rel='stylesheet' type='text/css' href='../../stylesheets/audit.css'> </head>\n<body>\n<pre>\n<code>\n"
const CLOSE_TAG = "</code>\n</pre>\n</body>\n</html>";


//<editor-fold desc="function : escape_html_special_chars">
/*
* escape html special chars
* thanks to http://stackoverflow.com/users/861178/jbo5112
*/
function escape_html_special_chars(txt_data)
{
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return txt_data.replace(/[&<>"']/g, function(m) { return map[m]; });
}
//</editor-fold>

//<editor-fold desc="function : report_formatter">
/*
* colorize, and enlighten results in report
*/
var report_formatter = function (txt_data, scanner, callback)
{
    // removes the leading and trailing whitespace and console special chars
    txt_data = txt_data.replace(/^\s+|\s+$|(\[2J)/g,'');

    // sanitize html report
    txt_data = escape_html_special_chars(txt_data);

    // use colorimetry.json for set color in audit report
    fs.readFile('../data_source/colorimetry.json', 'UTF8', function(err, content)
    {
        if (!err) 
        {
            var full_regex = JSON.parse(content)['scanners'][scanner];

            if (full_regex)
            {
                // load the regex parsers
                var regex = {};
                if (full_regex['bold']) {
                    regex.bold = new RegExp(full_regex['bold']);
                }

                if (full_regex['orange']) {
                    regex.orange = new RegExp(full_regex['orange']);
                }

                // split text_data to array
                var txt_array = txt_data.split("\n");
                
                // parse the report
                for (var cpt = 0; cpt < txt_array.length; cpt++) 
                {
                    if (txt_array[cpt].match(regex.bold)) {
                        txt_array[cpt] = "<span class='txt_bold'>" + txt_array[cpt] + "</span>";
                    }
                    else if (txt_array[cpt].match(regex.orange)) {
                        txt_array[cpt] = "<span class='txt_orange'>" + txt_array[cpt] + "</span>";
                    }

                    // done
                    if (cpt === txt_array.length - 1) {
                        var html_data = txt_array.join("\n");
                        callback(html_data); // return the parsed report
                    }
                }
            }
            else // error
            {
                callback(txt_data); // return the non-parsed report
            }
        }
        else // error
        {
            callback(txt_data);  // return the non-parsed report
        }
    });
};
//</editor-fold>

//<editor-fold desc="function : report_parser">
/*
* convert a result text buffer to html report buffer
*/
var report_parser = function (text_path, callback)
{
    fs.readFile(text_path, "utf-8", function (err, txt_data)
    {
        if(!err)
        {
            var scanner = path.parse(text_path).name;

            report_formatter(txt_data, scanner, function(html_data)
            {
                callback(html_data);
            });
        }
        else
        {
            callback(null);
        }
    });
};
//</editor-fold>

//<editor-fold desc="module.exports.create">
/*
* convert a text audit file to html colorized report
*/
module.exports.create = function(text_path, callback)
{
    // define out_report_path(output html report)
    var out_report_path = path.format({ dir: path.dirname(text_path),  name : path.basename(text_path, '.txt'), ext: '.html'});
    
    // convert text report to html report
    var stream = fs.createWriteStream(out_report_path);

    stream.once('open', function()
    {
        stream.write(OPEN_TAG); // open the html tag

        // parse and colorize the report
        report_parser(text_path,function(result)
        {
            if(result)
            {
                stream.write(result); // append the parsed report
            }
            stream.end(CLOSE_TAG); // close the html tag
        });

    });

    stream.once('close', function()
    {
        callback(); // done
    });
};
//</editor-fold>
