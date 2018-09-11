const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require("jimp");
const uuid = require('uuid');
const User = mongoose.model("User");


const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/')
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That file type is not allowed' }, false);
        }
    }
}

exports.homePage = (req, res) => {
    res.render('index');
}

exports.addStore = (req, res) => {
    // res.send('it works')
    res.render('editStore', { title: 'Add Store' })
}


exports.upload = multer(multerOptions).single('photo');

exports.resize = async(req, res, next) => {
    //check if there is no new file
    if (!req.file) {
        return next();
    }
    const extension = req.file.mimetype.split('/')[1];

    req.body.photo = `${uuid.v4()}.${extension}`;

    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
}

exports.createStore = async(req, res) => {
    req.body.author = req.user._id;
    const store = await (new Store(req.body)).save(); // fires off connection to mongo db database

    req.flash('success', `Successfully Created ${store.name}! Care To Leave A Review?`);
    res.redirect(`/store/${store.slug}`);
}

exports.getStores = async(req, res) => {
    // query the database for list of all stores before doing anything else
    const stores = await Store.find();
    //because of es6 can just past stores because is is the same as the variable name
    //eg stores: stores
    res.render('stores', { title: 'Stores', stores })
}
const confirmOwner = (store, user) => {
    if (!store.author.equals(user._id)) {
        throw Error("You Must Own A Store In Order To Edit It");
    }
}
exports.editStore = async(req, res) => {
    //find the store with given id
    const store = await Store.findOne({ _id: req.params.id })
    //confirm they are owner of store
    confirmOwner(store, req.user);
    //render out the edit form so user can update
    res.render('editStore', { title: 'Edit Store', store });
}

exports.updateStore = async(req, res) => {
    //set location data to be a point
    req.body.location.type = "Point";
    //find and update store 
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //return new store instead of old one
        runValidators: true,
    }).exec()
    //redirect to store save success
    req.flash('success', `Successfully Updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`)
    res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async(req, res, next) => {
    //request.params for get req.body for pos 
    const store = await Store.findOne({ slug: req.params.slug }).populate('author')
    if (!store) {
        //throw 404 
        return next();
    }
    res.render('store', { store, 'title': store.name })
}

exports.getStoresByTag = async(req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery })

    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
    res.render('tag', { tags, stores, title: "Tags", tag })
    // res.json(results)
}
exports.searchStores = async(req, res) => {
    const stores = await Store
        // first find store
        .find({
            $text: {
                $search: req.query.q
            }
        }, {
            score: { $meta: 'textScore' }
        })
        .sort({
            score: { $meta: 'textScore' }
        })
        .limit(5);
    res.json(stores);
}
exports.mapStores = async(req, res) => {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000
            }
        }
    }
    const stores = await Store.find(q).select('name description location slug photo').limit(10);
    res.json(stores)
}

exports.mapPage = (req, res) => {
    res.render('map', { title: 'Map' })
}

exports.heartStore = async(req, res) => {
    const hearts = req.user.hearts.map(obj => obj.toString())
    const operator = hearts.includes(req.params.id) ? "$pull" : "$addToSet";
    const user = await User.findByIdAndUpdate(req.user.id, {
        [operator]: { hearts: req.params.id }
    }, { new: true })
    res.json(user)
}

exports.getHearts = async(req, res) => {
    if (req.user.hearts) {
        const stores = await Store.find({
            _id: { $in: req.user.hearts }
        })
    }
    res.render('stores', { title: "Hearted Stores", stores })
}