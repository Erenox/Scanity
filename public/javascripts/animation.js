"use strict";
/* animation.js
 * Contain style animations
 * Created by : Erenox the : 09/07/2016
 * Last update : 14/01/2017
 */

var before_loading; // get the current time

/*
* Dynamic Pictures Loading
*/
window.onload = preload();
function preload()
{
    before_loading = (new Date()).getTime();

    var images = [
        "../images/_tou.png",
        "../images/_archive.png",
        "../images/_tools.png",
        "../images/_git.png",
        "../images/_hide.png",
        "../images/_target.png",
        "../images/animated/_progress.gif",
        "../images/animated/_display.gif"
    ];

    var images_buffer = {};
    for (var i = 0; i < images.length; i++)
    {
        images_buffer[i] = new Image();
        images_buffer[i].src = images[i];

        /* clear storage buffer */
        delete images[i];
        delete images_buffer[i];
    }
    
}

/*
* Load colored img
*/
function imghover(p_id)
{
    // get the img
    var img_path = document.getElementById(p_id).getAttribute('src');

    if(img_path.indexOf('*') != -1) // <-- IE compatibility
        document.getElementById(p_id).setAttribute('src', img_path.replace('*','_'));
}

/*
* Reset Greyscale img
*/
function imgunhover(p_id)
{
    var img_path = document.getElementById(p_id).getAttribute('src');

    if(img_path.indexOf('_') != -1) //  For IE compatibility
        document.getElementById(p_id).setAttribute('src', img_path.replace('_','*'));
}

/*
 * Highlight Forms-box
 */
function fieldhover(p_element, p_field)
{
    var element = document.getElementById(p_element);

    if (p_field == 'textbox')
    {
        if(element.value.length == 0) {element.style.backgroundColor = '#969696';}
    }
    else if (p_field == 'picture' || p_field == 'button')
    {
        element.style.backgroundColor = 'rgba(20,20,20,0.5)';
    }
}

/*
 * Reset Forms-box
 */
function fieldunhover(p_element, p_field)
{
    var element = document.getElementById(p_element);

    if (p_field === 'textbox')
    {
        if(element.value.length === 0) {element.style.backgroundColor = '#303030';}
    }
    else if (p_field === 'picture' || p_field === 'button')
    {
        element.style.backgroundColor = 'transparent';
    }
}

/*
* Set visibility of audit panel
*/
function visibility(button, p_result_id)
{
    var body = document.getElementById(p_result_id);

    if(body.style.display != 'block') // display the result panel
    {
        
        button.style.backgroundImage = "url('/images/_hide.png')";
        body.style.display = 'block';
    }
    else // hide the result panel
    {
        button.style.backgroundImage = "url('/images/_display.png')";
        body.style.display = 'none';
    }

}

/*
 * Countdown for error page
 */
function countdown(time)
{
    var timer = document.getElementById('timer');
    if (time > 0)
    {
        time--;
        timer.innerHTML = "You will be redirect in " + time + " seconds.";
        setTimeout("countdown(" + time + ")", 1000);
    }
    else
    {
        timer.innerHTML = "Redirection in progress.";
        window.location.href = "/";
    }
}

/*
* Emit a warning on index page
*/
function warning(name, message)
{
    var warn_zone = document.getElementById('warn');
    var warn_icon =  warn_zone.getElementsByTagName('img')[0];
    var warn_message = warn_zone.getElementsByTagName('p')[0];

    warn_message.innerHTML = message;

    switch(name)
    {
        case "Success":
            warn_icon.src = "../images/valid.png";
            warn_message.style.color = "#00DD00";
            break;

        case "Warning":
            warn_icon.src = "../images/warn.png";
            warn_message.style.color = "#FF9600";
            break;

        case "Error":
            warn_icon.src = "../images/error.png";
            warn_message.style.color= "#FF0000";
            break;
    }

    warn_zone.style.visibility = "visible";

    setTimeout(function()
    {
        warn_zone.style.visibility = "hidden";
    }, 4000);

}


/*
* Page load timer
*/
function stopwatch()
{
    var timer = document.createElement('p');
    timer.setAttribute("id", "loading");

    var sec = ((new Date()).getTime() - before_loading)/1000;
    
    timer.innerHTML = "Page loaded in : " + sec + " seconds.";
    document.getElementsByTagName('footer')[0].insertAdjacentHTML('beforeend', timer.outerHTML)
}

/*
* Update the archive table
*/
function archive_update(archive)
{
    // get all rows of archive body
    var rows = document.getElementById("archive_body").getElementsByTagName("tr");

    // for each rows
    for(var cpt = 0; cpt < rows.length; cpt++)
    {
        // get the row's cell
        var cells = rows[cpt].getElementsByTagName("td");
        
        // an entry is available for row
        if (cpt < archive.length)
        {
            // fill cells with data
            cells[0].innerHTML = date_formatting(archive[cpt]['date'], true);
            cells[1].innerHTML = "<a href='audit/" + archive[cpt]["_id"] + "'>" + archive[cpt]["target_main"] + "</a>";
        }
        else // no more data to set
        {
            // set the cells empty
            cells[0].innerHTML = "&nbsp;";
            cells[1].innerHTML = "&nbsp;";
        }
    }
}


/*
* update an audit result div
*/
function result_update(audit_id, scanner)
{
    var elements = {};

    // main elements div (header, body);
    elements.header = document.getElementById(scanner.concat('_header'));
    elements.body = document.getElementById(scanner.concat('_body'));

    // sub elements (progress, button, result)
    elements.progress = elements.header.getElementsByTagName('img')[1];
    elements.display = elements.header.getElementsByTagName('button')[0];
    elements.result = elements.body.getElementsByTagName('object')[0];

    // set the progress bar to done
    elements.progress.src= '/images/animated/_progress.gif';

    // set enabled background img to button, then enable it
    elements.display.style.backgroundImage = "url('/images/animated/_display.gif')";
    elements.display.style.cursor = "pointer";
    elements.display.disabled = false;

    // load source of result object 
    elements.result.data = "../../audits/" + audit_id + "/" + scanner + ".html";

    // increment the number of audit done in title
    update_audit_title()
}