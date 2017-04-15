import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";
import listFields from "./list-fields";

import { MangaListItem } from "../interfaces/manga";

export default async function list(props: { ids:string[] }) {
  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "mangas",
    _sourceInclude: [...listFields, "foundInSources"],
    body: {
      ids: props.ids,
    },
  };
  const { docs } = await elastic.mget(params);

  const items = docs
    .filter(({ found }) => found)
    .map(item => item._source as MangaListItem);
  return { ...props, items };
};
