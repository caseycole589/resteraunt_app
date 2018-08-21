const passport = require('passport');

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