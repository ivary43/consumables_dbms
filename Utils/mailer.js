'use strict';
const nodemailer = require('nodemailer');
const env_vars = require('./Constants');
// var jsonPass = require('../config/config_val');

// Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: env_vars.host,
        port: env_vars.smtpPort,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'manish.cs16@iitp.ac.in', // generated ethereal user
            pass: process.env.mail_pass// generated ethereal password
        }
    });

    module.exports = {transporter}