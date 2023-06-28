import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';

// http://ethereal.email/create
let nodeConfig = {
    host : "smtp.ethereal.email",
    port : 587,
    secure : false, // true for 465, false for other ports
    auth : {
        user : ENV.EMAIL, // generate ethereal user
        pass : ENV.PASSWORD // generate ethereal password
    }
}

let transporter = nodemailer.createTransport(nodeConfig)

let MailGenerator = new Mailgen({
    theme : "default",
    product : {
        name : "Mailgen",
        link : "https://mailgen.js/"
    }
})

 /** POST http://localhost:8080/api/registerMail
  * @params : {
    "username" : "example123",
    "userEmail" : "example123@gmail.com",
    "text" : "Testing Mail",
    "subject" : "Backend Mail Request "

}
  */

export const registerMail = async (req, res) => {
    const {username, userEmail, text, subject} = req.body;
    var email = {
        body : {
            name : username,
            intro : text || "Welcome my friend",
            outro : "thank you very much",
        }
    }
    
    var emailBody = MailGenerator.generate(email)

    let message = {
        from : ENV.EMAIL,
        to : userEmail,
        subject : subject || "Signup Successful",
        html : emailBody
    }

    // send mail
    transporter.sendMail(message)
    .then(() =>{
        return res.status(200).send({msg : "You should receive an email from us."})
    })
    .catch(err => {return res.status(500).send({err})})
}