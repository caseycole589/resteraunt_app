const mongoose = require('mongoose');
//think of global as window
mongoose.Promise = global.Promise;
const slug = require('slugs');
/*slug will be auto generated when somebody saves*/
const storeSchema = new mongoose.Schema({
	name:{
		type:String,
		trim: true,
		required:'Please enter a store name' 
	},
	slug:String,
	description:{
		type:String,
		trim: true
	},
	tags: [String]

});

storeSchema.pre('save',function(next){
	// only needs to be ran if name is new or changed
	if (!this.isModified('name')) {
		return next();
	}
	this.slug = slug(this.name);
	next();
	//Todo make more resiliant so that names are guranteed to be unique
})
module.exports = mongoose.model('Store', storeSchema);