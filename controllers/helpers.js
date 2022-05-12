const moment = require("moment");
const Mailgun = require("mailgun.js");
const formData = require("form-data");

const mailgun = new Mailgun(formData);;
const mail = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });



module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format);
    },
    truncate: function(text, size) {
        if (text.length > size && text.length > 0) {
            let newText = text + " ";
            newText = text.substr(0, size);
            newText = text.substr(0, newText.lastIndexOf(" "));
            newText = newText.length > 0 ? newText : text.substr(0, size);
            return newText + "...";
        }
        return text;
    },
    scriptTags: function(text) {
        return text.replace(/<(?:.|\n)*?>/gm, "");
    },
    select: function(selected, options) {
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
            );
    },
    sendEmail: (response, subject, email, html, successMessage, errorMessage) => {
        const data = {
            from: 'Benion-Tech <me@samples.mailgun.org>',
            to: email,
            subject,
            html
        };
        mail.messages.create(process.env.MAILGUN_DOMAIN, data)
            .then(message => {
                console.log(successMessage, message);
                return response.status(200).json({
                    success: true, 
                    message: successMessage,
                    responseMessage: message
                });
            })
            .catch(error => {
                console.log(errorMessage, error);
                return response.status(401).json({ 
                    success: false, 
                    error: errorMessage,
                    responseError: error.message 
                });
            });
    }
};