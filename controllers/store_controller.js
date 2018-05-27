exports.homePageMiddleware = (req, res, next) => {
	req.name = 'casey'
	next();//callback
}
exports.homePage = (req, res) => {
	console.log(req.name)
	res.render('index');
}