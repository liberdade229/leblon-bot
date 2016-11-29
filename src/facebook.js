
'use strict'

const config = require('./config')

const FB = require('fb')
const fb = new FB.Facebook({version: 'v2.8'})

function get_feed(cb) {
  console.log(new Date(), 'Getting feed from Facebook page...')
  var options = {
    access_token: config('FB_APP_ID')+'|'+config('FB_APP_SECRET')
  }
  fb.api(config('FB_FEED'), options, function(res) {
    if (!res || res.error) {
      console.log(!res ? 'Error fetching feed' : res.error)
      return
    }
    if (cb) cb(res.data)
  })
}

module.exports = {
  get_feed: get_feed
}
