const express = require('express');
const router = express.Router();
const store_controller = require('../controllers/store_controller')
const {catchErrors} = require('../handlers/errorHandlers')

router.get('/', store_controller.homePage);
router.get('/add', store_controller.addStore);
router.post('/add', catchErrors(store_controller.createStore));

module.exports = router;
