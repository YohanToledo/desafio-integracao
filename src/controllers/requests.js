const { default: axios } = require("axios");
require('dotenv').config();
const { GOOGLE_BASE_URL } = require("../utils/baseUrl");

module.exports.getSpreadsheetValues = async function(req, res){
    let range = "A1:E20";
    var spreadsheetId = process.env.SPREADSHEET_ID;
    var key = process.env.GOOGLE_API_KEY;
    var contacts = [];

    
    await axios.get(`${GOOGLE_BASE_URL}/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`).then(response => {
        var contactList = response.data.values;
        for(var i = 0; i < contactList.length; i++){
            contacts.push({
                'empresa': contactList[i][0],
                'nome': contactList[i][1],
                'email': contactList[i][2],
                'tel': contactList[i][3],
                'site': contactList[i][4]
            });
        }
        //console.log(contacts)
        
    }).catch(function (error) {
        if (error.request) {
            console.log(error.request);
        }
    });

    res.status(200).send({
        contacts: contacts
    });
    
};



/*
contact: {
    company: "Biglytics",
    email: "bcooper@biglytics.net",
    firstname: "Bryan",
    lastname: "Cooper",
    phone: "(877) 929-0687",
    website: "biglytics.net"
}

*/

module.exports.sendHubspotContact = function (contact){

    var token = process.env.HUBSPOT_TOKEN;

    const config = {
        baseURL: "https://api.hubapi.com",
        method: 'POST',
        url: '/crm/v3/objects/contacts',
        data: {
            properties: {
                company: "Biglytics",
                email: "bcooper@biglytics.net",
                firstname: "Bryan",
                lastname: "Cooper",
                phone: "(877) 929-0687",
                website: "biglytics.net"
            }
        },
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    } 
    
    axios(config).then(response => {
        console.log(response);
    })
}

function parseContact(list){
    var contacts = [];
    for(var i = 0; i < list.length; i++){
        contacts.push({
            'empresa': list[i][0],
            'nome': list[i][1],
            'email': list[i][2],
            'tel': list[i][3],
            'site': list[i][4]
        });
    }
}


function splitName(name) { 
    var names = name.split(" ");
    return names;
}

function isValidEmailDomain(email){
    const dominios = ["gmail", "outlook", "yahoo", "hotmail", "uol", "bol", "live"]
    email = email.split("@")[1];
    email = email.split(".")[0];

    if(dominios.includes(email)){
        return false;
    }
    else {
        return true;
    }
}

module.exports = { splitName, isValidEmailDomain };

