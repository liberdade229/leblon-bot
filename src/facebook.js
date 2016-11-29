
'use strict'

const config = require('./config')

const FB = require('fb')
const fb = new FB.Facebook({version: 'v2.8'})

const facebook = {
  start: function(cb) {
    const auth = {
      client_id: config('FB_APP_ID'),
      client_secret: config('FB_APP_SECRET'),
      grant_type: 'client_credentials'
    }
    fb.api('oauth/access_token', auth , function(res) {
      if(!res || res.error) {
        console.log(!res ? 'Error fetching access token' : res.error)
        return;
      }
      fb.setAccessToken(res.access_token);
      facebook.update(cb);
    })
  },
  update: function(cb) {
    console.log('Updating feed...')
    var options = {
      access_token: fb.getAccessToken()
    }
    fb.api(config('FB_FEED'), options, function(res) {
      if (!res || res.error) {
        console.log(!res ? 'Error fetching feed' : res.error);
        return;
      }
      if (cb) cb(res.data);
    })
  }
}

module.exports = facebook
