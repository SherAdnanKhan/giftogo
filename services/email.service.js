var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASS
    }
});



const sendemail = async (bodyhtml, emailto, subject) => {

    var mailOptions = {
        from: 'no-reply@giftogo.co', //It will work if i give me@myserver.com but i need no-reply@myserver.com in from option.        
        to: emailto,
        subject: subject,
        // text: bodytext,
        html: bodyhtml,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendemail
}


