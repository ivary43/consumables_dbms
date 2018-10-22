const LocalStrategy = require('passport-local').Strategy;

let config_passport = (passport)=> {
    var Faculty = require('../models/Faculty');
    passport.use(new LocalStrategy(Faculty.authenticate()));
    passport.serializeUser(Faculty.serializeUser());
    passport.deserializeUser(Faculty.deserializeUser());

};

module.exports = {
  config_passport
};