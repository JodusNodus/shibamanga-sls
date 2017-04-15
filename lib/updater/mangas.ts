import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";
import mangaupdates from "../sources/mangaUpdates";

import { Manga } from "../interfaces/manga";

async function putItems(items:Manga[]) {
  const bulkActions = [];
  items.forEach((manga) => {
    if (!manga || !manga.mangaid) {
      return;
    }
    bulkActions.push({
      index: { _index: "shibamanga", _type: "mangas", _id: manga.mangaid },
    });
    bulkActions.push({ ...manga, hits: 1 });
  });
  if (bulkActions.length > 0) {
    await elastic.bulk({ body: bulkActions });
  }
}

async function getHighestId():Promise<number> {
  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "mangas",
    body: {
      aggs: {
        max_id: { max: { field: "mangaid" } }
      },
      size: 0
    },
  };
  const { aggregations } = await elastic.search(params);
  return Number(aggregations.max_id.value) || 0;
}

export default async function () {
  const index = await getHighestId();
  const maxIndex = index + 10000;
  const length = 50;

  for (let i = index + 1; i < maxIndex; i += length) {
    const items = await mangaupdates.getList(i, length);
    if (items && items.length > 0) {
      await putItems(items);
    }
  }
};
