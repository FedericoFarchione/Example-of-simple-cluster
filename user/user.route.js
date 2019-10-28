const express    = require('express');
const router     = express.Router();
const controller = require('./user.controller.js');


router.post('/posta', controller.save_user);
router.get('/get/:par1', controller.hello_user);

module.exports = router;
