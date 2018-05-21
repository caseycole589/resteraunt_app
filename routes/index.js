const express = require('express');
const router = express.Router();

// send resp as json resp.json(jsObject)
router.get('/', (req, resp) => {
	const message = {
		"message": "Hello Wolrd!",
		"quoteBy": "Dennis Ritchie"
	};
	// resp.send("string")
	resp.json(message);
});

module.exports = router;
