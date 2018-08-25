const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User')

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: "Failed Login!",
    successRedirect: '/',
    successFlash: 'You Are Logged In'
})

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You Are Now Logged Out');
    res.redirect('/');
}
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); /*they are logged in*/
    }
    req.flash('error', 'You Must Be Logged In To Do That')
    res.redirect('/login');
};

exports.forgot = async(req, res) => {
    //check user exist
    //set reset tokens and expiry
    //send reset tokenP
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'A Password Reset Has Been Mailed To You');
        return res.redirect('/login');
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString();
    user.resetPasswordExpires = Date.now() = 36000000 // 1 hour from now

}