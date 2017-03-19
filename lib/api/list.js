const elastic = require("../elasticsearch");
const { ELASTICSEACH_INDEX } = require("../constants");
const listFields = require("./list-fields");

module.exports = async function list({ ids = [] }) {
  const params = {
    index: ELASTICSEACH_INDEX,
    type: "mangas",
    _sourceInclude: [...listFields, "foundInSources"],
    body: {
      ids,
    },
  };
  const { docs } = await elastic.mget(params);

  const items = docs.filter(({ found }) => found).map(item => item._source);
  return { ids, items };
};