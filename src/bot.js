
'use strict'

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8')
}

const fs = require('fs')
const config = require('./config')
const utils = require('./utils')
const Botkit = require('botkit')
const Menu = require('./menu')

const no_results = require('./data/no_results.txt').split('\n')
const single_result = require('./data/single_result.txt').split('\n')
const multiple_results = require('./data/multiple_results.txt').split('\n')
const troll_results = require('./data/troll_results.txt').split('\n')

function bot() {  

  function menu(chat, message) {
    chat.reply(message, Menu.today())
  }

  function help(chat, message) {
    chat.reply(message, "Send me a message or @mention with `menu` to get today's menu. For example, `@leblon menu`. You can also ask me to check if a particular ingredient is available today. Examples: `@leblon picanha?` or `@leblon polvo?`")
  }

  function troll(chat, message) {
    let answer = utils.random(troll_results)
    answer = utils.replace_all(answer, 'YYY', message.text)
    chat.reply(message, answer)
  }

  function dishes(chat, message) {
    const match = message.match[1]
    if (message.text != match) return troll(chat, message)

    const wanted = match.replace('?', '')
    const wanted_lower = wanted.toLowerCase()
    const wanted_capital = utils.capitalize(wanted)
    const available = []

    for (let line of Menu.dishes()) {
      let pattern = new RegExp('\\b'+wanted_lower+'\\b')
      let hit = pattern.test(line.toLowerCase())
      if (hit) available.push(line.trim())
    }

    var answer = ''
    if (available.length === 0) {
      answer = utils.random(no_results)
      answer = utils.replace_all(answer, 'XXX', wanted_capital)             
    } else if (available.length === 1) {
      answer = utils.random(single_result)
      answer = utils.replace_all(answer, 'XXX', available[0])
    } else {
      answer = utils.random(multiple_results)
      answer = utils.replace_all(answer, 'YYY', wanted_capital)
      answer = utils.replace_all(answer, 'XXX', available.join(' or '))
    }
    chat.reply(message, answer)
  }

  function save_menu(feed) {
    Menu.set(feed)
  }

  function start() {
    const listen_to = ['direct_message', 'direct_mention']
    const slack = Botkit.slackbot({debug: false})
    slack.hears(['menu', 'today'], listen_to, menu)
    slack.hears(['(\\b\\w+\\?)'], listen_to, dishes)
    slack.hears(['\\?', 'help'], listen_to, help)
    slack.hears(['.*'], listen_to, troll)
    slack.spawn({token: config('SLACK_TOKEN')}).startRTM()
  }

  function update_feed(feed_cb) {
    feed_cb(function(feed) {
      save_menu(feed)
    })
  }

  function start_with_feed(feed_cb) {
    feed_cb(function(feed) {
      save_menu(feed)
      start()
    })
  }

  return {
    update_feed: update_feed,
    start_with_feed: start_with_feed
  }
}

module.exports = bot
