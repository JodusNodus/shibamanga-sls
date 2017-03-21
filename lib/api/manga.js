const putChapterList = require("./putChapterList");
const getChapterList = require("./getChapterList");
const getSources = require("./getSources");
const selectSource = require("./selectSource");
const hitManga = require("./hit");
const elastic = require("../elasticsearch");
const { ELASTICSEARCH_INDEX } = require("../constants");

module.exports = async function ({ mangaid = 1, isFresh = false, ...params }) {
  let manga;
  try {
    const { _source } = await elastic.get({
      index: ELASTICSEARCH_INDEX,
      type: "mangas",
      id: mangaid,
    });
    manga = _source;
  } catch (e) {
    throw new Error("manga not found");
  }

  manga.recommendations = undefined;

  manga.sources = await getSources(manga.mangaslugs);

  const Source = selectSource(params.source, manga.sources);
  if (!Source) {
    return manga;
  }

  const sourceInstance = new Source();
  manga.source = sourceInstance.name;

  let chapterList = [];
  if (!isFresh) {
    chapterList = await getChapterList(mangaid, manga.source);
  }

  if (chapterList.length < 1) {
    const sourceInIndexItem = manga.sources.filter(
      ({ sourceslug }) => sourceslug === manga.source,
    )[0];

    if (!sourceInIndexItem) {
      return manga;
    }

    const mangaalias = sourceInIndexItem.mangaalias;
    chapterList = await sourceInstance.getChapterList(mangaalias);

    if (chapterList && chapterList.length > 0) {
      // Put the new chapterList in cassandra but don't wait for it to complete
      putChapterList(mangaid, manga.source, chapterList)
        .then(() => {
          console.log(`Chapter List put for manga: ${mangaid}`);
        })
        .catch((err) => {
          console.log(`Chapter List put failed for manga: ${mangaid}, ${err}`);
        });
    }
  }
  if (chapterList) {
    manga.chapters = chapterList;
  }

  if (!isFresh) {
    hitManga(mangaid);
  }

  return manga;
};
