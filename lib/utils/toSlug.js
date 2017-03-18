const toSlug = str => str
.trim()
.toLowerCase()
.replace(/[^a-zA-Z0-9]/g, '')

module.exports = toSlug
