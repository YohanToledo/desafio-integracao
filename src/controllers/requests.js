const { default: axios } = require("axios");
require('dotenv').config();
const { GOOGLE_BASE_URL, HUBSPOT_BASE_URL } = require("../utils/baseUrl");

var google_key = "";
var sheet_id = "";
var hub_token = "";

getSpreadsheetValues = async function (req, res) {
    let range = "A1:E50";

    if (req.body.googleKey === '' || req.body.spreadsheet === '' || req.body.hubspotToken === '') {
        res.redirect("/");
        return;
    }
    sheet_id = req.body.spreadsheet;
    google_key = req.body.googleKey;
    hub_token = req.body.hubspotToken;
    var contacts = [];


    await axios.get(`${GOOGLE_BASE_URL}/v4/spreadsheets/${sheet_id}/values/${range}?key=${google_key}`).then(response => {
        var contactList = response.data.values;
        for (var i = 0; i < contactList.length; i++) {
            var names = splitName(contactList[i][1]);
            var email = contactList[i][2];
            if (isValidEmailDomain(email)) {
                contacts.push({
                    'company': contactList[i][0],
                    'email': email,
                    'firstname': names[0],
                    'lastname': names[1],
                    'phone': contactList[i][3],
                    'website': contactList[i][4]
                });
            }
            else {
                console.log("O contato presente na linha " + (i + 1) + " nao possui um email corportativo! Registro ignorado.");
            }

        }
        sendHubspotContact(res, contacts);

    }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }

        return res.redirect('/error');
    });
};


sendHubspotContact = async function (res, list) {

    var token = hub_token;
    var return_type = 0;
    var axiosError = {};

    try {
        for (var i = 0; i < list.length; i++) {

            const config = {
                baseURL: HUBSPOT_BASE_URL,
                method: 'POST',
                url: '/crm/v3/objects/contacts',
                data: {
                    properties: list[i]
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }

            await axios(config).then(response => {
                if (response.status === 201) {
                    console.log("Contato criado com sucesso!");
                    console.log(list[i]);
                    return_type = 201;
                }
            }).catch(error => {
                axiosError = error.response.data;
                if (error.response.status === 409) {
                    console.log("Contato já existente!");
                    console.log(list[i]);
                    return_type = 409;
                }
                else if (error.response.status === 401) {
                    //console.log("unauthorized");
                    return_type = 401;
                }
                else {
                    console.log("Ocorreu um erro inesperado!");
                    console.log("Response status=" + error.response.status);
                    console.log(error.response.statusText);
                    return_type = error.response.status;
                }

            })
        }
    } catch (err) {
        console.log(err);
    }
    finally {
        if (return_type === 201 || return_type === 409) {
            return res.redirect('/success');
        }
        else {
            console.log(axiosError);
            return res.redirect('/error');
        }
    }
}




function splitName(name) {
    var names = name.split(" ");
    return names;
}

function isValidEmailDomain(email) {
    const dominios = ["gmail", "outlook", "yahoo", "hotmail", "uol", "bol", "live"]
    email = email.split("@")[1];
    email = email.split(".")[0];

    if (dominios.includes(email)) {
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

