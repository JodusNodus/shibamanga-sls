const elastic = require("../elasticsearch");
const { ELASTICSEACH_INDEX } = require("../constants");

module.exports = async function putChapterPages(id, pages) {
  const params = {
    index: ELASTICSEACH_INDEX,
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
