'use strict';
const nodemailer = require('nodemailer');
const env_vars = require('./Constants');
//var jsonPass = require('../config/config_val');

// Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: env_vars.host,
        port: env_vars.smtpPort,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.consumables_email, // generated ethereal user
           // pass: jsonPass.password// generated ethereal password
          pass:process.env.consumables_mail_pass
        }
    });

    module.exports = {transporter}