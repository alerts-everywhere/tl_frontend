require('dotenv').config();
const token = process.env.TOKEN;
const telegramBot = require("./localModules/telegramBot/telegramBot");

//creation of bot
const tlBot = telegramBot.createBot(token);

tlBot.addExternalCommand("new_availabilities", function(body){
    let text = `new availabilities detected for the ${body.date}:\n`
    body.availabilities.forEach((row) => {
        text += `- ${row.name} (${row.size}m²): from ${row.start_time} to ${row.end_time}\n`
    })
    text += `\nGo to ${body.url} to make a reservation`
    tlBot.sendMessage(body.to, text)
})

exports.entryPoint = tlBot.entryPoint
