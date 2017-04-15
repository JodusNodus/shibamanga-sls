import elastic from "../elasticsearch";
import listFields from "./list-fields";
import { ELASTICSEARCH_INDEX } from "../constants";

export default async function popular(props: { notIds?:number[], length?:number, page?:number }) {
  const { notIds=[], length=25, page=1 } = props;

  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "mangas",
    from: (page - 1) * length,
    size: length,
    body: {
      _source: {
        includes: listFields,
      },
      query: {
        bool: {
          filter: {
            term: { foundInSources: true },
          },
          must_not: {
            terms: { mangaid: notIds },
          },
        },
      },
      sort: [{ hits: { order: "desc" } }],
    },
  };
  const { hits } = await elastic.search(params);

  const totalPages = hits.total === 0 ? 0 : Math.ceil(hits.total / length);

  const items = hits.hits.map(item => item._source);

  return { items, totalPages, length, page, notIds };
};
