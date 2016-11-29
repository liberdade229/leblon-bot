
'use strict'

const bot = require('./bot')()
const fb = require('./facebook')

bot.start_with_feed(fb.get_feed)
setInterval(function() { bot.update_feed(fb.get_feed) }, 12 * 60 * 60 * 1000)
