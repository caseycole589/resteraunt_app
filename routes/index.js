const express = require('express');
const router = express.Router();
const store_controller = require('../controllers/store_controller')
const {catchErrors} = require('../handlers/errorHandlers')

router.get('/', catchErrors(store_controller.getStores));
router.get('/stores', catchErrors(store_controller.getStores));
router.get('/add', store_controller.addStore);
router.post('/add', catchErrors(store_controller.createStore));
router.post('/add/:id', catchErrors(store_controller.updateStore));
router.get('/stores/:id/edit', catchErrors(store_controller.editStore));
module.exports = router;
