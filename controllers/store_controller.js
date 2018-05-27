exports.homePageMiddleware = (req, res, next) => {
	// req.name = 'casey'
	//throwing a custom error
	// if(req.name == 'casey'){
	// 	throw Error("That went wrong somehow")
	// }
	next();//callback
}
exports.homePage = (req, res) => {
	res.render('index');
}