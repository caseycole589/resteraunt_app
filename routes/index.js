const express = require('express');
const router = express.Router();
const store_controller = require('../controllers/store_controller')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/stores', catchErrors(store_controller.getStores));
router.get('/add', store_controller.addStore);
router.post('/add',
    store_controller.upload,
    catchErrors(store_controller.resize),
    catchErrors(store_controller.createStore)
);
router.post('/add/:id',
    store_controller.upload,
    catchErrors(store_controller.resize),
    catchErrors(store_controller.updateStore)
);

router.get('/stores/:id/edit', catchErrors(store_controller.editStore));
router.get('/store/:slug', catchErrors(store_controller.getStoreBySlug))

router.get('/tags', catchErrors(store_controller.getStoresByTag));
router.get('/tags/:tag', catchErrors(store_controller.getStoresByTag));
module.exports = router;