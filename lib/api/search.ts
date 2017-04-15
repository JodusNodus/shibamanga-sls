import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";
import listField from "./list-fields";

import { MangaListItem } from "../interfaces/manga";

export default async function seach(props: { text?:string, length?:number, page?:number }) {
  const { text = "", length = 25, page = 1 } = props;
  const params = {
    index: ELASTICSEARCH_INDEX,
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

  const items = hits.hits.map(item => item._source as MangaListItem);

  return { items, totalPages, length, page };
};
