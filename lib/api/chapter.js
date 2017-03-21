const getChapter = require("./getChapter");
const putChapterPages = require("./putChapterPages");
const getManga = require("./manga");
const selectSource = require("./selectSource");
const hitManga = require("./hit");
const { sourceSlugs } = require("../sources/index");
const composeChapterId = require("../utils/composeChapterId");

module.exports = async function ({ mangaid = 1, chapternum = 1, ...params }) {
  const sourceslug = params.source;

  if (!sourceslug || sourceSlugs.indexOf(sourceslug) < 0) {
    throw new Error("Source is required");
  }

  const chapter = {
    mangaid,
    chapternum,
    sourceslug,
  };

  const id = composeChapterId(chapter);

  try {
    const data = await getChapter(id);
    Object.assign(chapter, data);
  } catch (err) {
    throw new Error("chapter not found");
  }

  if (!chapter.pages) {
    const { sources } = await getManga({ mangaid, sourceslug });

    let mangaalias = sources.filter(source => source.sourceslug === sourceslug);

    if (mangaalias.length < 1) {
      return chapter;
    }
    mangaalias = mangaalias[0].mangaalias;

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
