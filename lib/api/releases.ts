import elastic from "../elasticsearch";
import { ELASTICSEARCH_INDEX } from "../constants";
import getList from "./list";
import { uniq } from "lodash";

import { FullReleaseItem } from "../interfaces/releases";

export default async function (props: { length?:number, page?:number }) {
  const { length = 25, page = 1 } = props;

  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "releases",
    from: (page - 1) * length,
    size: length,
    body: {
      query: {
        match_all: {},
      },
      sort: [{ date: { order: "desc" } }],
    },
  };

  const { hits } = await elastic.search(params);

  const totalPages = hits.total === 0 ? 0 : Math.ceil(hits.total / length);

  let items = hits.hits.map(item => item._source as FullReleaseItem);

  const ids = uniq(items.map(({ mangaid }) => String(mangaid)));
  const data = await getList({ ids });

  items = items
    .map((item) => {
      const matchedMangas = data.items
        .filter(({ mangaid }) => mangaid === item.mangaid);
      if (matchedMangas.length < 1) {
        return null;
      }
      return { ...item, ...matchedMangas[0] };
    })
    .filter(x => !!x);

  return { items, totalPages, length, page };
};
