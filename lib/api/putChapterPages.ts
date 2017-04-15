import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";

import { Page } from "../interfaces/chapter";

export default async function putChapterPages(id:string, pages:Page[]) {
  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "chapters",
    id,
    body: {
      doc: {
        pages,
      },
    },
  };
  await elastic.update(params);
};
