const elastic = require("../elasticsearch");

module.exports = async function putChapterPages(id, pages) {
  const params = {
    index: "shibamanga",
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
