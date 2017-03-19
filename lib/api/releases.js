const elastic = require("../elasticsearch");
const { ELASTICSEACH_INDEX } = require("../constants");
const getList = require("./list");
const uniq = require("lodash/uniq");

module.exports = async function ({ length = 25, page = 1 }) {
  const params = {
    index: ELASTICSEACH_INDEX,
    type: "releases",
    from: (page - 1) * length,
    size: length,
    body: {
      query: {
        match_all: {},
      },
      sort: [{ date: { order: "desc" } }],
    },
  };

  const { hits } = await elastic.search(params);

  const totalPages = hits.total === 0 ? 0 : Math.ceil(hits.total / length);

  let items = hits.hits.map(item => item._source);

  const ids = uniq(items.map(({ mangaid }) => mangaid));
  const data = await getList({ ids });

  items = items
    .map((item) => {
      const matchedMangas = data.items.filter(
        ({ mangaid }) => mangaid === item.mangaid,
      );
      if (matchedMangas < 1) {
        return false;
      }
      return { ...item, ...matchedMangas[0] };
    })
    .filter(x => !!x);

  return { items, totalPages, length, page };
};
