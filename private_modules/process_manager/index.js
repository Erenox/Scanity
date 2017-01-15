"use strict";
/* process_manager private module
 * -Manage audit processes
 * -Created by : Erenox the : 12/10/2016
 * -Last update : 14/01/2017
 */

/*
* Modules
*/
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

/*
* Private Modules
*/
var audit_profile = require('../audit_profile');
var instance_manager = require('../instance_manager');
var database_queries = require('../database_queries');
var socketio_manager = require('../socketio_manager');
var report_manager = require('../report_manager');
var log_writer = require('../logs_writer');

/*
* CONST
*/
const TIMEOUT = 4 * 3600 * 1000;

//<editor-fold desc="function : get_scanner_command">
/*
* build the command associated to scanner
*/
function get_scanner_command(scanner, main_target)
{
    // remove console color
    var uncolorize = ' | sed "s,\\x1B\\[[0-9;]*[a-zA-Z],,g" ';

    //return a scanner command
    switch(scanner)
    {
        case 'common':
            return "common " + main_target;
            break;

        case 'whatweb':
            return "whatweb -v --color never --follow-redirect same-domain --max-redirects 2 -a 3 " + main_target;
            break;

        case 'nmap':
            return "nmap --top-ports 2000 -O -T4 -sV -sC --system-dns -PN " + main_target;
            break;

        case 'nikto':
            return "nikto -C all -Display 4 -nointeractive -timeout 2 -Plugins @@DEFAULT -ask no -host " + main_target;
            break;

        case 'arachni':
            return "arachni --profile-load-filepath /usr/share/arachni/profiles/profile --scope-include-subdomains --output-only-positives --timeout 3:45 http://" + main_target;
            break;

        case 'sslyze':
            return "(printf  'sslyze version : ' ; sslyze --version ; sslyze --regular " + main_target + " | sed -r 's/( {6}HTTP.*)//g' ) ";
            break;

        case 'droopescan':
            return "droopescan scan drupal --method ok  -t 4 -n all 2>/dev/null -u " + main_target + uncolorize;
            break;

        case 'joomlavs':
            return "joomlavs -a --follow-redirection -u " + main_target  + uncolorize;
            break;

        case 'wpscan':
            return "yes Y | wpscan --follow-redirection -e p,tt,t,u[1-100] --no-color  --connect-timeout 20 --request-timeout 20 -u " + main_target;
            break;
    }
}
//</editor-fold>

//<editor-fold desc="function : process_spawn">
/*
* create a new child process
*/
function process_spawn(audit_id, command, scanner, report_path)
{
    // run the process, append on file (timeout : 4 hours)
    instance_manager.add_instance();// process start : add and instance

    var process = exec(command, { timeout: TIMEOUT }, function(err, stdout, stderr)
    {
        // closing the process properly
        process_close(process);

        var output;
        if(stdout)
        {
            output = stdout;
        }
        else if (stderr)
        {
            output = stderr;
        }
        else
        {
            output = 'Sorry an error occur with this audit process, we are working for fix it.'
        }

        // append audit data to file
        fs.appendFile(report_path, output, function ()
        {
            // create the html report, update the database and notify the client
            report_manager.create(report_path, function()
            {
                update_result(audit_id, scanner); // update the database
            });
        });
    });
}
//</editor-fold>

//<editor-fold desc="function : process_close">
/*
* closing a child process
*/
function process_close(process)
{
    process.kill('SIGTERM'); // close possible remain process properly (in case of timeout)
    instance_manager.remove_instance();// process stop : remove an instance
}
//</editor-fold>

//<editor-fold desc="function : update_result">
/*
* update result status on database
*/
function update_result(audit_id, scanner)
{
    database_queries.get_result_id_by_audit_id(audit_id, function(result_id)
    {
        // update result for current audit in database
        database_queries.update_result_by_id(result_id, scanner, 1);
    });

    try
    {
        // notify the client
        socketio_manager.result_notify(audit_id, scanner);
    }
    catch(err)
    {
        // not fatal error, client just disconnect in bad way
        log_writer.write("server",err);
    }

}
//</editor-fold>

//<editor-fold desc="module.exports.start">
/*
* start and new audit
*/
module.exports.start = function(audit_id, target_main, profile)
{
    // create the report directory
    var audit_dir = path.resolve('../', 'public', 'audits', String(audit_id)).concat('/');

    // build the audit dir if it not exist
    var create_environment = function(callback)
    {
        fs.exists(audit_dir,function(exist)
        {
            if(!exist)
            {
                fs.mkdir(audit_dir, 755, function()
                {
                    callback();
                });
            }
            else
            {
                callback();
            }
        });
    };

    // start the audit processes
    var start_processes = function()
    {
        // get the audit profile
        audit_profile.get_profile(profile, function (scanners)
        {

            scanners.forEach(function(scanner)
            {
                var command = get_scanner_command(scanner, target_main);
                var report_path = path.format({root: audit_dir, name: scanner, ext: '.txt'});

                // spawn a new process
                process_spawn(audit_id, command, scanner, report_path);
            });
        });
    };

    create_environment(start_processes);
};
//</editor-fold>
