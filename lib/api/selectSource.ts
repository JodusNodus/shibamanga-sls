import { forEach } from "lodash";
import { sourceSlugs, mangasources } from "../sources/index";

import { SourceItem } from "../interfaces/manga";
import { Source } from "../interfaces/source";

export default function selectSource(source:string, availableSources:SourceItem[]):Source {
  const availableSourceSlugs = availableSources.map(({ sourceslug }) => sourceslug);
  let index;
  if (source) {
    index = sourceSlugs.indexOf(source);
  } else {
    forEach(sourceSlugs, (name, i) => {
      if (availableSourceSlugs.indexOf(name) > -1) {
        index = i;
        return false;
      }
    });
  }
  return mangasources[index];
};
