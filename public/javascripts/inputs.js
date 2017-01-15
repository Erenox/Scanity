"use strict";
/* inputs.js
 * Contain inputs & client side rendering
 * Created by : Erenox the : 10/07/2016
 * Last update : 14/01/2011
 */

/* regex for client part validation */

//- domain name with www prefix
var domain = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,70}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/;

//- ip without leading zero
var host = /^([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])$/;

/*
* Pre-validation - unlock scan type
*/
function manage_type(audit_type)
{
    var type =  document.getElementById('type');
    var selector = document.getElementById('select');

    type.style.display = 'table';

    if (audit_type === 'host')
    {
        type.getElementsByTagName('select')[0].selectedIndex = '0';
        selector.disabled = true;
    }
    else if (audit_type === 'domain')
    {
        type.getElementsByTagName('select')[0].selectedIndex = '1';
        selector.disabled = false;
    }
}

/*
* pre-validation - inputs - (client side)
*/
function validate_input(element, revalidate)
{
    var target_type = element.name.substring(6 , element.name.length-1 );
    var submit = document.getElementsByName('submit[' + target_type + ']')[0];
    var terms  = document.getElementsByName('setting[terms]')[0];
    var terms_label = document.getElementById('terms_label');
    var validation = false;

    /* input text field manager */
    if (element.value.length === 0) // field is clear
    {
        /* display audit type fields*/
        if (target_type === 'domain') 
        {
            document.getElementById('host').style.display = 'table';
        }
        else if (target_type === 'host') 
        {
            document.getElementById('domain').style.display = 'table';
        }
        // hide the audit type field
        document.getElementById('type').style.display = "none";
        /****************************/

        element.style.backgroundColor = '#222222'; // reset background color
    }
    else // field contain something
    {

        /* hide unwanted  fields */
        if (target_type === 'domain') // domain based
        {
            document.getElementById('host').style.display = 'none';
        }
        else if (target_type === 'host') //host based
        {
            document.getElementById('domain').style.display = 'none';
        }
        if(!revalidate)
            manage_type(target_type);
        /****************************/


        /* check input validity (client side) */
        if (target_type === 'host' && element.value.match(host) || target_type === 'domain' && element.value.match(domain)) // match
        {
            element.style.backgroundColor = 'green'; // notify validity

            // check for submitting
            if (terms.checked === true)
            {
                validation = true;
            }
        }
        else  // not match
        {
            element.style.backgroundColor = 'red'; // notify unvalidity
        }
        /************************************/

    }

    if (validation) // allow client submitting
    {
        submit.style.color = 'green';
        submit.disabled = false;
    }
    else // deny client submitting
    {
        submit.style.color = 'white';
        submit.disabled = true;
    }
}

/*
* Pre-validation - settings - (client side)
*/
function validate_setting(element)
{
    // setting - terms
    if(element.name === 'setting[terms]')
    {
        /* checkbox : terms style */
        if (element.checked)
        {
            document.getElementById('terms_label').style.color = 'white'; // OK
        }
        else
        {
            document.getElementById('terms_label').style.color = 'red'; // required
        }
        /*************************/

        /* recheck inputs validation */
        if(document.getElementById('domain').style.display != 'none')
        {
            validate_input(document.getElementsByName('input[domain]')[0], true);
        }
        else if(document.getElementById('host').style.display != 'none')
        {
            validate_input(document.getElementsByName('input[host]')[0], true);
        }
        /*****************************/

    }
    else if(element.name === 'setting[archive]') // setting - archive
    {
        /* checkbox : archive */
        if (element.checked === false)
        {
            document.getElementById('archive_label').style.color = 'white';
        }
        else
        {
            document.getElementById('archive_label').style.color = 'orange';
        }
        /**********************/
    }
}


/*
* Pre-validation - search - (client side)
*/
function validate_search(input)
{
    var search_box = document.getElementById('search_input');
    var search_button = document.getElementById('sub_search');

    if(input.length === 0)
    {
        archive_search();
        search_box.style.backgroundColor = '#303030';
        search_button.disabled = true;
    }
    else if(input.length < 3 && input.length !== 0)
    {
        search_box.style.backgroundColor = 'red';
        search_button.disabled = true;
    }
    else if(input.length >= 3 && input.length < 30)
    {
        search_box.style.backgroundColor = 'green';
        search_button.disabled = false;
    }
}

/*
* Element highlight by opacity
*/
function highlight(element, enabled)
{
    if(enabled)
    {
        element.style.opacity = "0.9";
        element.style.filter  = 'alpha(opacity=90)'; // IE fallback
    }
    else
    {
        element.style.opacity = "0.6";
        element.style.filter  = 'alpha(opacity=60)'; // IE fallback
    }
}

/*
* Formatting date using client timezone.
*/
function date_formatting(in_date, short)
{
    // date : casting
    in_date = new Date(in_date);
    
    // date : apply timezone
    var out_date = new Date(in_date.getTime() + ( Math.abs(new Date().getTimezoneOffset()) * 60000 )).toUTCString();

    // date : formatting
    if(short)
    {
        return out_date.substr(4, 18);
    }
    else
    {
        return out_date.substr(4, 21);
    }

}

/*
* rendering date to element.
*/
function date_rendering(in_date)
{
    document.write(date_formatting(in_date, false));
}

/*
* return a scanner short description
*/
function get_description(name)
{
    switch(name)
    {
        case 'common' :
            document.write('Common things (whois, ipreverse).');
            break;

        case 'whatweb' :
            document.write('Recognises web technologies , frameworks and content management systems.');
            break;

        case 'sslyze' :
            document.write('Check for ciphers of the SSL/TLS service, and possible vulnerabilities like heartbleed.');
            break;

        case 'nmap' :
            document.write('Discover hosts and services on a computer network, OS detection, port scanning.');
            break;

        case 'nikto' :
            document.write('Discover dangerous files and disclosures, identify installed web servers and software.');
            break;

        case 'arachni' :
            document.write('Scan the most common vulnerabilities (sql,xss,injection,exec,bypass,disclosures.)');
            break;

        case 'joomlavs' :
            document.write('Joomla dedicated finger printing and vulnerability scanner.');
            break;

        case 'wpscan' :
            document.write('WordPress dedicated finger printing and vulnerability scanner.');
            break;

        case 'droopescan' :
            document.write('Plugin-based CMS security scanner mainly for Drupal and Silverstripe.');
            break;
    }
}

/*
* Set audit page title
*/
function set_audit_title(audit_done, audit_total)
{
    if (audit_done != audit_total)
    {
        document.title = 'Audit : [' + audit_done + '/' + audit_total + ']';
    }
    else
    {
        document.title = 'Audit done.';
    }
}


/*
* Update audit page title
*/
function update_audit_title() 
{
    var progress = document.getElementsByName('progress');
    
    var done = 0;
    for(var cpt=0; cpt<progress.length; cpt++)
    {
        if (progress[cpt].src.includes('_'))
            done += 1;
    }

    set_audit_title(done,progress.length);
}