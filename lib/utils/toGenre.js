const cleanText = require('./cleanText')

module.exports = str => cleanText(str)
.toLowerCase()
.replace(/[^a-zA-Z0-9\ ]/g, '')
.replace(/\ /g, '-')
