"use strict";
/* websocket.js
 * Manage socket.io communication.
 * Created by : Erenox the : 10/07/2016
 * Last update : 14/01/2017
 */

/*
* Search on archive
*/
function archive_search()
{
    var input = document.getElementById('search_input').value; // it can be null (default search)
    var timezone = new Date().getTimezoneOffset(); // get the UTC timezone

    /*
     * socket.io update the archive
     */
    archive_socket.on('archive_update', function()
    {
        archive_search();
    });

    archive_socket.emit('archive', {'input': input, 'timezone': timezone}, function(archive)
    {
        archive_update(archive); // --> animation.js
    });

}

/*
* Display on results
*/
function audit_standby(id)
{
    audit_socket.on('result', function(result)
    {
        result_update(result.audit_id, result.scanner);
    });

    audit_socket.emit("audit", {'id': id});
}