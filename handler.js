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

const idsStringToArr = idsString =>
  idsString.split(";").map(x => parseInt(x, 10)).filter(x => !isNaN(x));

const handlerFactory = f =>
  (e, ctx, cb) => {
    const params = { ...e.pathParameters, ...e.queryStringParameters };
    if (params.mangaid) {
      params.mangaid = parseInt(params.mangaid, 10);
    }
    if (params.chapternum) {
      params.chapternum = parseInt(params.chapternum, 10);
    }
    if (params.length) {
      params.length = parseInt(params.length, 10);
    }
    if (params.page) {
      params.page = parseInt(params.page, 10);
    }
    if (params.ids) {
      params.ids = idsStringToArr(params.ids);
    }
    if (params.not_ids) {
      params.notIds = idsStringToArr(params.not_ids);
    }
    f(params)
      .then((data) => {
        cb(null, {
          statusCode: 200,
          body: data,
        });
      })
      .catch((err) => {
        console.log(err);
        cb(err);
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
