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
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); /*they are logged in*/
    }
    req.flash('error', 'You Must Be Logged In To Do That')
    res.redirect('/login');
}