
'use strict'

const bot = require('./bot')()
const fb = require('./facebook')

fb.start(bot.start)
setInterval(function() { fb.update(bot.update) }, 12 * 60 * 60 * 1000)
