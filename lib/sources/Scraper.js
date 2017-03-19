const request = require("request-promise");
const cheerio = require("cheerio");
const stringToEpoch = require("../utils/stringToEpoch");
const toSlug = require("../utils/toSlug");
const Promise = require("bluebird");

module.exports = class Scraper {
  constructor({ name = "", baseURL = "", context = {} }) {
    this.name = name;
    this.baseURL = baseURL;
    this.context = context;

    this.requestHTML = this.requestHTML.bind(this);
    this.requestPage = this.requestPage.bind(this);
    this.getChapter = this.getChapter.bind(this);
    this.getChapterList = this.getChapterList.bind(this);
    this.getList = this.getList.bind(this);
    this.getReleases = this.getReleases.bind(this);
  }
  requestHTML(template, attr = {}) {
    let path = template;
    Object.keys(attr).forEach((key) => {
      path = path.replace(`:${key}`, attr[key]);
    });

    return request({
      url: `${this.baseURL}/${path}`,
      transform: cheerio.load,
    });
  }
  requestPage(mangaalias, chapteralias, pagenum) {
    const ctx = this.context.chapterPage;
    return new Promise((res, rej) => {
      this.requestHTML(ctx.path, { mangaalias, chapteralias, pagenum })
        .then(($) => {
          const pageCount = $(ctx.selectors.pageCount).length;
          const img = $(ctx.selectors.img).attr("src");
          const page = { pagenum, img };
          res([page, pageCount]);
        })
        .catch(rej);
    });
  }
  getChapter(mangaalias, chapteralias) {
    return new Promise((res, rej) => {
      const pages = [];
      this.requestPage(mangaalias, chapteralias, 1)
        .then(([page, pageCount]) => {
          pages[0] = page;

          const promises = new Array(pageCount - 1)
            .fill(0)
            .map((x, i) => this.requestPage(mangaalias, chapteralias, i + 2));

          return Promise.all(promises);
        })
        .then((otherPages) => {
          otherPages.forEach(([page]) => {
            pages.push(page);
          });
          res(pages);
        })
        .catch(rej);
    });
  }
  getChapterList(mangaalias) {
    const ctx = this.context.chapterList;
    return new Promise((res, rej) => {
      this.requestHTML(ctx.path, { mangaalias })
        .then(($) => {
          const chapters = [];

          const $rows = $(ctx.selectors.container).find(ctx.selectors.row);

          if (ctx.selectors.remove) {
            $rows.find(ctx.selectors.remove).text("");
          }

          $rows.each((i, elem) => {
            const chapter = $(elem).text();
            const title = ctx.regex.title.exec(chapter)[1].trim();

            const href = $(elem).find(ctx.selectors.link).attr("href");
            const chapteralias = ctx.regex.chapteralias.exec(href)[1];

            let chapternum;
            if (ctx.regex.chapternum) {
              chapternum = ctx.regex.chapternum.exec(chapter)[1];
            } else {
              chapternum = chapteralias;
            }
            chapternum = parseFloat(chapternum, 10);

            const dateString = ctx.regex.date.exec(chapter)[1];
            const date = stringToEpoch(dateString, ctx.dateFormat);

            chapters.push({
              chapteralias,
              chapternum,
              date,
              title,
            });
          });
          res(chapters);
        })
        .catch(rej);
    });
  }
  getList() {
    const ctx = this.context.list;
    return new Promise((res, rej) => {
      this.requestHTML(ctx.path)
        .then(($) => {
          const mangas = [];

          const $rows = $(ctx.selectors.container).find(ctx.selectors.row);

          $rows.each((i, elem) => {
            const href = $(elem).attr("href");
            const mangaalias = ctx.regex.mangaalias.exec(href)[1];
            const title = $(elem).text();

            mangas.push({
              mangaslug: toSlug(title),
              mangaalias,
            });
          });
          res(mangas);
        })
        .catch(rej);
    });
  }
  getReleases() {
    const ctx = this.context.releases;
    return new Promise((res, rej) => {
      this.requestHTML(ctx.path)
        .then(($) => {
          const releases = [];

          const $rows = $(ctx.selectors.container).find(ctx.selectors.row);

          $rows.each((i, elem) => {
            let dateString = $(elem).find(ctx.selectors.date).text();
            dateString = ctx.regex.date.exec(dateString)[1];
            const date = stringToEpoch(dateString, ctx.dateFormat);

            const title = $(elem).find(ctx.selectors.title).text();
            const mangaslug = toSlug(title);

            const chapternums = [];

            const chaptersEls = $(elem).find(ctx.selectors.chapters);

            chaptersEls.each((i, chapter) => {
              const text = $(chapter).text();
              let chapternum = ctx.regex.chapternum.exec(text)[1];
              chapternum = parseInt(chapternum, 10);
              chapternums.push(chapternum);
            });

            releases.push({
              mangaslug,
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
