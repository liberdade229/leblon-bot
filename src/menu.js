
'use strict'

const Menu = {
  feed: [],
  set: function(menu) {
    Menu.feed = menu
    return Menu.feed
  },
  today: function() {
    var latest = Menu.feed[0].message
    for (let post of Menu.feed) {
      if (post.meessage && post.message.match(/apetite/g)) {
        latest = post.message
        break
      }
    }
    return latest
  },
  dishes: function() {
    return Menu.today().split('\n')
  }
}

module.exports = Menu
