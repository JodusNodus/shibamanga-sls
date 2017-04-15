import * as request from "request-promise-lite";
import * as cheerio from "cheerio";
import stringToEpoch from "../utils/stringToEpoch";
import toSlug from "../utils/toSlug";

import { ReleaseItem } from "../interfaces/releases"; 
import { ChapterListItem, Page, MangaListItem } from "../interfaces/chapter";
import { Source } from "../interfaces/source";

class MangaEden implements Source {
  name: string;
  baseURL: string;
  imgURL: string;

  constructor() {
    this.name = "mangaeden";
    this.baseURL = "https://www.mangaeden.com/api";
    this.imgURL = "https://cdn.mangaeden.com/mangasimg";

    this.getChapter = this.getChapter.bind(this);
    this.getChapterList = this.getChapterList.bind(this);
    this.getList = this.getList.bind(this);
    this.getReleases = this.getReleases.bind(this);
  }
  getChapter(mangaalias:string, chapteralias:string):Promise<Page[]> {
    return request
      .get(`${this.baseURL}/chapter/${chapteralias}`, { json: true })
      .then((data) => {
        const pages = data.images.reverse().map(([pageId, img]) => ({
          pagenum: pageId + 1,
          img: `${this.imgURL}/${img}`,
        }));
        return pages;
      });
  }
  getChapterList(mangaalias:string):Promise<ChapterListItem[]> {
    return request
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
        return chapterList;
      })
  }
  getList():Promise<MangaListItem[]> {
    return request
      .get(`${this.baseURL}/list/0`, { json: true })
      .then((data) => {
        const mangas = data.manga.map(({ i, t }) => ({
          mangaalias: i,
          mangaslug: toSlug(t),
        }));
        return mangas;
      });
  }
  getReleases():Promise<ReleaseItem[]> {
    return request
      .get("http://www.mangaeden.com/ajax/news/1/0/0/")
      .then(body => cheerio.load(`<body>${body}</body>`))
      .then(($) => {
        const releases:ReleaseItem[] = [];

        const $rows = $("body").find("li");

        if ($rows.length < 1) {
          throw new Error("no rows found");
        }

        $rows.each((i:number, elem) => {
          const linkPrefix = "/en/en-manga/";
          const $a = $(elem).find(".openManga, .closedManga");
          const aliasid:string = $a
            .attr("href")
            .replace(linkPrefix, "")
            .replace("/", "");
          const title:string = $a.text();

          const chaptersEls = $(elem).find(".chapterLink");

          const chapternums:number[] = [];

          chaptersEls.each((i, chapter) => {
            const chapterAliasid = $(chapter)
              .attr("href")
              .replace(`${linkPrefix}${aliasid}/`, "");
            const chapternum:number = parseInt(chapterAliasid);
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
        return releases;
      })
  }
};

export default new MangaEden();