
'use strict'

const Menu = {
  feed: [],
  set: function(menu) {
    Menu.feed = menu
    return Menu.feed
  },
  today: function() {
    return Menu.feed[0].message
  },
  dishes: function() {
    return Menu.today().split('\n')
  }
}

module.exports = Menu
