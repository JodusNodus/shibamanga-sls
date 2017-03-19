const elastic = require("../elasticsearch");
const getList = require("./list");
const uniq = require("lodash/uniq");
const sortBy = require("lodash/sortBy");
const reverse = require("lodash/reverse");

module.exports = async function ({ ids = [], length = 25, page = 1 }) {
  const params = {
    index: "shibamanga",
    type: "mangas",
    _source: ["recommendations"],
    body: {
      ids,
    },
  };

  const { docs } = await elastic.mget(params);

  let recommendationIds = docs
    .filter(({ found }) => found)
    .map(item => item._source.recommendations)
    .reduce((x, y) => x.concat(y), [])
    .filter(x => ids.indexOf(x) < 0);

  recommendationIds = uniq(recommendationIds).slice(0, length * 2);

  let items;
  if (recommendationIds.length > 0) {
    const data = await getList({ ids: recommendationIds });
    items = data.items
      .filter(item => item.foundInSources)
      .slice(0, length)
      .map((item) => {
        const score = ids.filter(x => x === item.mangaid).length;
        return {
          ...item,
          score,
        };
      });

    items = reverse(sortBy(items, ["score"]));
  }

  return { ids, length, page, items };
};
