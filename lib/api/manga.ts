import putChapterList from "./putChapterList";
import getChapterList from "./getChapterList";
import getSources from "./getSources";
import selectSource from "./selectSource";
import hitManga from "./hit";
import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";

import { Manga, SourceItem } from "../interfaces/manga";
import { ChapterListItem } from "../interfaces/chapter";

interface MangaResponse extends Manga {
  sources?: SourceItem[],
  chapters?: ChapterListItem[],
}

export default async function (props: { mangaid:number, isFresh?:boolean, source?:string }) {
  let manga:MangaResponse;
  try {
    const { _source } = await elastic.get({
      index: ELASTICSEARCH_INDEX,
      type: "mangas",
      id: String(props.mangaid),
    });
    manga = _source as Manga;
  } catch (e) {
    throw new Error("manga not found");
  }

  // Exclusion can't be done with a elasticsearch get
  delete manga.cover;
  delete manga.recommendations;
  delete manga.hits;

  manga.sources = await getSources(manga.mangaslugs);

  const sourceInstance = selectSource(props.source, manga.sources);
  if (!sourceInstance) {
    return manga;
  }

  manga.source = sourceInstance.name;

  let chapterList:ChapterListItem[] = [];
  if (!props.isFresh) {
    chapterList = await getChapterList(props.mangaid, manga.source);
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
      putChapterList(props.mangaid, manga.source, chapterList)
        .then(() => {
          console.log(`Chapter List put for manga: ${props.mangaid}`);
        })
        .catch((err) => {
          console.log(`Chapter List put failed for manga: ${props.mangaid}, ${err}`);
        });
    }
  }
  if (chapterList) {
    manga.chapters = chapterList;
  }

  if (!props.isFresh) {
    hitManga(props.mangaid);
  }

  return manga;
};
