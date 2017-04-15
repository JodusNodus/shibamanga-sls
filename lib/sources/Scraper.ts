import * as request from "request-promise-lite";
import * as cheerio from "cheerio";
import stringToEpoch from "../utils/stringToEpoch";
import toSlug from "../utils/toSlug";

import { ReleaseItem } from "../interfaces/releases";
import { ChapterListItem, Page, MangaListItem } from "../interfaces/chapter";
import { Source, Context } from "../interfaces/source";

export default class Scraper implements Source {
  name: string;
  baseURL: string;
  context: Context;

  constructor(name:string, baseURL:string, context:Context) {
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
  async requestHTML(template:string, attr:object = {}) {
    let path = template;
    Object.keys(attr).forEach((key) => {
      path = path.replace(`:${key}`, attr[key]);
    });

    const res = await request.get(`${this.baseURL}/${path}`);
    return cheerio.load(res.toString());
  }
  async requestPage(mangaalias:string, chapteralias:string, pagenum:number):Promise<[Page, number]> {
    const ctx = this.context.chapterPage;
    const $ = await this.requestHTML(ctx.path, { mangaalias, chapteralias, pagenum });
    const pageCount:number = $(ctx.selectors.pageCount).length;
    const img:string = $(ctx.selectors.img).attr("src");
    const page:Page = { pagenum, img };
    return [page, pageCount];
  }
  async getChapter(mangaalias:string, chapteralias:string):Promise<Page[]> {
    const [page, pageCount] = await this.requestPage(mangaalias, chapteralias, 1);
    const pages:Page[] = [page];

    const promises = new Array(pageCount - 1)
      .fill(0)
      .map((x, i) => this.requestPage(mangaalias, chapteralias, i + 2));

    const otherPages = await Promise.all(promises);
    otherPages.forEach(([page]) => {
      pages.push(page);
    });
    return pages;
  }
  async getChapterList(mangaalias:string):Promise<ChapterListItem[]> {
    const ctx = this.context.chapterList;
    const $ = await this.requestHTML(ctx.path, { mangaalias })
    const chapters:ChapterListItem[] = [];

    const $rows = $(ctx.selectors.container).find(ctx.selectors.row);

    if (ctx.selectors.remove) {
      $rows.find(ctx.selectors.remove).text("");
    }

    $rows.each((i:number, elem) => {
      const chapter:string = $(elem).text();
      const title:string = ctx.regex.title.exec(chapter)[1].trim();

      const href:string = $(elem).find(ctx.selectors.link).attr("href");
      const chapteralias:string = ctx.regex.chapteralias.exec(href)[1];

      let chapternum:number;
      if (ctx.regex.chapternum) {
        chapternum = parseFloat(ctx.regex.chapternum.exec(chapter)[1]);
      } else {
        chapternum = parseFloat(chapteralias);
      }

      const dateString:string = ctx.regex.date.exec(chapter)[1];
      const date:number = stringToEpoch(dateString, ctx.dateFormat);

      chapters.push({
        chapteralias,
        chapternum,
        date,
        title,
      });
    });
    return chapters;
  }
  async getList():Promise<MangaListItem[]> {
    const ctx = this.context.list;
    const $ = await this.requestHTML(ctx.path)
    const mangas:MangaListItem[] = [];

    const $rows = $(ctx.selectors.container).find(ctx.selectors.row);

    $rows.each((i, elem) => {
      const href:string = $(elem).attr("href");
      const mangaalias:string = ctx.regex.mangaalias.exec(href)[1];
      const title:string = $(elem).text();

      mangas.push({
        mangaslug: toSlug(title),
        mangaalias,
      });
    });

    return mangas;
  }
  async getReleases():Promise<ReleaseItem[]> {
    const ctx = this.context.releases;
    const $ = await this.requestHTML(ctx.path)
    const releases:ReleaseItem[] = [];

    const $rows = $(ctx.selectors.container).find(ctx.selectors.row);

    $rows.each((i, elem) => {
      let dateString:string = $(elem).find(ctx.selectors.date).text();
      dateString = ctx.regex.date.exec(dateString)[1];
      const date:number = stringToEpoch(dateString, ctx.dateFormat);

      const title:string = $(elem).find(ctx.selectors.title).text();
      const mangaslug:string = toSlug(title);

      const chapternums:number[] = [];

      const $chapters = $(elem).find(ctx.selectors.chapters);
      $chapters.each((i, chapter) => {
        const text:string = $(chapter).text();
        let chapternum:number = parseInt(ctx.regex.chapternum.exec(text)[1]);
        chapternums.push(chapternum);
      });

      releases.push({
        mangaslug,
        date,
        chapternums,
      });
    });

    return releases;
  }
};
