const elasticsearch = require("elasticsearch");
const { ELASTICSEACH_HOST } = require("./constants");

module.exports = new elasticsearch.Client({ host: ELASTICSEACH_HOST });
