import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";

export default async function hit(mangaid:number) {
  await elastic.update({
    index: ELASTICSEARCH_INDEX,
    type: "mangas",
    id: String(mangaid),
    body: {
      script: "ctx._source.hits+=1",
    },
  });
};
