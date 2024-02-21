const moment = require("moment");
const Mailgun = require("mailgun.js");
const formData = require("form-data");
const TelegramBot = require('node-telegram-bot-api')

const mailgun = new Mailgun(formData);;
const mail = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
const id = 1829173846
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true})

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (message) => {
    const chatId = message.chat.id
    const text = message.text.slice(1, message.length)
  
    if (message.text[0] === "/") {
      switch (text) {
          case "start":
              bot.sendMessage(chatId, "Hi! I'm a bot. I can help you to get started !!")
              break
          case "help":
              bot.sendMessage(chatId, "Sorry, no command at the moment")
              break
          default:
              bot.sendMessage(chatId, "Hey hi i don't know what that command is !!")
              break;
      }
    } else {
      bot.sendMessage(chatId, `Received "${message.text}" as your message !!!`)
    }
})
  
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
    sendEmail: (response, subject, email, html, successMessage, errorMessage, message) => {
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

        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(id, message)
            .then(message => {
                console.log(successMessage, message);
                return response.status(200).json({
                    success: true, 
                    message: successMessage,
                    responseMessage: message
                })
            })
            .catch(error => {
                console.log(errorMessage, error);
                return response.status(401).json({ 
                    success: false, 
                    error: errorMessage,
                    responseError: error.message 
                })
            })
    }
};