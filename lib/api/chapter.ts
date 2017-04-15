import getChapter from "./getChapter";
import putChapterPages from "./putChapterPages";
import getManga from "./manga";
import selectSource from "./selectSource";
import hitManga from "./hit";
import { sourceSlugs } from "../sources/index";
import composeChapterId from "../utils/composeChapterId";

import { Source } from "../interfaces/source";
import { Page, Chapter } from "../interfaces/chapter";

export default async function chapterApi(params: { mangaid:number, chapternum:number, source:string }):Promise<Chapter> {
  const { mangaid, chapternum } = params;
  const sourceslug = params.source;

  if (!sourceslug || sourceSlugs.indexOf(sourceslug) < 0) {
    throw new Error("Source is required");
  }

  let chapter:any = {
    mangaid,
    chapternum,
    sourceslug,
  };

  try {
    const id = composeChapterId(mangaid, chapternum, sourceslug);
    const data = await getChapter(id);
    Object.assign(chapter, data);

    if (!chapter.pages) {
      const { sources } = await getManga({ mangaid, source: sourceslug });

      const currentSource = sources
        .filter(source => source.sourceslug === sourceslug)[0];

      if (!currentSource) {
        return chapter;
      }
      const mangaalias = currentSource.mangaalias;

      const source:Source = await selectSource(sourceslug, sources);
      chapter.pages = await source.getChapter(mangaalias, chapter.chapteralias);

      if (chapter.pages && chapter.pages.length > 0) {
        putChapterPages(id, chapter.pages)
          .then(() => {
            console.log(
              `Chapter Pages update for manga: ${mangaid}, chapter: ${chapternum}`,
            );
          })
          .catch((err:Error) => {
            console.log(
              `Chapter Pages update for manga: ${mangaid}, chapter: ${chapternum} has failed. ${err.toString()}`,
            );
          });
      }
    }

    hitManga(mangaid);
  } catch (err) {
    throw new Error("chapter not found");
  }

  return chapter as Chapter;
};
