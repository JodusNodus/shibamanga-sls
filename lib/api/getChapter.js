const elastic = require("../elasticsearch");
const { ELASTICSEARCH_INDEX } = require("../constants");

module.exports = async function getChapterPages(id) {
  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "chapters",
    id,
  };

  const { _source } = await elastic.get(params);

  return _source;
};
