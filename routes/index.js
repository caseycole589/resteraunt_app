const express = require('express');
const router = express.Router();

router.get('/', (req, resp) => {
	// resp.send("string")
	// resp.json(js_object);
	// req.body for posted params
	// send back the query aka the echo server
	// resp.send(req.query);
	resp.render('hello')
});

router.get('/reverse/:string_to_reverse', (req, resp) => {
	//split the string
	const reversed_string = [...req.params.string_to_reverse].reverse().join('');
	resp.send(reversed_string);
})

module.exports = router;
