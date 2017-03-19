const elastic = require("../elasticsearch");
const listField = require("./list-fields");

module.exports = async function seach({ text = "", length = 25, page = 1 }) {
  const params = {
    index: "shibamanga",
    type: "mangas",
    from: (page - 1) * length,
    size: length,
    body: {
      _source: {
        includes: listField,
      },
      query: {
        function_score: {
          query: {
            bool: {
              filter: {
                term: { foundInSources: true },
              },
              must: {
                multi_match: {
                  query: text,
                  type: "cross_fields",
                  fields: [
                    "title",
                    "alternativetitles",
                    "genres",
                    "tags",
                    "author",
                    "artist",
                  ],
                },
              },
            },
          },
          field_value_factor: {
            field: "hits",
            modifier: "log1p",
          },
        },
      },
    },
  };

  const { hits } = await elastic.search(params);

  const totalPages = hits.total === 0 ? 0 : Math.ceil(hits.total / length);

  const items = hits.hits.map(item => item._source);

  return { items, totalPages, length, page };
};
