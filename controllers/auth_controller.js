const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User')
const promisify = require('es6-promisify')
const mail = require('../handlers/mail');

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
        req.flash('success', 'You Have Been Emailed A Password Reset Link');
        return res.redirect('/login');
    }
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 36000000 // 1 hour from now
    await user.save()
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user,
        resetURL,
        subject: 'Password Reset',
        filename: 'password-reset'
    })
    req.flash('success', `You Have Been Emailed A Password Reset Link`)
    res.redirect('/login');
}
exports.reset = async(req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    })
    if (!user) {
        req.flash('error', "Password Reset Is Invalid Or Expired");
        return res.redirect('/login')
    }
    //show reset form
    res.render('reset', { title: "Reset Your Password" })
}

exports.confirmedPasswords = async(req, res, next) => {
    if (req.body.password === req.body['confirm-password']) {
        return next();
    }
    req.flash('error', 'Passwords Do Not Match');
    res.redirect('back')
}

exports.update = async(req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
        req.flash('error', "Password Reset Is Invalid Or Expired");
        return res.redirect('/login')
    }
    const setPassword = promisify(user.setPassword, user)
    await setPassword(req.body.password);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined
    const updatedUser = await user.save();
    await req.login(updatedUser)
    req.flash('success', 'Your Password Has Been Reset')
    res.redirect('/')
}