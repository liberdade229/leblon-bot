
'use strict'

const config = require('./config')
const Botkit = require('botkit')

var Menu = []

const commands = {
  listen_to: ['direct_message','direct_mention'],
  menu: function(bot, message) {
    let latest = Menu[0].message
    bot.reply(message, latest)
  },
  plate: function(bot, message) {
  
    var plate = message.match[1]
    var lower_plate = plate.toLowerCase()
    var menu = Menu[0].message

    const lines = menu.split('\n')
    for (let line of lines) {
      var lower_line = line.toLowerCase()
      if (lower_line.includes(lower_plate)) {
        plate = line.trim()
        break
      }
    }

    let has_plate = menu.toLowerCase().includes(lower_plate)
    var answer = ''
    if (has_plate) answer = 'Good news! You can have '+plate+' today!'
    else answer = 'Bad luck, no '+plate+' today :disappointed:'

    bot.reply(message, answer)
  }
}

const controller = Botkit.slackbot({
  debug: false
})
controller.hears(['menu','today'], commands.listen_to, commands.menu)
controller.hears(['(\\w.*\\b)\\^?', '(\\w.+\\b)\\^!'], commands.listen_to, commands.plate)

const bot = {
  start: function(start_menu) {
    Menu = start_menu
    controller.spawn({token: config('SLACK_TOKEN')}).startRTM()
  },
  update: function(new_menu) {
    Menu = new_menu
  }
}

module.exports = bot
