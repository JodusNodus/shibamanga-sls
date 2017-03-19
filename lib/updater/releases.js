const elastic = require("../elasticsearch");
const { ELASTICSEACH_INDEX } = require("../constants");
const composeReleaseId = require("../utils/composeReleaseId");
const { mangasources } = require("../sources/index");

async function getMangaList(mangaslugs) {
  const params = {
    type: "mangas",
    size: 10000,
    body: {
      _source: ["mangaid", "mangaslugs"],
      query: { bool: { filter: { terms: { mangaslugs } } } },
    },
  };

  const { hits } = await elastic.search(params);
  const items = hits.hits.map(x => x._source);
  return items;
}

async function putReleases(items, sourceslug) {
  const bulkActions = [];
  items.forEach((item) => {
    const data = { ...item, sourceslug };
    bulkActions.push({
      index: {
        _index: ELASTICSEACH_INDEX,
        _type: "releases",
        _id: composeReleaseId(data),
      },
    });
    bulkActions.push(data);
  });
  if (bulkActions.length > 0) {
    await elastic.bulk({ body: bulkActions });
  }
}

module.exports = async function updateReleases() {
  for (const Source of mangasources) {
    const source = new Source();
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
