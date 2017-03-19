const elasticsearch = require("elasticsearch");

const host = process.env.elasticsearch;
const client = new elasticsearch.Client({ host });

module.exports = client;
