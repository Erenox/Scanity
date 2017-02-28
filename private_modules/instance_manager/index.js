"use strict";
/* instance_manager private module
 * -Check current audit instances
 * -Created by : Erenox the : 19/07/2016
 * -Last update : 14/01/2017
 */

/*
* CONST
*/
const MAX_INSTANCES = 10; // define the limit of scanners instance (10 = ~4GB RAM : 4GB 4vcore )
var current_instances = 0;

//<editor-fold desc="module.exports.check">
/*
* check the Audits instances
*/
module.exports.check = function(callback) // limit scanners instances (Protect system performances)
{

    if(current_instances < MAX_INSTANCES)
    {
        callback(true); // ok
    }
    else
    {
        callback(false); // fail
    }
};
//</editor-fold>

//<editor-fold desc="module.exports.add_instance">
/*
* add an instance
*/
module.exports.add_instance = function()
{
    current_instances+=1;
    console.log(current_instances);
};
//</editor-fold>

//<editor-fold desc="module.exports.remove_instance">
/*
* remove an instance
*/
module.exports.remove_instance = function()
{
    current_instances-=1;
    console.log(current_instances);
};
//</editor-fold>
