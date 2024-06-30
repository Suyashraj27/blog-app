const nodemailer = require('nodemailer')
// nodemailer is middleware that handle email between user and node.js
const dotenv = require("dotenv");
dotenv.config({
    path:  './Config/config.env'
})
const sendEmail = async (mailOptions) =>{

    const {SMTP_HOST}=process.env.SMTP_HOST
    const {SMTP_PORT}=process.env.SMTP_PORT
    const {EMAIL_USERNAME}=process.env.EMAIL_USERNAME
    const {EMAIL_PASS}=process.env.EMAIL_PASS

    let transporter = nodemailer.createTransport({

        host : SMTP_HOST ,
        port : SMTP_PORT  ,
        auth :{
            user : EMAIL_USERNAME ,
            pass : EMAIL_PASS
        } ,
         tls: {rejectUnauthorized: false}
       
    })

    let info = await transporter.sendMail(mailOptions) ; 

    console.log(`Message send : ${info.messageId}`)

}


module.exports = sendEmail


