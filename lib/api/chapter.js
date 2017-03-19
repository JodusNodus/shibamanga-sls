const getChapter = require("./getChapter");
const putChapterPages = require("./putChapterPages");
const getManga = require("./manga");
const selectSource = require("./selectSource");
const hitManga = require("./hit");
const composeChapterId = require("../utils/composeChapterId");

module.exports = async function ({ mangaid = 1, chapternum = 1, ...params }) {
  const sourceslug = params.source;

  const chapter = {
    mangaid,
    chapternum,
    sourceslug,
  };

  const id = composeChapterId(chapter);

  const data = await getChapter(id);
  if (data) {
    Object.assign(chapter, data);
  }

  if (!chapter.pages) {
    const { sources, chapters } = await getManga(mangaid, sourceslug);

    let mangaalias = sources.filter(source => source.sourceslug === sourceslug)[
      0
    ];
    let chapteralias = chapters.filter(ch => ch.chapternum === chapternum)[0];

    if (!mangaalias || !chapteralias) {
      return chapter;
    }
    mangaalias = mangaalias.mangaalias;
    chapteralias = chapteralias.chapteralias;

    const Source = await selectSource(sourceslug, sources);
    const source = new Source();
    chapter.pages = await source.getChapter(mangaalias, chapter.chapteralias);

    if (chapter.pages && chapter.pages.length > 0) {
      // Update the chapter to include the pages in cassandra but don't wait for it to complete
      putChapterPages(id, chapter.pages)
        .then(() => {
          console.log(
            `Chapter Pages update for manga: ${mangaid}, chapter: ${chapternum}`,
          );
        })
        .catch((err) => {
          console.log(
            `Chapter Pages update for manga: ${mangaid}, chapter: ${chapternum} has failed. ${err}`,
          );
        });
    }
  }

  hitManga(mangaid);

  return chapter;
};
