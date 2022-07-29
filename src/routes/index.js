const express = require('express');
const requests = require('../controllers/requests');


const router = express.Router();
router.get('/', async function (req, res, next) {
    res.render('index');
});

router.post('/', function(req, res, next){
    console.log(req.body);
    //res.redirect("/");
    requests.getSpreadsheetValues(req, res);
})

module.exports = router;