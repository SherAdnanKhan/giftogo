var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'server148.web-hosting.com', 
    port: 465, 
    auth: {
        user: 'no-reply@giftogo.co',
        pass: 'giftogodev!@#$'
    }
});



const sendemail=async (bodyhtml,emailto,subject)=>{

    var mailOptions = {
        from: 'no-reply@giftogo.co', //It will work if i give me@myserver.com but i need no-reply@myserver.com in from option.        
        to: emailto,
        subject: subject,
        // text: bodytext,
        html:bodyhtml,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
         console.log(error);
        } else {
         console.log('Email sent: ' + info.response);
        }
    });
}

module.exports={
    sendemail
}

 
