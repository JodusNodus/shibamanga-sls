const elastic = require("../elasticsearch");
const { ELASTICSEARCH_INDEX } = require("../constants");

module.exports = async function putChapterPages(id, pages) {
  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "chapters",
    id,
    body: {
      doc: {
        pages,
      },
    },
  };
  await elastic.update(params);
};
