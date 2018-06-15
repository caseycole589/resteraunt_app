const express = require('express');
const router = express.Router();
const store_controller = require('../controllers/store_controller')
const {catchErrors} = require('../handlers/errorHandlers')

router.get('/', catchErrors(store_controller.getStores));
router.get('/stores', catchErrors(store_controller.getStores));
router.get('/add', store_controller.addStore);
router.post('/add', catchErrors(store_controller.createStore));

module.exports = router;
