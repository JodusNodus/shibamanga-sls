const request = require("request-promise-lite");
const cheerio = require("cheerio");
const stringToEpoch = require("../utils/stringToEpoch");
const toSlug = require("../utils/toSlug");

module.exports = class MangaEden {
  constructor() {
    this.name = "mangaeden";
    this.baseURL = "https://www.mangaeden.com/api";
    this.imgURL = "https://cdn.mangaeden.com/mangasimg";

    this.getChapter = this.getChapter.bind(this);
    this.getChapterList = this.getChapterList.bind(this);
    this.getList = this.getList.bind(this);
    this.getReleases = this.getReleases.bind(this);
  }
  getChapter(mangaalias, chapteralias) {
    return new Promise((res, rej) => {
      request
        .get(`${this.baseURL}/chapter/${chapteralias}`, { json: true })
        .then((data) => {
          const pages = data.images.reverse().map(([pageId, img]) => ({
            pagenum: pageId + 1,
            img: `${this.imgURL}/${img}`,
          }));
          res(pages);
        })
        .catch(rej);
    });
  }
  getChapterList(mangaalias) {
    return new Promise((res, rej) => {
      request
        .get(`${this.baseURL}/manga/${mangaalias}`, { json: true })
        .then((data) => {
          const chapterList = data.chapters.reverse().map(([
            chapternum,
            date,
            title,
            chapteralias,
          ]) => ({
            chapternum,
            chapteralias,
            title,
            date: date * 1000,
          }));
          res(chapterList);
        })
        .catch(rej);
    });
  }
  getList() {
    return new Promise((res, rej) => {
      request
        .get(`${this.baseURL}/list/0`, { json: true })
        .then((data) => {
          const mangas = data.manga.map(({ i, t }) => ({
            mangaalias: i,
            mangaslug: toSlug(t),
          }));
          res(mangas);
        })
        .catch(rej);
    });
  }
  getReleases() {
    return new Promise((res, rej) => {
      request
        .get("http://www.mangaeden.com/ajax/news/1/0/0/")
        .then(body => cheerio.load(`<body>${body}</body>`))
        .then(($) => {
          const releases = [];

          const $rows = $("body").find("li");

          if ($rows.length < 1) {
            rej("no rows found");
          }

          $rows.each((i, elem) => {
            const linkPrefix = "/en/en-manga/";
            const $a = $(elem).find(".openManga, .closedManga");
            const aliasid = $a
              .attr("href")
              .replace(linkPrefix, "")
              .replace("/", "");
            const title = $a.text();

            const chaptersEls = $(elem).find(".chapterLink");

            const chapternums = [];

            chaptersEls.each((i, chapter) => {
              const chapterAliasid = $(chapter)
                .attr("href")
                .replace(`${linkPrefix}${aliasid}/`, "");
              const chapternum = parseInt(chapterAliasid, 10);
              chapternums.push(chapternum);
            });

            const dateString = $(elem).find(".chapterDate").first().text();
            const date = stringToEpoch(dateString, "MMM D, YYYY");

            releases.push({
              mangaslug: toSlug(title),
              date,
              chapternums,
            });
          });
          res(releases);
        })
        .catch(rej);
    });
  }
};
