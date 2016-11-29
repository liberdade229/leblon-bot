
'use strict'

const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  FB_APP_ID: process.env.FB_APP_ID,
  FB_APP_SECRET: process.env.FB_APP_SECRET,
  FB_FEED: process.env.FB_FEED
}

module.exports = (key) => {
  if (!key) return config

  return config[key]
}