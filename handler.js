const getManga = require("./lib/api/manga");
const getChapter = require("./lib/api/chapter");
const getGenre = require("./lib/api/genre");
const getList = require("./lib/api/list");
const getPopular = require("./lib/api/popular");
const getRecommendations = require("./lib/api/recommendations");
const getReleases = require("./lib/api/releases");
const searchMangas = require("./lib/api/search");

const updateMangas = require("./lib/updater/mangas");
const updateMangasources = require("./lib/updater/mangasources");
const updateReleases = require("./lib/updater/releases");

const idsStringToArr = (idsString) => {
  const ids = idsString.split(";");
  if (ids.length > 100) {
    throw new Error("too many ids");
  }
  return ids.map(x => parseInt(x, 10)).filter(x => !isNaN(x));
};

const strToInt = (str) => {
  const int = parseInt(str, 10);
  if (isNaN(int)) {
    throw new Error("not a valid number");
  }
  return int;
};

async function paramsToFormat(params) {
  const newParams = { ...params };
  if (params.mangaid) newParams.mangaid = strToInt(params.mangaid);
  if (params.chapternum) newParams.chapternum = strToInt(params.chapternum);
  if (params.length) newParams.length = strToInt(params.length);
  if (params.page) newParams.page = strToInt(params.page);
  if (params.ids) newParams.ids = idsStringToArr(params.ids);
  if (params.not_ids) newParams.notIds = idsStringToArr(params.not_ids);

  return newParams;
}

const handlerFactory = f =>
  (e, ctx, cb) => {
    paramsToFormat({ ...e.pathParameters, ...e.queryStringParameters })
      .then(f)
      .then((data) => {
        cb(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET",
            "Strict-Transport-Security": "max-age=631138519",
            "X-Content-Type-Options": "nosniff",
          },
          body: JSON.stringify(data),
        });
      })
      .catch((err) => {
        console.log(err);
        cb(null, {
          statusCode: 400,
          body: err.toString ? err.toString() : err,
        });
      });
  };

module.exports = {
  getManga: handlerFactory(getManga),
  getChapter: handlerFactory(getChapter),
  getGenre: handlerFactory(getGenre),
  getList: handlerFactory(getList),
  getPopular: handlerFactory(getPopular),
  getRecommendations: handlerFactory(getRecommendations),
  getReleases: handlerFactory(getReleases),
  searchMangas: handlerFactory(searchMangas),

  updateMangas: handlerFactory(updateMangas),
  updateMangasources: handlerFactory(updateMangasources),
  updateReleases: handlerFactory(updateReleases),
};
