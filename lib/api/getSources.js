const elastic = require("../elasticsearch");

module.exports = async function getSources(slugs) {
  const params = {
    index: "shibamanga",
    type: "mangasources",
    size: 1000,
    body: {
      _source: {
        excludes: ["mangaslug"],
      },
      query: {
        bool: {
          filter: {
            terms: {
              mangaslug: slugs,
            },
          },
        },
      },
    },
  };

  const { hits } = await elastic.search(params);
  const items = hits.hits.map(x => x._source);
  return items;
};
