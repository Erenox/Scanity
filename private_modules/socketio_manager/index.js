"use strict";
/* socketio_manager private module
 * -Manage socket.io transactions
 * -Created by : Erenox the : 02/10/2016
 * -Last update : 14/01/2017
 */

/*
* Private Modules
*/
var archive_manager = require("../../private_modules/archive_manager");

//<editor-fold desc="exports.set_io_instance">
/*
* manage socket.io namespaces
*/
exports.set_io_instance = function(io)
{
    //<editor-fold desc="Socket.io archive namespace">
    var archive = io.of('/archive').on('connection', function(socket)
    {
        // on client emit 'archive' 
        socket.on('archive', function(parameters, callback)
        {
            archive_manager.get_audit_archives(parameters['input'], parameters['timezone'], function(audits)
            {
                callback(audits);
                
            });
        });

        // notify an update to client
        module.exports.archive_update = function()
        {
            archive.emit('archive_update');
        }
    });
    //</editor-fold>

    //<editor-fold desc="Socket.io audit namespace">
    var audit = io.of('/audit').on('connection', function(socket)
    {
        //on client emit 'audit'
        socket.on("audit", function(audit_id)
        {
            socket.join(audit_id.id);
        });

        // notify a result to client
        module.exports.result_notify = function(id, scanner)
        {
            audit.in(id).emit('result', {'audit_id': id, "scanner": scanner});
        };
    });
    //</editor-fold>
};
//</editor-fold>
