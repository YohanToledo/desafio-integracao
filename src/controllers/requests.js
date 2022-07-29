const { default: axios } = require("axios");
require('dotenv').config();
const { GOOGLE_BASE_URL } = require("../utils/baseUrl");

getSpreadsheetValues = async function(req, res){
    let range = "A1:E20";
    var spreadsheetId = process.env.SPREADSHEET_ID;
    var key = process.env.GOOGLE_API_KEY;
    var contacts = [];

    
    await axios.get(`${GOOGLE_BASE_URL}/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${key}`).then(response => {
        var contactList = response.data.values;
        for(var i = 0; i < contactList.length; i++){
            var names = splitName(contactList[i][1]);
            var email = contactList[i][2];
            if(isValidEmailDomain(email)){
                contacts.push({
                    'company': contactList[i][0],
                    'email': email,
                    'firstname': names[0],
                    'lastname': names[1],
                    'phone': contactList[i][3],
                    'website': contactList[i][4]
                });
            }
            else{
                console.log("O contato presente na linha " + (i+1) + " nao possui um email corportativo");
            }
            
        }
        //console.log(contacts)
        
    }).catch(function (error) {
        if (error.request) {
            console.log(error.request);
        }
    });

    createHubspotContacts(contacts);

    res.status(200).send({
        contacts: contacts
    });
    
};

createHubspotContacts = async function (list){
    for(var i = 0; i < list.length; i++){
        await sendHubspotContact(list[i]);
    }
}

sendHubspotContact = function (contact){

    var token = process.env.HUBSPOT_TOKEN;

    const config = {
        baseURL: "https://api.hubapi.com",
        method: 'POST',
        url: '/crm/v3/objects/contacts',
        data: {
            properties: contact
        },
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    } 
    
    axios(config).then(response => {
        if(response.status === 201){
            console.log("Contato criado com sucesso!");
            console.log(contact);
        }
    }).catch(error => {
        if (error.response.status === 409){
            console.log("Contato já existe!");
            console.log(contact);
        }
        else{
            console.log("Ocorreu um erro inesperado!");
            console.log("Response status=" + error.response.status);
            console.log(error.response.statusText);
        }
    })
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

module.exports = { 
    splitName, 
    isValidEmailDomain,
    getSpreadsheetValues,
    sendHubspotContact
};

