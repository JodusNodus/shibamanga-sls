import getMangaEndpoint from "./lib/api/manga";
import getChapterEndpoint from "./lib/api/chapter";
import getGenreEndpoint from "./lib/api/genre";
import getListEndpoint from "./lib/api/list";
import getPopularEndpoint from "./lib/api/popular";
import getRecommendationsEndpoint from "./lib/api/recommendations";
import getReleasesEndpoint from "./lib/api/releases";
import searchMangasEndpoint from "./lib/api/search";
import updateMangasEndpoint from "./lib/updater/mangas";
import updateMangasourcesEndpoint from "./lib/updater/mangasources";
import updateReleasesEndpoint from "./lib/updater/releases";

const idsStringToArr = (idsString:string):number[] => {
  const ids = idsString.split(";");
  if (ids.length > 100) {
    throw new Error("too many ids");
  }
  return ids.map(x => parseInt(x, 10)).filter(x => !isNaN(x));
};

const strToInt = (str:string):number => {
  const int = parseInt(str, 10);
  if (isNaN(int)) {
    throw new Error("not a valid number");
  }
  return int;
};

interface InParams {
  mangaid?: string,
  chapternum?: string,
  length?: string,
  page?: string,
  ids?: string,
  not_ids?: string,
}

async function paramsToFormat(params:InParams) {
  const { mangaid, chapternum, length, page, ids, not_ids, ...remParams } = params;
  const newParams:any = { ...remParams };

  if (mangaid) newParams.mangaid = strToInt(mangaid);
  if (chapternum) newParams.chapternum = strToInt(chapternum);
  if (length) newParams.length = strToInt(length);
  if (page) newParams.page = strToInt(page);
  if (ids) newParams.ids = idsStringToArr(ids);
  if (not_ids) newParams.notIds = idsStringToArr(not_ids);

  return newParams;
}

const handlerFactory = (f:(params:object) => Promise<any>) => (e, ctx, cb) => {
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
          "Cache-Control": "no-store, must-revalidate",
          "Expires": "0",
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

export const getManga = handlerFactory(getMangaEndpoint);
export const getChapter = handlerFactory(getChapterEndpoint);
export const getGenre = handlerFactory(getGenreEndpoint);
export const getList = handlerFactory(getListEndpoint);
export const getPopular = handlerFactory(getPopularEndpoint);
export const getRecommendations = handlerFactory(getRecommendationsEndpoint);
export const getReleases = handlerFactory(getReleasesEndpoint);
export const searchMangas = handlerFactory(searchMangasEndpoint);
export const updateMangas = handlerFactory(updateMangasEndpoint);
export const updateMangasources = handlerFactory(updateMangasourcesEndpoint);
export const updateReleases = handlerFactory(updateReleasesEndpoint);
