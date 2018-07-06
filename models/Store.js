const mongoose = require('mongoose');
//think of global as window
mongoose.Promise = global.Promise;
const slug = require('slugs');
/*slug will be auto generated when somebody saves*/
const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates!'
        }],
        address: {
            type: String,
            required: 'You must supply an address'
        }
    },
    photo: String
});

storeSchema.pre('save', async function(next) {
    // only needs to be ran if name is new or changed
    if (!this.isModified('name')) {
        return next();
    }
    this.slug = slug(this.name);
    //find other store with the same name
    // i is case insensitive 
    //^startof string matchest this.slug at start
    //$ end matches $t in eat but not the t in eater
    //() remembers match
    //-[0-9]* mattch -digits 0 through 9, 0 0r more times 
    //question mark means optional
    const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
    const storesWithSlug = await this.constructor.find({ slug: slugRegex });
    //if already there add ke with length plus one
    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length+1}`;
    }
    next();
    //Todo make more resiliant so that names are guranteed to be unique
})

storeSchema.statics.getTagsList = function() {
    //unwind: Deconstructs an array field from the input documents to output a document
    //for each element.Each output document is the input document with the value of the array field replaced by the element.

    // sort -1 asc 1 des
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: "$tags", count: { $sum: 2 } } },
        { $sort: { count: -1 } }
    ]);
}


module.exports = mongoose.model('Store', storeSchema);