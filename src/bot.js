
'use strict'

const config = require('./config')
const Botkit = require('botkit')

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement)
}

var single_option = [
  "You must be reading our minds! We’ll put aside a dose of XXX just for you.",
  "Of course we do have XXX you lucky bastard!",
  "Yes, we have XXX! And let me say I personally tasted it and it's deliciously good today.",
  "XXX? Of course we have it. That’s our favourite too!",
  "Excellent choice! But you need to hurry because XXX is selling out like hot cupcakes.",
  "Your wish is our command! XXX it is!!"
]

var no_option = [
  "Sorry. No XXX for today. We started cooking it but soon realised it would not meet your highest standards.",
  "Really? XXX? With this weather? You must be kidding...",
  "No XXX today. Have a salad instead cause summer is just around the corner… Just saying :)",
  "XXX again?! We cannot have XXX everyday! Try something different for a change.",
  "Sorry. No XXX for today. We are on a strict diet and so are all our customers."
]

var multi_option = [
  "Be a little bit more specific, will ya? YYY is not a dish, it’s an ingredient you’ll find on today’s XXX.",
  "You may find YYY on today’s XXX. Now it’s up to you to choose because I'm just a bot. Not a mind reader.",
  "There are so many ways to cook YYY. Today you can choose from XXX.",
  "With YYY you can order XXX. Or be a little crazy and mix them all."
]

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
    if (dishes.length == 0) {
      answer = no_option[Math.floor(Math.random() * no_option.length)]
      answer = answer.replaceAll('XXX', wanted.capitalize())
    } else if (dishes.length == 1) {
      answer = single_option[Math.floor(Math.random() * single_option.length)]
      answer = answer.replaceAll('XXX', dishes[0])
    } else {
      answer = multi_option[Math.floor(Math.random() * multi_option.length)]
      answer = answer.replaceAll('YYY', wanted.capitalize())
      answer = answer.replaceAll('XXX', dishes.join(' or '))
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
