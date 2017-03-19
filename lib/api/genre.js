const elastic = require("../elasticsearch");
const { ELASTICSEACH_INDEX } = require("../constants");
const listFields = require("./list-fields");

module.exports = async function genre(
  { genre, length = 25, page = 1, notIds = [] },
) {
  const params = {
    index: ELASTICSEACH_INDEX,
    type: "mangas",
    from: (page - 1) * length,
    size: length,
    body: {
      _source: listFields,
      query: {
        function_score: {
          query: {
            bool: {
              filter: {
                term: { genres: genre },
              },
              must_not: {
                terms: { mangaid: notIds },
              },
            },
          },
          field_value_factor: {
            field: "hits",
            modifier: "log",
          },
        },
      },
    },
  };
  const { hits } = await elastic.search(params);

  const items = hits.hits.map(item => item._source);

  return { items, genre, length, page, notIds };
};
