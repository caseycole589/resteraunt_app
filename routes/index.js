const express = require('express');
const router = express.Router();

// send resp as json resp.json(jsObject)
router.get('/', (req, resp) => {
	const message = {
		"message": "Hello Wolrd!",
		"quoteBy": "Dennis Ritchie"
	};
	// resp.send("string")
	// resp.json(message);
	// send back the query aka the echo server
	resp.send(req.query);
});

router.get('/reverse/:string_to_reverse', (req, resp) => {
	//split the string
	const reversed_string = [...req.params.string_to_reverse].reverse().join('');
	resp.send(reversed_string);
})

module.exports = router;
