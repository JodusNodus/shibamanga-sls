const elastic = require("./elasticsearch");
const MangaUpdates = require("../sources/MangaUpdates");

async function putItems(items) {
  const bulkActions = [];
  items.forEach((manga) => {
    if (!manga || !manga.mangaid) {
      return;
    }
    bulkActions.push({
      index: { _index: "shibamanga", _type: "mangas", _id: manga.mangaid },
    });
    bulkActions.push({ ...manga, hits: 1 });
  });
  if (bulkActions.length > 0) {
    await elastic.bulk({ body: bulkActions });
  }
}

async function getHighestId() {
  const params = {
    index: "shibamanga",
    type: "mangas",
    body: { aggs: { max_id: { max: { field: "mangaid" } } }, size: 0 },
  };
  const { aggregations } = await elastic.search(params);
  return aggregations.max_id.value || 0;
}

module.exports = async function () {
  const index = await getHighestId();
  const maxIndex = index + 10000;
  const length = 50;

  const mangaupdates = new MangaUpdates();

  for (let i = index + 1; i < maxIndex; i += length) {
    const items = await mangaupdates.getList(i, length);
    if (items && items.length > 0) {
      await putItems(items);
    }
  }
};
