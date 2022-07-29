const express = require('express');
const { default: axios } = require("axios");
const requests = require('../controllers/requests');

const router = express.Router();
router.get('/', async function (req, res, next) {

    requests.getSpreadsheetValues(req, res);
    requests.sendHubspotContact();
    
});
module.exports = router;