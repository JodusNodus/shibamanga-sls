import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";
import composeChapterId from "../utils/composeChapterId";

import { ChapterListItem } from "../interfaces/chapter";

export default async function putChapterList(mangaid:number, sourceslug:string, chapterList:ChapterListItem[]) {
  const bulkActions = [];

  chapterList.forEach((chapter) => {
    const data = { ...chapter, mangaid, sourceslug };
    bulkActions.push({
      index: {
        _index: ELASTICSEARCH_INDEX,
        _type: "chapters",
        _id: composeChapterId(mangaid, chapter.chapternum, sourceslug),
      },
    });
    bulkActions.push(data);
  });

  await elastic.bulk({ body: bulkActions });
};
