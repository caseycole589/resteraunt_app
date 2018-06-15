const mongoose = require('mongoose');
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
	res.render('index');
}

exports.addStore = (req, res) => {
	// res.send('it works')
	res.render('editStore', { title: 'Add Store'})
}

exports.createStore = async (req, res) => {
	const store = await (new Store(req.body)).save();// fires off connection to mongo db database
	req.flash('success', `Successfully Created ${store.name}! Care To Leave A Review?`);
	res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
	// query the database for list of all stores before doing anything else
	const stores = await Store.find();
	//because of es6 can just past stores because is is the same as the variable name
	//eg stores: stores
	res.render('stores', {title: 'Stores', stores})
}