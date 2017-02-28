"use strict";
/* archive manager private module
 * -Get the audit archives
 * -Created by : Erenox the : 16/09/2016
 * -Last update : 14/01/2017
 */

/*
* Private Modules
*/
var database_queries = require('../database_queries');

//<editor-fold desc="function : archive_parser">
var archive_parser = function(archive, timezone, custom)
{
    if(archive)
    {
        for (var cpt = 0; cpt < archive.length; cpt++)
        {
            // prevent hidden result predicting
            if(custom && archive[cpt]['private'])
            {
                archive.splice(cpt, 1);
                continue;
            }
            
            // hide details of private audit
            if (archive[cpt]['private'])
            {
                archive[cpt]['_id'] = "../#";
                archive[cpt]['target_main'] = "hidden";
            }
        }
    }

    return archive;
};
//</editor-fold>

//<editor-fold desc="module.exports.get_audit_archives">
module.exports.get_audit_archives = function(input, timezone, callback)
{
    if(!input) // default archive search
    {
        database_queries.get_latest_audit_archives(function (archive)
        {
            callback(archive_parser(archive,timezone,false));
        });
    }
    else // custom archive search
    {
        try
        {
            var input = new RegExp('.*'+input+'.*', 'i');

            database_queries.get_latest_audit_by_search(input, function(archive)
            {
                callback(archive_parser(archive,timezone,true));
            });
        }
        catch(e)
        {
            callback(null);
        }
    }
};
//</editor-fold>