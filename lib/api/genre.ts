import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";
import listFields from "./list-fields";

import { MangaListItem } from "../interfaces/manga";

export default async function genre(props: { genre:string, length?:number, page?:number, notIds?:number[] }) {
  const { genre, length = 25, page = 1, notIds = [] } = props;
  const params = {
    index: ELASTICSEARCH_INDEX,
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
  const items = hits.hits.map(item => item._source as MangaListItem);
  return {
    genre,
    length,
    page,
    notIds,
    items,
  };
};
