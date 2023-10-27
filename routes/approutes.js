const express = require('express');
const appcontroller = require('../controllers/appcontroller');
const authmiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/app',appcontroller.app);

router.post('/sendmessage',authmiddleware.authenticate,appcontroller.send)

module.exports = router ;