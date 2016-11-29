
'use strict'

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
String.prototype.replaceAll = function(search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement)
}

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8')
}

const fs = require('fs')
const config = require('./config')
const Botkit = require('botkit')
const Menu = require('./menu')

const no_results = require('./data/no_results.txt').split('\n')
const single_result = require('./data/single_result.txt').split('\n')
const multiple_results = require('./data/multiple_results.txt').split('\n')
const troll_results = require('./data/troll_results.txt').split('\n')

const bot = {
  slack: Botkit.slackbot({debug: false}),
  listen_to: ['direct_message','direct_mention'],
  random_answer: function(results) {
    return results[Math.floor(Math.random() * results.length)]
  },
  menu: function(chat, message) {
    chat.reply(message, Menu.today())
  },
  help: function(chat, message) {
    chat.reply(message, "Send me a message or @mention with `menu` to get today's menu. For example, `@leblon menu`. You can also ask me to check if a particular ingredient is available today. Examples: `@leblon picanha?` or `@leblon polvo?`")
  },
  troll: function(chat, message) {
    let answer = bot.random_answer(troll_results)
                      .replaceAll('YYY', message.text)
    chat.reply(message, answer)
  },
  dishes: function(chat, message) {
    const match = message.match[1]
    if (message.text != match) return bot.troll(chat, message)

    const wanted = match.replace('?', '')
    const wanted_lower = wanted.toLowerCase()
    const wanted_capital = wanted.capitalize()
    const available = []

    for (let line of Menu.dishes()) {
      let pattern = new RegExp('\\b'+wanted_lower+'\\b');
      let hit = pattern.test(line.toLowerCase())
      if (hit) available.push(line.trim())
    }

    var answer = ''
    if (available.length == 0) {
      answer = bot.random_answer(no_results)
                .replaceAll('XXX', wanted_capital)
    } else if (available.length == 1) {
      answer = bot.random_answer(single_result)
                .replaceAll('XXX', available[0])
    } else {
      answer = bot.random_answer(multiple_results)
                .replaceAll('YYY', wanted_capital)
                .replaceAll('XXX', available.join(' or '))
    }
    chat.reply(message, answer)
  },
  update: function(menu) {
    Menu.set(menu)
  },
  start: function(menu) {
    bot.update(menu)
    bot.slack.hears(['menu','today'], bot.listen_to, bot.menu)
    bot.slack.hears(['(\\b\\w+\\?)'], bot.listen_to, bot.dishes)
    bot.slack.hears(['\\?', 'help'], bot.listen_to, bot.help)
    bot.slack.hears(['.*'], bot.listen_to, bot.troll)
    bot.slack.spawn({token: config('SLACK_TOKEN')}).startRTM()
  }
}

module.exports = bot
