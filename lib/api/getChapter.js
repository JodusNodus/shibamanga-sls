const elastic = require("../elasticsearch");

module.exports = async function getChapterPages(id) {
  const params = {
    index: "shibamanga",
    type: "chapters",
    id,
  };

  const { _source } = await elastic.get(params);

  return _source;
};
