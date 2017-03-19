const forEach = require("lodash/forEach");
const { sourceSlugs, mangasources } = require("../sources/index");

module.exports = function selectSource(source = "", availableSources = []) {
  const availableSourceSlugs = availableSources.map(
    ({ sourceslug }) => sourceslug,
  );
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
