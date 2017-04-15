import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";

import { ChapterListItem } from "../interfaces/chapter";

export default async function getChapterList(mangaid:number, sourceslug:string):Promise<ChapterListItem[]> {
  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "chapters",
    size: 10000,
    body: {
      _source: {
        excludes: ["mangaid", "sourceslug", "pages"],
      },
      query: {
        bool: {
          filter: [
            { term: { mangaid } },
            { term: { sourceslug } }
          ],
        },
      },
      sort: [{ chapternum: { order: "asc" } }],
    },
  };

  const { hits } = await elastic.search(params);
  const items = hits.hits.map(x => x._source as ChapterListItem);
  return items;
};
