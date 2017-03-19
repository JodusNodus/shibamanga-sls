const elastic = require("../elasticsearch");
const { ELASTICSEACH_INDEX } = require("../constants");

module.exports = async function getChapterPages(id) {
  const params = {
    index: ELASTICSEACH_INDEX,
    type: "chapters",
    id,
  };

  const { _source } = await elastic.get(params);

  return _source;
};
