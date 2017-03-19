const elastic = require("../elasticsearch");
const { ELASTICSEACH_INDEX } = require("../constants");
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
        _index: ELASTICSEACH_INDEX,
        _type: "chapters",
        _id: composeChapterId(data),
      },
    });
    bulkActions.push(data);
  });

  await elastic.bulk({ body: bulkActions });
};
