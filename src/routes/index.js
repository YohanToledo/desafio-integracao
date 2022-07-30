const express = require('express');
const requests = require('../controllers/requests');


const router = express.Router();
router.get('/', async function (req, res, next) {
    res.render('index');
});

router.get('/error', function (req, res, next) {
    res.render('error');
});

router.get('/success', function (req, res, next) {
    res.render('success');
});


router.post('/', function(req, res, next){
    //console.log(req.body);
    requests.getSpreadsheetValues(req, res);
});

module.exports = router;