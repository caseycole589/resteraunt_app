const express = require('express');
const router = express.Router();
const store_controller = require('../controllers/store_controller')


router.get('/', store_controller.homePageMiddleware, store_controller.homePage);


module.exports = router;
