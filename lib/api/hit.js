const elastic = require("../elasticsearch");

module.exports = async function hit(mangaid) {
  const params = {
    index: "shibamanga",
    type: "mangas",
    id: mangaid,
    body: {
      script: "ctx._source.hits+=1",
    },
  };

  await elastic.update(params);
};
