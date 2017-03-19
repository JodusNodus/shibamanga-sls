const elastic = require("../elasticsearch");

module.exports = async function getChapterList(mangaid, sourceslug) {
  const params = {
    index: "shibamanga",
    type: "chapters",
    size: 10000,
    body: {
      _source: {
        excludes: ["mangaid", "sourceslug", "pages"],
      },
      query: {
        bool: {
          filter: [{ term: { mangaid } }, { term: { sourceslug } }],
        },
      },
      sort: [{ chapternum: { order: "asc" } }],
    },
  };

  const { hits } = await elastic.search(params);
  const items = hits.hits.map(x => x._source);
  return items;
};
