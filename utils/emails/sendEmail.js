const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
    try {
       
        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars.compile(source);


        
        let transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          secure: true,
          port: 465,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });


        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to:email,
            subject: subject,          
            html:  compiledTemplate(payload),
          });      

          console.log("Email sent: %s", info.messageId);
              
    } catch (error) {
        return error;
    }
};



module.exports = sendEmail;