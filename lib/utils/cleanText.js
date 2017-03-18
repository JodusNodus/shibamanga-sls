const Entities = require("html-entities").Html5Entities;

const entities = new Entities();

module.exports = str => entities.decode(str.trim());
