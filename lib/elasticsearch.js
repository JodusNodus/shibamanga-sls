const elasticsearch = require("elasticsearch");
const { ELASTICSEARCH_HOST } = require("./constants");

module.exports = new elasticsearch.Client({ host: ELASTICSEARCH_HOST });
