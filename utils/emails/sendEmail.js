const postmark = require("postmark");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
    try {
        var client = new postmark.ServerClient(process.env.POSTMARK_CLIENT);
        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars.compile(source);

        client.sendEmail({
            "From": process.env.FROM_EMAIL,
            "To": email,
            "Subject": subject,
            "HtmlBody":  compiledTemplate(payload),            
            "MessageStream": "outbound"
          });
       
    } catch (error) {
        return error;
    }
};



module.exports = sendEmail;