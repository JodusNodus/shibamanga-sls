import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";

import { SourceItem } from "../interfaces/manga";

export default async function getSources(slugs:string[]):Promise<SourceItem[]> {
  const params = {
    index: ELASTICSEARCH_INDEX,
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
  const items = hits.hits.map(x => x._source as SourceItem);
  return items;
};
