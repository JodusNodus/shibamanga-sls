import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";
import getList from "./list";
import { uniq } from "lodash";
import { sortBy, reverse } from "lodash";

import { MangaListItem } from "../interfaces/manga";

interface MangaListItemWithScore extends MangaListItem {
  score: number,
}

export default async function (props: { ids?:number[], length?:number, page?:number }) {
  const { ids = [], length = 25, page = 1 } = props;
  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "mangas",
    _source: ["recommendations"],
    body: {
      ids,
    },
  };

  const { docs } = await elastic.mget(params);

  const recommendationIds:number[] = docs
    .filter(({ found }) => found)
    .map(item => {
      const s = item._source as {recommendations: number[]};
      return s.recommendations;
    })
    .reduce((x, y) => x.concat(y), [])
    .filter(x => ids.indexOf(x) < 0);

  const recommendationStringIds = uniq(recommendationIds)
    .map(String)
    .slice(0, length * 2);

  let items:MangaListItemWithScore[];
  if (recommendationStringIds.length > 0) {
    const data = await getList({ ids: recommendationStringIds });
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
