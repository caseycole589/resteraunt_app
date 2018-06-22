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
exports.editStore = async (req, res) => {
	//find the store with given id
	const store = await Store.findOne({_id: req.params.id})
	//confirm they are owner of store
	//TODO
	//render out the edit form so user can update
	res.render('editStore',{title: 'Edit Store', store});
}

exports.updateStore = async (req, res) => {
 	//find and update store 
 	const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
 		new: true,//return new store instead of old one
 		runValidators:true,
 	}).exec()
 	//redirect to store save success
 	req.flash('success', `Successfully Updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`)
 	res.redirect(`/stores/${store._id}/edit`);
}