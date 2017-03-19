const { mangasources } = require("../sources/index");
const elastic = require("./elasticsearch");
const uniq = require("lodash/uniq");

async function markFoundMangas(mangaslugs) {
  const chunkLength = 1000;
  while (mangaslugs.length > 0) {
    const mangaslugsChunk = mangaslugs.slice(0, chunkLength);

    const params = {
      index: "shibamanga",
      type: "mangas",
      conflicts: "proceed",
      body: {
        script: {
          inline: "ctx._source.foundInSources = true",
          lang: "painless",
        },
        query: { bool: { filter: { terms: { mangaslugs: mangaslugsChunk } } } },
      },
    };
    await elastic.updateByQuery(params);

    if (mangaslugs.length < chunkLength) {
      mangaslugs = [];
    } else {
      mangaslugs = mangaslugs.slice(chunkLength);
    }
  }
}

async function putSource(items, sourceslug) {
  const bulkActions = [];
  items.forEach((item) => {
    const data = { ...item, sourceslug };
    bulkActions.push({
      index: {
        _index: "shibamanga",
        _type: "mangasources",
        _id: `${data.mangaslug}-${data.sourceslug}`,
      },
    });
    bulkActions.push(data);
  });
  if (bulkActions.length > 0) {
    await elastic.bulk({ body: bulkActions });
  }
}

module.exports = async function updateMangasources() {
  try {
    let mangaslugs = [];
    for (const Source of mangasources) {
      const source = new Source();

      const items = await source.getList();
      await putSource(items, source.name);

      mangaslugs = items.map(x => x.mangaslug).concat(mangaslugs);
    }

    mangaslugs = uniq(mangaslugs);
    if (mangaslugs.length > 0) {
      await markFoundMangas(mangaslugs);
    }
  } catch (e) {
    console.log(e);
  }
};