
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
  dishes: function(bot, message) {
  
    const wanted = message.match[1]
    const wanted_lower = wanted.toLowerCase()
    const available = Menu[0].message.split('\n')
    const dishes = []

    for (let line of available) {
      let hit = line.toLowerCase().includes(wanted_lower)
      if (hit) dishes.push(line.trim())
    }

    var answer = ''
    if (dishes.length > 0) {
      answer = 'Good news! You can have '
      answer += dishes.join(' or ')
      answer += ' today!'
    }
    else {
      answer = 'Bad luck, no '+wanted+' today :disappointed:'
    }

    bot.reply(message, answer)
  }
}

const controller = Botkit.slackbot({
  debug: false
})
controller.hears(['menu','today'], commands.listen_to, commands.menu)
controller.hears(['(\\w.*\\b)\\^?', '(\\w.+\\b)\\^!'], commands.listen_to, commands.dishes)

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
