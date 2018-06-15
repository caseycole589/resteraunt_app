const mongoose = require('mongoose');
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
	res.render('index');
	req.flash('error', `Somthing Hamppend`);
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