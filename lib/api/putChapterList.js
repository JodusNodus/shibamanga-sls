const elastic = require("../elasticsearch");
const composeChapterId = require("../utils/composeChapterId");

module.exports = async function putChapterList(
  mangaid,
  sourceslug,
  chapterList,
) {
  const bulkActions = [];

  chapterList.forEach((chapter) => {
    const data = { ...chapter, mangaid, sourceslug };
    bulkActions.push({
      index: {
        _index: "shibamanga",
        _type: "chapters",
        _id: composeChapterId(data),
      },
    });
    bulkActions.push(data);
  });

  await elastic.bulk({ body: bulkActions });
};
