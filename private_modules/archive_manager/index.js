"use strict";
/* archive manager private module
 * -Get the audit archives
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
            if(custom && !archive[cpt]['display'])
            {
                archive.splice(cpt, 1);
                continue;
            }

            // build the archive
            if (!archive[cpt]['display']) // do not display
            {
                archive[cpt]['_id'] = "../#";
                archive[cpt]['main_target'] = "hidden";
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
        database_queries.get_archives(function (archive)
        {
            callback(archive_parser(archive, timezone, false));
        });
    }
    else // custom archive search
    {
        try
        {
            database_queries.get_custom_archives(new RegExp('.*' + input + '.*', 'i'), function(archive)
            {
                callback(archive_parser(archive, timezone, true));
            });
        }
        catch(e)
        {
            callback(null);
        }
    }
};
//</editor-fold>