const elastic = require("../elasticsearch");
const { ELASTICSEARCH_INDEX } = require("../constants");

module.exports = async function hit(mangaid) {
  const params = {
    index: ELASTICSEARCH_INDEX,
    type: "mangas",
    id: mangaid,
    body: {
      script: "ctx._source.hits+=1",
    },
  };

  await elastic.update(params);
};
