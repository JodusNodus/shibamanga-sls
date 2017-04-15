import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";
import { Chapter } from "../interfaces/chapter";

export default async function getChapter(id:string):Promise<Chapter> {
  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "chapters",
    id,
  };

  const chapter = await elastic.get(params);

  return chapter._source as Chapter;
};
