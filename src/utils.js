
'use strict'

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function replace_all(string, search, replacement) {
  return string.replace(new RegExp(search, 'g'), replacement)
}

function random(array) {
  return array[Math.floor(Math.random() * array.length)]
}

module.exports = {
  capitalize: capitalize,
  replace_all: replace_all,
  random: random
}
