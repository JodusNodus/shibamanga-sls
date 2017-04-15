import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";
import composeReleaseId from "../utils/composeReleaseId";
import { mangasources } from "../sources/index";

import { ReleaseItem } from "../interfaces/releases";

interface GetMangaListItem {
  mangaid: number,
  mangaslugs: string[],
}

async function getMangaList(mangaslugs:string[]):Promise<GetMangaListItem[]> {
  const params = {
    type: "mangas",
    size: 10000,
    body: {
      _source: ["mangaid", "mangaslugs"],
      query: { bool: { filter: { terms: { mangaslugs } } } },
    },
  };

  const { hits } = await elastic.search(params);
  const items:GetMangaListItem[] = hits.hits.map(hit => hit._source as GetMangaListItem);
  return items;
}

async function putReleases(items:ReleaseItem[], sourceslug:string) {
  const bulkActions = [];
  items.forEach((item) => {
    const data:ReleaseItem = Object.assign({ sourceslug }, item);
    bulkActions.push({
      index: {
        _index: ELASTICSEARCH_INDEX,
        _type: "releases",
        _id: composeReleaseId(data.mangaid, sourceslug, data.date)
      },
    });
    bulkActions.push(data);
  });
  if (bulkActions.length > 0) {
    await elastic.bulk({ body: bulkActions });
  }
}

export default async function updateReleases() {
  for (const source of mangasources) {
    let items = await source.getReleases();

    const mangaslugs = items.map(release => release.mangaslug);
    const mangas = await getMangaList(mangaslugs);

    items = items
      .map((release) => {
        const matches = mangas.filter(
          ({ mangaslugs }) => mangaslugs.indexOf(release.mangaslug) > -1,
        );
        if (matches.length < 1) {
          return null;
        }
        const mangaid = matches[0].mangaid;
        return { ...release, mangaslug: undefined, mangaid };
      })
      .filter(x => x != null);

    await putReleases(items, source.name);
  }
};
