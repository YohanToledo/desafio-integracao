const express = require('express');
const requests = require('../controllers/requests');

const router = express.Router();
router.get('/', async function (req, res, next) {

    requests.getSpreadsheetValues(req, res);
    //requests.sendHubspotContact();
    
});
module.exports = router;